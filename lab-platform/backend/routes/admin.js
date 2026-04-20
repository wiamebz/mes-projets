const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Session = require('../models/Session')
const Lab = require('../models/Lab')
const mysql = require('mysql2/promise')

// GET tous les users avec leurs stats
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-mot_de_passe')

        const usersAvecStats = await Promise.all(users.map(async (user) => {
            const sessions = await Session.find({
                user_id: user._id,
                statut: 'termine'
            })

            const totalSessions    = sessions.length
            const sessionsReussies = sessions.filter(s => s.reussi).length
            const tauxReussite     = totalSessions > 0
                ? Math.round((sessionsReussies / totalSessions) * 100)
                : 0

            return {
                _id:                user._id,
                nom:                user.nom,
                email:              user.email,
                createdAt:          user.createdAt,
                derniere_connexion: user.derniere_connexion || null,  // ← CHANGÉ : vient du User model
                total_labs:         totalSessions,
                taux_reussite:      tauxReussite
            }
        }))

        res.json(usersAvecStats)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// GET détails d'un user — avec catégorie + tauxCompletion par lab
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-mot_de_passe')

        const sessions = await Session.find({
            user_id: req.params.id
        }).populate('lab_id', 'titre categorie difficulte ordre')
          .sort({ date_connexion: -1 })

        const stats = {
            total_sessions:    sessions.length,
            sessions_terminees: sessions.filter(s => s.statut === 'termine').length,
            sessions_reussies: sessions.filter(s => s.reussi).length,
            temps_moyen: sessions.length > 0
                ? Math.round(sessions.reduce((acc, s) => acc + s.temps_passe, 0) / sessions.length)
                : 0,
            taux_reussite: sessions.filter(s => s.statut === 'termine').length > 0
                ? Math.round(
                    (sessions.filter(s => s.reussi).length /
                     sessions.filter(s => s.statut === 'termine').length) * 100
                  )
                : 0
        }

        // Stats par catégorie
        const tousLesLabs = await Lab.find().sort({ ordre: 1 })

        const categoriesMap = {}
        for (const lab of tousLesLabs) {
            const cat = lab.categorie || 'Général'
            if (!categoriesMap[cat]) categoriesMap[cat] = []
            categoriesMap[cat].push(lab)
        }

        const categories = await Promise.all(
            Object.entries(categoriesMap).map(async ([nomCategorie, labs]) => {

                const labsAvecStats = await Promise.all(labs.map(async (lab) => {
                    const sessionsLab = sessions.filter(s =>
                        s.lab_id?._id?.toString() === lab._id.toString() ||
                        s.lab_id?.toString()       === lab._id.toString()
                    )

                    const meilleureSession = sessionsLab.reduce((best, s) => {
                        const ok     = s.etapes?.filter(e => e.completee).length ?? 0
                        const bestOk = best?.etapes?.filter(e => e.completee).length ?? 0
                        return ok >= bestOk ? s : best
                    }, sessionsLab[0] || null)

                    const etapesTotal    = meilleureSession?.etapes?.length ?? 0
                    const etapesOk       = meilleureSession?.etapes?.filter(e => e.completee).length ?? 0
                    const tauxCompletion = etapesTotal > 0
                        ? Math.round((etapesOk / etapesTotal) * 100)
                        : 0

                    const derniereSessionLab = sessionsLab[0] || null

                    return {
                        _id:            lab._id,
                        titre:          lab.titre,
                        difficulte:     lab.difficulte,
                        ordre:          lab.ordre,
                        tentatives:     sessionsLab.length,
                        etapesOk,
                        etapesTotal,
                        tauxCompletion,
                        derniereSession: derniereSessionLab?.date_connexion || null,
                    }
                }))

                const tauxCategorie = labsAvecStats.length > 0
                    ? Math.round(
                        labsAvecStats.reduce((s, l) => s + l.tauxCompletion, 0) /
                        labsAvecStats.length
                      )
                    : 0

                return {
                    nom:            nomCategorie,
                    tauxCategorie,
                    labs:           labsAvecStats
                }
            })
        )

        res.json({ user, sessions, stats, categories })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// DELETE reset tentatives d'un user pour un lab
router.delete('/reset/:userId/:labId', async (req, res) => {
    try {
        await Session.deleteMany({
            user_id: req.params.userId,
            lab_id:  req.params.labId
        })
        res.json({ message: 'Tentatives effacées' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// POST export MongoDB → MySQL
router.post('/export-mysql', async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        })

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(24) PRIMARY KEY,
                nom VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                role VARCHAR(50),
                created_at DATETIME
            )
        `)

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS labs (
                id VARCHAR(24) PRIMARY KEY,
                titre VARCHAR(255),
                description TEXT,
                difficulte VARCHAR(50),
                ordre INT
            )
        `)

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(24) PRIMARY KEY,
                user_id VARCHAR(24),
                lab_id VARCHAR(24),
                date_connexion DATETIME,
                temps_passe INT,
                reussi BOOLEAN,
                statut VARCHAR(50)
            )
        `)

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS etapes (
                id VARCHAR(24) PRIMARY KEY,
                session_id VARCHAR(24),
                nom VARCHAR(255),
                description TEXT,
                completee BOOLEAN,
                temps INT
            )
        `)

        const users = await User.find()
        for (const u of users) {
            const date = u.createdAt?.toISOString().slice(0, 19).replace('T', ' ') || '2026-01-01 00:00:00'
            await connection.execute(
                `INSERT IGNORE INTO users VALUES (?, ?, ?, ?, ?)`,
                [u._id.toString(), u.nom || '', u.email || '', u.role || 'user', date]
            )
        }

        const labs = await Lab.find()
        for (const l of labs) {
            await connection.execute(
                `INSERT IGNORE INTO labs VALUES (?, ?, ?, ?, ?)`,
                [l._id.toString(), l.titre || '', l.description || '', l.difficulte || 'Débutant', l.ordre || 0]
            )
        }

        const sessions = await Session.find()
        for (const s of sessions) {
            const date = s.date_connexion?.toISOString().slice(0, 19).replace('T', ' ') || '2026-01-01 00:00:00'
            await connection.execute(
                `INSERT IGNORE INTO sessions VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [s._id.toString(), s.user_id?.toString(), s.lab_id?.toString(), date, s.temps_passe || 0, s.reussi ? 1 : 0, s.statut || 'abandonne']
            )

            if (s.etapes && s.etapes.length > 0) {
                for (const e of s.etapes) {
                    await connection.execute(
                        `INSERT IGNORE INTO etapes VALUES (?, ?, ?, ?, ?, ?)`,
                        [e._id.toString(), s._id.toString(), e.nom || '', e.description || '', e.completee ? 1 : 0, e.temps || 0]
                    )
                }
            }
        }

        await connection.end()

        res.json({
            message: 'Export vers MySQL réussi ✅',
            stats: {
                users: users.length,
                labs: labs.length,
                sessions: sessions.length
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

module.exports = router