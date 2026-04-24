const fs      = require('fs')
const path    = require('path')
const tar     = require('tar')
const ExcelJS = require('exceljs')

const User      = require('./models/User')
const Lab       = require('./models/Lab')
const Session   = require('./models/Session')
const Categorie = require('./models/Categorie')

/* ─────────────────────────────────────────
   Dossier de sortie
───────────────────────────────────────── */
const EXPORTS_DIR = path.join(__dirname, 'exports')
if (!fs.existsSync(EXPORTS_DIR)) fs.mkdirSync(EXPORTS_DIR, { recursive: true })

/* ─────────────────────────────────────────
   Helpers styles Excel
───────────────────────────────────────── */
function formatDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

const HEADER_STYLE = {
    font:      { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 },
    fill:      { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF7900' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
        top:    { style: 'thin', color: { argb: 'FFCC6000' } },
        bottom: { style: 'thin', color: { argb: 'FFCC6000' } },
        left:   { style: 'thin', color: { argb: 'FFCC6000' } },
        right:  { style: 'thin', color: { argb: 'FFCC6000' } },
    }
}

const ROW_EVEN  = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF8F0' } } }
const STYLE_OK  = { font: { color: { argb: 'FF2E7D32' }, bold: true } }
const STYLE_NON = { font: { color: { argb: 'FFC62828' }, bold: true } }
const STYLE_NEU = { font: { color: { argb: 'FF595959' } } }

function appliquerStyleHeader(sheet, colonnes) {
    const headerRow = sheet.getRow(1)
    headerRow.height = 28
    colonnes.forEach((col, i) => {
        const cell = headerRow.getCell(i + 1)
        cell.value = col.header
        cell.style = { ...HEADER_STYLE }
    })
}

function autoWidth(sheet) {
    sheet.columns.forEach(col => {
        let max = 12
        col.eachCell({ includeEmpty: true }, cell => {
            const len = cell.value ? String(cell.value).length : 0
            if (len > max) max = len
        })
        col.width = Math.min(max + 4, 55)
    })
}

/* ═════════════════════════════════════════════════════════════
   FICHIER 1 — scores_YYYY-MM-DD.xlsx
═══════════════════════════════════════════════════════════════ */
async function genererExcelScores(dateStr) {
    const filePath = path.join(EXPORTS_DIR, `scores_${dateStr}.xlsx`)
    const workbook = new ExcelJS.Workbook()
    workbook.creator  = 'LabPlatform — Learneo'
    workbook.created  = new Date()

    const sheet = workbook.addWorksheet('Scores', {
        views: [{ state: 'frozen', ySplit: 1 }],
        properties: { tabColor: { argb: 'FFFF7900' } }
    })

    const colonnes = [
        { header: 'Utilisateur',        key: 'user_nom',         width: 22 },
        { header: 'Email',              key: 'user_email',        width: 28 },
        { header: 'Lab',                key: 'lab_titre',         width: 38 },
        { header: 'Catégorie',          key: 'lab_categorie',     width: 26 },
        { header: 'Difficulté',         key: 'lab_difficulte',    width: 14 },
        { header: 'Tentatives',         key: 'tentatives',        width: 12 },
        { header: 'Étapes OK',          key: 'etapes_ok',         width: 11 },
        { header: 'Étapes Total',       key: 'etapes_total',      width: 13 },
        { header: 'Taux Complétion',    key: 'taux_completion',   width: 16 },
        { header: 'Réussi',             key: 'reussi',            width: 10 },
        { header: 'Score',              key: 'score',             width: 10 },
        { header: 'Dernière Tentative', key: 'derniere',          width: 20 },
    ]

    sheet.columns = colonnes
    appliquerStyleHeader(sheet, colonnes)

    const users = await User.find({ role: 'user' }).sort({ nom: 1 })
    const labs  = await Lab.find().sort({ ordre: 1 })

    let rowIdx = 2
    for (const user of users) {
        for (const lab of labs) {
            const sessions = await Session.find({
                user_id: user._id,
                lab_id:  lab._id,
            }).sort({ date_connexion: -1 })

            let rowData
            if (sessions.length === 0) {
                rowData = {
                    user_nom: user.nom, user_email: user.email,
                    lab_titre: lab.titre, lab_categorie: lab.categorie || '',
                    lab_difficulte: lab.difficulte || '',
                    tentatives: 0, etapes_ok: 0, etapes_total: 0,
                    taux_completion: '0%', reussi: 'Non tenté', score: '0%', derniere: '',
                }
            } else {
                const meilleure = sessions.reduce((best, s) => {
                    const ok     = s.etapes?.filter(e => e.completee).length ?? 0
                    const bestOk = best?.etapes?.filter(e => e.completee).length ?? 0
                    return ok >= bestOk ? s : best
                }, sessions[0])

                const etapesOk    = meilleure.etapes?.filter(e => e.completee).length ?? 0
                const etapesTotal = meilleure.etapes?.length ?? 0
                const taux        = etapesTotal > 0 ? Math.round((etapesOk / etapesTotal) * 100) : 0
                const reussiUne   = sessions.some(s => s.reussi)

                rowData = {
                    user_nom: user.nom, user_email: user.email,
                    lab_titre: lab.titre, lab_categorie: lab.categorie || '',
                    lab_difficulte: lab.difficulte || '',
                    tentatives: sessions.length, etapes_ok: etapesOk, etapes_total: etapesTotal,
                    taux_completion: taux + '%',
                    reussi: reussiUne ? 'Oui' : 'Non',
                    score:  (reussiUne ? 100 : taux) + '%',
                    derniere: formatDate(sessions[0].date_connexion),
                }
            }

            const row = sheet.addRow(rowData)
            row.height = 20

            if (rowIdx % 2 === 0) {
                row.eachCell(cell => { cell.style = { ...cell.style, fill: ROW_EVEN.fill } })
            }

            // Colorer Réussi
            const cellR = row.getCell('reussi')
            cellR.style = { ...cellR.style,
                ...(rowData.reussi === 'Oui' ? STYLE_OK : rowData.reussi === 'Non tenté' ? STYLE_NEU : STYLE_NON)
            }

            // Colorer Score
            const cellS  = row.getCell('score')
            const scoreN = parseInt(rowData.score)
            cellS.style  = { ...cellS.style,
                font: { bold: true, color: { argb: scoreN === 100 ? 'FF2E7D32' : scoreN > 0 ? 'FFFF7900' : 'FF9E9E9E' } }
            }

            rowIdx++
        }
    }

    sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to:   { row: 1, column: colonnes.length }
    }
    autoWidth(sheet)

    await workbook.xlsx.writeFile(filePath)
    console.log(` Excel scores généré : scores_${dateStr}.xlsx`)
    return filePath
}

