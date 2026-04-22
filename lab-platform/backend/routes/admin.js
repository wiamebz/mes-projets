const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Session = require('../models/Session')
const Lab = require('../models/Lab')
const Categorie = require('../models/Categorie')
const mysql = require('mysql2/promise')

/* ─────────────────────────────────────────
   GET tous les users avec leurs stats
───────────────────────────────────────── */
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
                derniere_connexion: user.derniere_connexion || null,
                total_labs:         totalSessions,
                taux_reussite:      tauxReussite
            }
        }))

        res.json(usersAvecStats)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* ─────────────────────────────────────────
   GET détails d'un user
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   DELETE reset tentatives d'un user pour un lab
───────────────────────────────────────── */
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

/* ═════════════════════════════════════════════════════════════
   ROUTES : GESTION DES CATÉGORIES (PARCOURS)
═══════════════════════════════════════════════════════════════ */

/* GET toutes les catégories AVEC leurs labs */
router.get('/categories', async (req, res) => {
    try {
        const categories = await Categorie.find().sort({ ordre: 1 })
        const tousLesLabs = await Lab.find().sort({ ordre: 1 })

        const resultat = categories.map(cat => {
            const labs = tousLesLabs.filter(l => l.categorie === cat.nom)

            let etatCat = 'auto'
            let etatCatLabel = 'Automatique'
            if (cat.deblocage_manuel) {
                etatCat = 'deblocage_manuel'
                etatCatLabel = 'Débloquée (admin)'
            } else if (cat.verrouillage_manuel) {
                etatCat = 'verrouillage_manuel'
                etatCatLabel = 'Verrouillée (admin)'
            }

            return {
                _id:                 cat._id,
                nom:                 cat.nom,
                description:         cat.description,
                ordre:               cat.ordre,
                verrouillage_manuel: cat.verrouillage_manuel,
                deblocage_manuel:    cat.deblocage_manuel,
                date_ouverture:      cat.date_ouverture,
                etat:                etatCat,
                etatLabel:           etatCatLabel,
                nombreLabs:          labs.length,
                labs: labs.map(l => {
                    let etatLab = 'auto'
                    let etatLabLabel = 'Suit la catégorie'
                    if (l.deblocage_manuel) {
                        etatLab = 'deblocage_manuel'
                        etatLabLabel = 'Débloqué (admin)'
                    } else if (l.verrouillage_manuel) {
                        etatLab = 'verrouillage_manuel'
                        etatLabLabel = 'Verrouillé (admin)'
                    }
                    return {
                        _id:                 l._id,
                        titre:               l.titre,
                        difficulte:          l.difficulte,
                        ordre:               l.ordre,
                        verrouillage_manuel: l.verrouillage_manuel || false,
                        deblocage_manuel:    l.deblocage_manuel || false,
                        etat:                etatLab,
                        etatLabel:           etatLabLabel,
                    }
                }),
            }
        })

        res.json(resultat)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* PUT modifier une catégorie */
router.put('/categories/:id', async (req, res) => {
    try {
        const { verrouillage_manuel, deblocage_manuel, date_ouverture } = req.body

        if (verrouillage_manuel === true && deblocage_manuel === true) {
            return res.status(400).json({
                message: 'Une catégorie ne peut pas être à la fois verrouillée et débloquée'
            })
        }

        const categorie = await Categorie.findById(req.params.id)
        if (!categorie) return res.status(404).json({ message: 'Catégorie introuvable' })

        if (verrouillage_manuel !== undefined) categorie.verrouillage_manuel = verrouillage_manuel
        if (deblocage_manuel    !== undefined) categorie.deblocage_manuel    = deblocage_manuel
        if (date_ouverture      !== undefined) categorie.date_ouverture      = date_ouverture || null

        await categorie.save()

        res.json({ message: 'Catégorie mise à jour', categorie })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* PUT modifier un LAB (verrouillage / déblocage individuel) */
router.put('/labs/:id', async (req, res) => {
    try {
        const { verrouillage_manuel, deblocage_manuel } = req.body

        if (verrouillage_manuel === true && deblocage_manuel === true) {
            return res.status(400).json({
                message: 'Un lab ne peut pas être à la fois verrouillé et débloqué'
            })
        }

        const lab = await Lab.findById(req.params.id)
        if (!lab) return res.status(404).json({ message: 'Lab introuvable' })

        if (verrouillage_manuel !== undefined) lab.verrouillage_manuel = verrouillage_manuel
        if (deblocage_manuel    !== undefined) lab.deblocage_manuel    = deblocage_manuel

        await lab.save()

        res.json({ message: 'Lab mis à jour', lab })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* PUT actions en masse sur les labs d'une catégorie */
router.put('/categories/:id/labs-action', async (req, res) => {
    try {
        const { action } = req.body

        const categorie = await Categorie.findById(req.params.id)
        if (!categorie) return res.status(404).json({ message: 'Catégorie introuvable' })

        let update = {}
        if (action === 'lock_all') {
            update = { verrouillage_manuel: true, deblocage_manuel: false }
        } else if (action === 'unlock_all') {
            update = { verrouillage_manuel: false, deblocage_manuel: true }
        } else if (action === 'reset_all') {
            update = { verrouillage_manuel: false, deblocage_manuel: false }
        } else {
            return res.status(400).json({ message: 'Action invalide' })
        }

        const result = await Lab.updateMany(
            { categorie: categorie.nom },
            { $set: update }
        )

        res.json({
            message: `${result.modifiedCount} lab(s) mis à jour`,
            modifiedCount: result.modifiedCount,
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* ═════════════════════════════════════════════════════════════
   EXPORT MySQL — MODE COMPLET (remplace tout)
   Vide les tables puis réimporte toutes les données enrichies
═══════════════════════════════════════════════════════════════ */
router.post('/export-mysql', async (req, res) => {
    let connection = null

    try {
        connection = await mysql.createConnection({
            host:     process.env.MYSQL_HOST,
            user:     process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            multipleStatements: false,
        })

        console.log('🔄 Début export MySQL (mode complet)...')

        /* ─── 1. CRÉATION DES TABLES (avec tous les champs enrichis) ─── */

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(24) PRIMARY KEY,
                nom VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                role VARCHAR(50),
                derniere_connexion DATETIME NULL,
                created_at DATETIME,
                updated_at DATETIME NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `)

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS categories (
                id VARCHAR(24) PRIMARY KEY,
                nom VARCHAR(255) UNIQUE,
                description TEXT,
                ordre INT,
                verrouillage_manuel BOOLEAN DEFAULT FALSE,
                deblocage_manuel BOOLEAN DEFAULT FALSE,
                date_ouverture DATETIME NULL,
                created_at DATETIME,
                updated_at DATETIME NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `)

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS labs (
                id VARCHAR(24) PRIMARY KEY,
                titre VARCHAR(255),
                description TEXT,
                image_docker VARCHAR(255),
                difficulte VARCHAR(50),
                categorie VARCHAR(255),
                ordre INT,
                date_ouverture DATETIME NULL,
                verrouillage_manuel BOOLEAN DEFAULT FALSE,
                deblocage_manuel BOOLEAN DEFAULT FALSE,
                created_at DATETIME,
                updated_at DATETIME NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `)

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(24) PRIMARY KEY,
                user_id VARCHAR(24),
                lab_id VARCHAR(24),
                date_connexion DATETIME,
                temps_passe INT DEFAULT 0,
                nombre_questions INT DEFAULT 0,
                nombre_bonnes_reponses INT DEFAULT 0,
                reussi BOOLEAN DEFAULT FALSE,
                statut VARCHAR(50),
                created_at DATETIME,
                updated_at DATETIME NULL,
                INDEX idx_user (user_id),
                INDEX idx_lab (lab_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `)

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS etapes (
                id VARCHAR(24) PRIMARY KEY,
                session_id VARCHAR(24),
                nom VARCHAR(255),
                description TEXT,
                completee BOOLEAN DEFAULT FALSE,
                temps INT DEFAULT 0,
                INDEX idx_session (session_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `)

        /* ─── 2. VIDER LES TABLES (dans le bon ordre à cause des FK logiques) ─── */
        // On désactive les vérifications pour TRUNCATE rapide
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0')
        await connection.execute('TRUNCATE TABLE etapes')
        await connection.execute('TRUNCATE TABLE sessions')
        await connection.execute('TRUNCATE TABLE labs')
        await connection.execute('TRUNCATE TABLE categories')
        await connection.execute('TRUNCATE TABLE users')
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1')

        console.log(' Tables vidées')

        /* ─── HELPER : format date MongoDB → MySQL ─── */
        const toMysqlDate = d => {
            if (!d) return null
            try {
                return new Date(d).toISOString().slice(0, 19).replace('T', ' ')
            } catch (e) {
                return null
            }
        }

        /* ─── 3. IMPORTER USERS ─── */
        const users = await User.find()
        for (const u of users) {
            await connection.execute(
                `INSERT INTO users (id, nom, email, role, derniere_connexion, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    u._id.toString(),
                    u.nom || '',
                    u.email || '',
                    u.role || 'user',
                    toMysqlDate(u.derniere_connexion),
                    toMysqlDate(u.createdAt) || '2026-01-01 00:00:00',
                    toMysqlDate(u.updatedAt),
                ]
            )
        }
        console.log(`👥 ${users.length} users importés`)

        /* ─── 4. IMPORTER CATÉGORIES ─── */
        const categories = await Categorie.find()
        for (const c of categories) {
            await connection.execute(
                `INSERT INTO categories (id, nom, description, ordre, verrouillage_manuel, deblocage_manuel, date_ouverture, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    c._id.toString(),
                    c.nom || '',
                    c.description || '',
                    c.ordre || 0,
                    c.verrouillage_manuel ? 1 : 0,
                    c.deblocage_manuel ? 1 : 0,
                    toMysqlDate(c.date_ouverture),
                    toMysqlDate(c.createdAt) || '2026-01-01 00:00:00',
                    toMysqlDate(c.updatedAt),
                ]
            )
        }
        console.log(` ${categories.length} catégories importées`)

        /* ─── 5. IMPORTER LABS ─── */
        const labs = await Lab.find()
        for (const l of labs) {
            await connection.execute(
                `INSERT INTO labs (id, titre, description, image_docker, difficulte, categorie, ordre, date_ouverture, verrouillage_manuel, deblocage_manuel, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    l._id.toString(),
                    l.titre || '',
                    l.description || '',
                    l.image_docker || '',
                    l.difficulte || 'Débutant',
                    l.categorie || 'Général',
                    l.ordre || 0,
                    toMysqlDate(l.date_ouverture),
                    l.verrouillage_manuel ? 1 : 0,
                    l.deblocage_manuel ? 1 : 0,
                    toMysqlDate(l.createdAt) || '2026-01-01 00:00:00',
                    toMysqlDate(l.updatedAt),
                ]
            )
        }
        console.log(` ${labs.length} labs importés`)

        /* ─── 6. IMPORTER SESSIONS + ÉTAPES ─── */
        const sessions = await Session.find()
        let totalEtapes = 0
        for (const s of sessions) {
            await connection.execute(
                `INSERT INTO sessions (id, user_id, lab_id, date_connexion, temps_passe, nombre_questions, nombre_bonnes_reponses, reussi, statut, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    s._id.toString(),
                    s.user_id?.toString() || null,
                    s.lab_id?.toString() || null,
                    toMysqlDate(s.date_connexion) || '2026-01-01 00:00:00',
                    s.temps_passe || 0,
                    s.nombre_questions || 0,
                    s.nombre_bonnes_reponses || 0,
                    s.reussi ? 1 : 0,
                    s.statut || 'abandonne',
                    toMysqlDate(s.createdAt) || '2026-01-01 00:00:00',
                    toMysqlDate(s.updatedAt),
                ]
            )

            if (s.etapes && s.etapes.length > 0) {
                for (const e of s.etapes) {
                    await connection.execute(
                        `INSERT INTO etapes (id, session_id, nom, description, completee, temps) VALUES (?, ?, ?, ?, ?, ?)`,
                        [
                            e._id.toString(),
                            s._id.toString(),
                            e.nom || '',
                            e.description || '',
                            e.completee ? 1 : 0,
                            e.temps || 0,
                        ]
                    )
                    totalEtapes++
                }
            }
        }
        console.log(`📊 ${sessions.length} sessions + ${totalEtapes} étapes importées`)

        await connection.end()
        console.log('Export MySQL terminé avec succès')

        res.json({
            message: 'Export vers MySQL réussi — toutes les données ont été remplacées',
            mode: 'complet',
            stats: {
                users:      users.length,
                categories: categories.length,
                labs:       labs.length,
                sessions:   sessions.length,
                etapes:     totalEtapes,
            }
        })

    } catch (err) {
        console.error('Erreur export MySQL:', err)
        if (connection) {
            try { await connection.end() } catch (e) {}
        }
        res.status(500).json({ message: err.message })
    }
})

module.exports = router