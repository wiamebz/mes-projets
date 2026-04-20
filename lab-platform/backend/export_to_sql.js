const mongoose = require('mongoose')

mongoose.connect('mongodb://mongodb:27017/lab-platform')
    .then(async () => {

        const User = mongoose.model('User', new mongoose.Schema({
            nom: String,
            email: String,
            role: String,
            createdAt: Date
        }))

        const Lab = mongoose.model('Lab', new mongoose.Schema({
            titre: String,
            description: String,
            difficulte: String,
            ordre: Number
        }))

        const Session = mongoose.model('Session', new mongoose.Schema({
            user_id: mongoose.Schema.Types.ObjectId,
            lab_id: mongoose.Schema.Types.ObjectId,
            date_connexion: Date,
            temps_passe: Number,
            reussi: Boolean,
            statut: String
        }))

        const users = await User.find()
        const labs = await Lab.find()
        const sessions = await Session.find()

        let sql = ''

        // ── USERS ──────────────────────────────
        sql += `-- =====================\n`
        sql += `-- TABLE USERS\n`
        sql += `-- =====================\n`
        sql += `CREATE TABLE IF NOT EXISTS users (\n`
        sql += `  id VARCHAR(24) PRIMARY KEY,\n`
        sql += `  nom VARCHAR(255),\n`
        sql += `  email VARCHAR(255) UNIQUE,\n`
        sql += `  role VARCHAR(50),\n`
        sql += `  created_at DATETIME\n`
        sql += `);\n\n`

        for (const u of users) {
            const nom = u.nom?.replace(/'/g, "''") || ''
            const email = u.email?.replace(/'/g, "''") || ''
            const role = u.role || 'user'
            const date = u.createdAt?.toISOString().slice(0, 19).replace('T', ' ') || '2026-01-01 00:00:00'
            sql += `INSERT IGNORE INTO users VALUES ('${u._id}', '${nom}', '${email}', '${role}', '${date}');\n`
        }

        sql += `\n`

        // ── LABS ───────────────────────────────
        sql += `-- =====================\n`
        sql += `-- TABLE LABS\n`
        sql += `-- =====================\n`
        sql += `CREATE TABLE IF NOT EXISTS labs (\n`
        sql += `  id VARCHAR(24) PRIMARY KEY,\n`
        sql += `  titre VARCHAR(255),\n`
        sql += `  description TEXT,\n`
        sql += `  difficulte VARCHAR(50),\n`
        sql += `  ordre INT\n`
        sql += `);\n\n`

        for (const l of labs) {
            const titre = l.titre?.replace(/'/g, "''") || ''
            const description = l.description?.replace(/'/g, "''") || ''
            const difficulte = l.difficulte || 'Débutant'
            const ordre = l.ordre || 0
            sql += `INSERT IGNORE INTO labs VALUES ('${l._id}', '${titre}', '${description}', '${difficulte}', ${ordre});\n`
        }

        sql += `\n`

        // ── SESSIONS ───────────────────────────
        sql += `-- =====================\n`
        sql += `-- TABLE SESSIONS\n`
        sql += `-- =====================\n`
        sql += `CREATE TABLE IF NOT EXISTS sessions (\n`
        sql += `  id VARCHAR(24) PRIMARY KEY,\n`
        sql += `  user_id VARCHAR(24),\n`
        sql += `  lab_id VARCHAR(24),\n`
        sql += `  date_connexion DATETIME,\n`
        sql += `  temps_passe INT,\n`
        sql += `  reussi BOOLEAN,\n`
        sql += `  statut VARCHAR(50),\n`
        sql += `  FOREIGN KEY (user_id) REFERENCES users(id),\n`
        sql += `  FOREIGN KEY (lab_id) REFERENCES labs(id)\n`
        sql += `);\n\n`

        for (const s of sessions) {
            const date = s.date_connexion?.toISOString().slice(0, 19).replace('T', ' ') || '2026-01-01 00:00:00'
            const reussi = s.reussi ? 1 : 0
            const statut = s.statut || 'abandonne'
            sql += `INSERT IGNORE INTO sessions VALUES ('${s._id}', '${s.user_id}', '${s.lab_id}', '${date}', ${s.temps_passe || 0}, ${reussi}, '${statut}');\n`
        }

        console.log(sql)
        mongoose.disconnect()
    })