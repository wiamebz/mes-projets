
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const Docker = require('dockerode')
const docker = new Docker()
const authMiddleware = require('./middleware/auth')
const adminMiddleware = require('./middleware/admin')
const jwt = require('jsonwebtoken')

const labsRoutes = require('./routes/labs')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const Session = require('./models/Session')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: '*' }
})

app.use(cors())
app.use(express.json())

app.use('/api/labs', authMiddleware, labsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'Serveur fonctionne !' })
})

function compterQuestions(buffer) {
    const matches = buffer.match(/Question \d+\/\d+/g)
    return matches ? matches.length : 0
}

function compterBonnes(buffer) {
    const matches = buffer.match(/Correct !/g)
    return matches ? matches.length : 0
}

// Supprimer le cluster Kind après la fin du lab
async function supprimerClusterKind() {
    try {
        const containers = await docker.listContainers()
        for (const cont of containers) {
            if (cont.Names.some(n => n.includes('lab-cluster'))) {
                const c = docker.getContainer(cont.Id)
                await c.stop()
                await c.remove()
                console.log('Cluster Kind supprimé ✅')
            }
        }
    } catch (err) {
        console.log('Cluster Kind déjà supprimé')
    }
}

io.on('connection', (socket) => {

    socket.on('start_lab', async (data) => {
        try {
            const token = data.token
            if (!token) {
                socket.emit('output', 'Non autorisé !')
                return
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user_id = decoded.id

            const session = await Session.create({
                user_id,
                lab_id: data.lab_id,
                date_connexion: new Date(),
                statut: 'en_cours'
            })

            const tempsDebut = Date.now()

            const conteneur = await docker.createContainer({
                Image: data.image_docker,
                Tty: true,
                OpenStdin: true,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                Cmd: data.cmd || ['python', '-u', '/lab/addition.py'],
                HostConfig: {
                    Privileged: true,
                    Binds: ['/var/run/docker.sock:/var/run/docker.sock']
                }
            })

            await conteneur.start()
            socket.emit('conteneur_id', conteneur.id)

            // Un seul stream pour input et output
            const stream = await conteneur.attach({
                stream: true,
                stdin: true,
                stdout: true,
                stderr: true,
                hijack: true
            })

            let outputBuffer = ''
            let isFirstChunk = true

            // Timeout 30 minutes
            const timeout = setTimeout(async () => {
                try {
                    const tempsPasse = Math.floor((Date.now() - tempsDebut) / 1000)
                    const total = compterQuestions(outputBuffer)
                    const bonnes = compterBonnes(outputBuffer)

                    await Session.findByIdAndUpdate(session._id, {
                        temps_passe: tempsPasse,
                        nombre_questions: total,
                        nombre_bonnes_reponses: bonnes,
                        reussi: false,
                        statut: 'abandonne'
                    })

                    try {
                        await supprimerClusterKind()
                        await conteneur.stop()
                        await conteneur.remove()
                    } catch (err) {
                        console.log('Conteneur déjà supprimé')
                    }

                    socket.emit('output', '\n⏱️ Temps limite de 30 minutes dépassé ! Lab terminé.')
                    socket.emit('lab_termine')
                    console.log('Lab terminé par timeout ✅')
                } catch (err) {
                    console.log(err)
                }
            }, 30 * 60 * 1000)

            stream.on('data', (chunk) => {
                let text = chunk.toString('utf8')

                // Filtrer le header JSON du premier chunk
                if (isFirstChunk) {
                    const jsonEnd = text.indexOf('}')
                    if (jsonEnd !== -1 && text.startsWith('{')) {
                        text = text.slice(jsonEnd + 1)
                    }
                    isFirstChunk = false
                }

                outputBuffer += text
                socket.emit('output', text)

                // Détecter les étapes
                const lines = text.split('\n')
                lines.forEach(async (line) => {
                    const stepMatch = line.match(/STEP_COMPLETED:(\w+):(true|false):(.+)/)
                    if (stepMatch) {
                        const etape = {
                            nom: stepMatch[1],
                            completee: stepMatch[2] === 'true',
                            description: stepMatch[3].trim(),
                            temps: Math.floor((Date.now() - tempsDebut) / 1000)
                        }
                        await Session.findByIdAndUpdate(session._id, {
                            $push: { etapes: etape }
                        })
                        socket.emit('step_completed', etape)
                    }
                })
            })

            stream.on('end', async () => {
                clearTimeout(timeout)
                try {
                    const tempsPasse = Math.floor((Date.now() - tempsDebut) / 1000)
                    const labComplete = outputBuffer.includes('LAB_COMPLETED')

                    // Récupérer les étapes sauvegardées
                    const sessionActuelle = await Session.findById(session._id)
                    const etapes = sessionActuelle.etapes || []

                    let reussi = false
                    let statut = labComplete ? 'termine' : 'abandonne'

                    if (labComplete) {
                        if (etapes.length > 0) {
                            // Lab avec étapes → toutes les étapes doivent être complétées
                            reussi = etapes.every(e => e.completee === true)
                        } else {
                            // Lab avec questions (addition/soustraction)
                            const total = compterQuestions(outputBuffer)
                            const bonnes = compterBonnes(outputBuffer)
                            reussi = total > 0 && bonnes === total
                        }
                    }

                    await Session.findByIdAndUpdate(session._id, {
                        temps_passe: tempsPasse,
                        reussi,
                        statut
                    })

                    await supprimerClusterKind()
                    await conteneur.remove()
                    socket.emit('lab_termine')
                    console.log(`Session — statut: ${statut} reussi: ${reussi} ✅`)
                } catch (err) {
                    console.log(err)
                }
            })

            stream.on('error', (err) => {
                socket.emit('output', 'Erreur : ' + err.message)
            })

            socket.on('input', (inputData) => {
                stream.write(inputData)
            })

            socket.on('disconnect', async () => {
                clearTimeout(timeout)
                try {
                    const tempsPasse = Math.floor((Date.now() - tempsDebut) / 1000)
                    const sessionActuelle = await Session.findById(session._id)

                    if (sessionActuelle.statut !== 'termine') {
                        const total = compterQuestions(outputBuffer)
                        const bonnes = compterBonnes(outputBuffer)

                        await Session.findByIdAndUpdate(session._id, {
                            temps_passe: tempsPasse,
                            nombre_questions: total,
                            nombre_bonnes_reponses: bonnes,
                            reussi: false,
                            statut: 'abandonne'
                        })
                    }

                    try {
                        await supprimerClusterKind()
                        await conteneur.stop()
                        await conteneur.remove()
                    } catch (dockerErr) {
                        console.log('Conteneur déjà supprimé')
                    }

                    console.log('Conteneur supprimé ✅')
                } catch (err) {
                    console.log(err)
                }
            })

            socket.on('stop_lab', async (stopData) => {
                clearTimeout(timeout)
                try {
                    const tempsPasse = Math.floor((Date.now() - tempsDebut) / 1000)
                    const sessionActuelle = await Session.findById(session._id)

                    if (sessionActuelle.statut !== 'termine') {
                        const total = compterQuestions(outputBuffer)
                        const bonnes = compterBonnes(outputBuffer)

                        await Session.findByIdAndUpdate(session._id, {
                            temps_passe: tempsPasse,
                            nombre_questions: total,
                            nombre_bonnes_reponses: bonnes,
                            reussi: false,
                            statut: 'abandonne'
                        })
                    }

                    try {
                        await supprimerClusterKind()
                        const cont = docker.getContainer(stopData.conteneur_id)
                        await cont.stop()
                        await cont.remove()
                    } catch (dockerErr) {
                        console.log('Conteneur déjà supprimé')
                    }

                    console.log('Stop lab traité ✅')
                } catch (err) {
                    console.log(err)
                }
            })

        } catch (err) {
            socket.emit('output', 'Erreur : ' + err.message)
        }
    })
})

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connecté ✅'))
    .catch(err => console.log('Erreur MongoDB :', err))

const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`Serveur tourne sur le port ${PORT} ✅`)
})