/* ═════════════════════════════════════════════════════════════
   FICHIER 2 — donnees_YYYY-MM-DD.xlsx (4 feuilles)
═══════════════════════════════════════════════════════════════ */
async function genererExcelDonnees(dateStr) {
    const filePath = path.join(EXPORTS_DIR, `donnees_${dateStr}.xlsx`)
    const workbook = new ExcelJS.Workbook()
    workbook.creator  = 'LabPlatform — Learneo'
    workbook.created  = new Date()

    const users      = await User.find().sort({ createdAt: 1 })
    const categories = await Categorie.find().sort({ ordre: 1 })
    const labs       = await Lab.find().sort({ ordre: 1 })
    const sessions   = await Session.find()
        .populate('user_id', 'nom email')
        .populate('lab_id',  'titre categorie difficulte ordre')
        .sort({ date_connexion: -1 })

    /* ── Feuille 1 : Utilisateurs ── */
    {
        const sheet = workbook.addWorksheet('Utilisateurs', {
            views: [{ state: 'frozen', ySplit: 1 }],
            properties: { tabColor: { argb: 'FF1565C0' } }
        })
        const colonnes = [
            { header: 'ID',                 key: 'id',                 width: 28 },
            { header: 'Nom',                key: 'nom',                width: 20 },
            { header: 'Email',              key: 'email',              width: 28 },
            { header: 'Rôle',              key: 'role',               width: 10 },
            { header: 'Date Inscription',   key: 'date_inscription',   width: 20 },
            { header: 'Dernière Connexion', key: 'derniere_connexion', width: 20 },
        ]
        sheet.columns = colonnes
        appliquerStyleHeader(sheet, colonnes)

        users.forEach((u, i) => {
            const row = sheet.addRow({
                id: u._id.toString(), nom: u.nom, email: u.email, role: u.role,
                date_inscription:   formatDate(u.createdAt),
                derniere_connexion: formatDate(u.derniere_connexion),
            })
            row.height = 20
            if ((i + 2) % 2 === 0) {
                row.eachCell(cell => { cell.style = { ...cell.style, fill: ROW_EVEN.fill } })
            }
            const cellRole = row.getCell('role')
            if (u.role === 'admin') {
                cellRole.style = { ...cellRole.style, font: { color: { argb: 'FFFF7900' }, bold: true } }
            }
        })
        sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: colonnes.length } }
        autoWidth(sheet)
    }

    /* ── Feuille 2 : Catégories ── */
    {
        const sheet = workbook.addWorksheet('Catégories', {
            views: [{ state: 'frozen', ySplit: 1 }],
            properties: { tabColor: { argb: 'FF6A1B9A' } }
        })
        const colonnes = [
            { header: 'ID',                  key: 'id',                  width: 28 },
            { header: 'Nom',                 key: 'nom',                 width: 28 },
            { header: 'Description',         key: 'description',         width: 42 },
            { header: 'Ordre',               key: 'ordre',               width: 8  },
            { header: 'Verrouillage Manuel', key: 'verrouillage_manuel', width: 20 },
            { header: 'Déblocage Manuel',   key: 'deblocage_manuel',    width: 18 },
            { header: "Date d'Ouverture",   key: 'date_ouverture',      width: 20 },
        ]
        sheet.columns = colonnes
        appliquerStyleHeader(sheet, colonnes)

        categories.forEach((c, i) => {
            const row = sheet.addRow({
                id: c._id.toString(), nom: c.nom, description: c.description || '',
                ordre: c.ordre,
                verrouillage_manuel: c.verrouillage_manuel ? 'Oui' : 'Non',
                deblocage_manuel:    c.deblocage_manuel    ? 'Oui' : 'Non',
                date_ouverture:      formatDate(c.date_ouverture),
            })
            row.height = 20
            if ((i + 2) % 2 === 0) {
                row.eachCell(cell => { cell.style = { ...cell.style, fill: ROW_EVEN.fill } })
            }
        })
        autoWidth(sheet)
    }

    /* ── Feuille 3 : Labs ── */
    {
        const sheet = workbook.addWorksheet('Labs', {
            views: [{ state: 'frozen', ySplit: 1 }],
            properties: { tabColor: { argb: 'FF2E7D32' } }
        })
        const colonnes = [
            { header: 'ID',                  key: 'id',                  width: 28 },
            { header: 'Titre',               key: 'titre',               width: 38 },
            { header: 'Catégorie',           key: 'categorie',           width: 26 },
            { header: 'Difficulté',         key: 'difficulte',          width: 14 },
            { header: 'Ordre',               key: 'ordre',               width: 8  },
            { header: 'Image Docker',        key: 'image_docker',        width: 28 },
            { header: 'Verrouillage Manuel', key: 'verrouillage_manuel', width: 20 },
            { header: 'Déblocage Manuel',   key: 'deblocage_manuel',    width: 18 },
            { header: "Date d'Ouverture",   key: 'date_ouverture',      width: 20 },
            { header: 'Date Création',       key: 'date_creation',       width: 20 },
        ]
        sheet.columns = colonnes
        appliquerStyleHeader(sheet, colonnes)

        labs.forEach((l, i) => {
            const row = sheet.addRow({
                id: l._id.toString(), titre: l.titre,
                categorie: l.categorie || '', difficulte: l.difficulte || '',
                ordre: l.ordre, image_docker: l.image_docker || '',
                verrouillage_manuel: l.verrouillage_manuel ? 'Oui' : 'Non',
                deblocage_manuel:    l.deblocage_manuel    ? 'Oui' : 'Non',
                date_ouverture: formatDate(l.date_ouverture),
                date_creation:  formatDate(l.createdAt),
            })
            row.height = 20
            if ((i + 2) % 2 === 0) {
                row.eachCell(cell => { cell.style = { ...cell.style, fill: ROW_EVEN.fill } })
            }
            const cellDiff = row.getCell('difficulte')
            const diffColor = l.difficulte === 'Débutant' ? 'FF2E7D32'
                : l.difficulte === 'Intermédiaire' ? 'FFFF7900' : 'FFC62828'
            cellDiff.style = { ...cellDiff.style, font: { color: { argb: diffColor }, bold: true } }
        })

        sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: colonnes.length } }
        autoWidth(sheet)
    }

    /* ── Feuille 4 : Sessions ── */
    {
        const sheet = workbook.addWorksheet('Sessions', {
            views: [{ state: 'frozen', ySplit: 1 }],
            properties: { tabColor: { argb: 'FFC62828' } }
        })
        const colonnes = [
            { header: 'ID Session',       key: 'id',             width: 28 },
            { header: 'Utilisateur',      key: 'user_nom',       width: 20 },
            { header: 'Email',            key: 'user_email',     width: 28 },
            { header: 'Lab',              key: 'lab_titre',      width: 38 },
            { header: 'Catégorie',        key: 'lab_categorie',  width: 26 },
            { header: 'Date Connexion',   key: 'date_connexion', width: 20 },
            { header: 'Temps (sec)',      key: 'temps_passe',    width: 12 },
            { header: 'Statut',           key: 'statut',         width: 12 },
            { header: 'Réussi',          key: 'reussi',         width: 10 },
            { header: 'Nb Étapes',       key: 'nb_etapes',      width: 12 },
            { header: 'Étapes OK',       key: 'nb_etapes_ok',   width: 12 },
            { header: 'Taux Complétion', key: 'taux',           width: 16 },
        ]
        sheet.columns = colonnes
        appliquerStyleHeader(sheet, colonnes)

        sessions.forEach((s, i) => {
            const etapesOk    = s.etapes?.filter(e => e.completee).length ?? 0
            const etapesTotal = s.etapes?.length ?? 0
            const taux        = etapesTotal > 0 ? Math.round((etapesOk / etapesTotal) * 100) : 0

            const row = sheet.addRow({
                id:             s._id.toString(),
                user_nom:       s.user_id?.nom    || '',
                user_email:     s.user_id?.email  || '',
                lab_titre:      s.lab_id?.titre   || '',
                lab_categorie:  s.lab_id?.categorie || '',
                date_connexion: formatDate(s.date_connexion),
                temps_passe:    s.temps_passe || 0,
                statut:         s.statut,
                reussi:         s.reussi ? 'Oui' : 'Non',
                nb_etapes:      etapesTotal,
                nb_etapes_ok:   etapesOk,
                taux:           taux + '%',
            })
            row.height = 20

            if ((i + 2) % 2 === 0) {
                row.eachCell(cell => { cell.style = { ...cell.style, fill: ROW_EVEN.fill } })
            }

            const cellR = row.getCell('reussi')
            cellR.style = { ...cellR.style, ...(s.reussi ? STYLE_OK : STYLE_NON) }

            const cellSt = row.getCell('statut')
            const stColor = s.statut === 'termine' ? 'FF2E7D32'
                : s.statut === 'abandonne' ? 'FFC62828' : 'FFFF7900'
            cellSt.style = { ...cellSt.style, font: { color: { argb: stColor } } }
        })

        sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: colonnes.length } }
        autoWidth(sheet)
    }

    await workbook.xlsx.writeFile(filePath)
    console.log(` Excel données généré : donnees_${dateStr}.xlsx`)
    return filePath
}

/* ─────────────────────────────────────────
   Nettoyage — garder 7 derniers exports
───────────────────────────────────────── */
function nettoyerAnciensExports() {
    try {
        const files = fs.readdirSync(EXPORTS_DIR)
            .filter(f => f.endsWith('.tar'))
            .map(f => ({ name: f, time: fs.statSync(path.join(EXPORTS_DIR, f)).mtime.getTime() }))
            .sort((a, b) => b.time - a.time)

        files.slice(7).forEach(f => {
            fs.unlinkSync(path.join(EXPORTS_DIR, f.name))
            console.log(` Ancien export supprimé : ${f.name}`)
        })
    } catch (err) {
        console.log('Erreur nettoyage :', err.message)
    }
}

/* ═════════════════════════════════════════════════════════════
   EXPORT PRINCIPAL — appelé par le cron
═══════════════════════════════════════════════════════════════ */
async function exporterDonnees() {
    try {
        console.log('Début export automatique Excel...')

        const now     = new Date()
        const dateStr = now.toISOString().slice(0, 10)
        const tarPath = path.join(EXPORTS_DIR, `export_${dateStr}.tar`)

        const xlsxScores  = await genererExcelScores(dateStr)
        const xlsxDonnees = await genererExcelDonnees(dateStr)

        await tar.create(
            { file: tarPath, cwd: EXPORTS_DIR },
            [ path.basename(xlsxScores), path.basename(xlsxDonnees) ]
        )

        fs.unlinkSync(xlsxScores)
        fs.unlinkSync(xlsxDonnees)

        nettoyerAnciensExports()

        const meta = {
            dernierExport: now.toISOString(),
            fichier:       path.basename(tarPath),
            dateStr,
        }
        fs.writeFileSync(
            path.join(EXPORTS_DIR, 'meta.json'),
            JSON.stringify(meta, null, 2)
        )

        console.log(` Export terminé : export_${dateStr}.tar`)
        return { succes: true, fichier: path.basename(tarPath), dateStr }

    } catch (err) {
        console.error(' Erreur export Excel :', err.message)
        return { succes: false, erreur: err.message }
    }
}

module.exports = { exporterDonnees }