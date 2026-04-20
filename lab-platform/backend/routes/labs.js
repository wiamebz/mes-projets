const express   = require('express')
const router    = express.Router()
const Lab       = require('../models/Lab')
const Session   = require('../models/Session')
const Categorie = require('../models/Categorie')
const Docker    = require('dockerode')
const docker    = new Docker()

/* ─────────────────────────────────────────
   HELPER : calculer l'état d'ouverture d'une catégorie
   pour un user donné
───────────────────────────────────────── */
async function calculerEtatCategorie(cat, categoriesPrec, user_id) {
    const maintenant = new Date()

    // 1. Admin a débloqué manuellement → ouvert
    if (cat.deblocage_manuel) {
        return { estOuverte: true, raison: 'deblocage_admin' }
    }

    // 2. Admin a verrouillé manuellement → fermé
    if (cat.verrouillage_manuel) {
        return { estOuverte: false, raison: 'verrouille_admin' }
    }

    // 3. date_ouverture future → fermé
    if (cat.date_ouverture && new Date(cat.date_ouverture) > maintenant) {
        return { estOuverte: false, raison: 'date_future' }
    }

    // 4. Toutes les catégories précédentes doivent être 100% complétées
    for (const catPrec of categoriesPrec) {
        const labsPrec = await Lab.find({ categorie: catPrec.nom })
        if (labsPrec.length === 0) continue

        for (const lab of labsPrec) {
            const sessionReussie = await Session.findOne({
                user_id,
                lab_id: lab._id,
                reussi: true
            })
            if (!sessionReussie) {
                return { estOuverte: false, raison: 'categorie_precedente_incomplete' }
            }
        }
    }

    return { estOuverte: true, raison: 'debloque' }
}

/* ─────────────────────────────────────────
   GET /api/labs/categories
   Renvoie toutes les catégories avec leurs labs + stats
───────────────────────────────────────── */
router.get('/categories', async (req, res) => {
    try {
        const user_id          = req.user.id
        const toutesCategories = await Categorie.find().sort({ ordre: 1 })
        const tousLesLabs      = await Lab.find().sort({ ordre: 1 })

        const resultat = []

        for (let i = 0; i < toutesCategories.length; i++) {
            const cat            = toutesCategories[i]
            const categoriesPrec = toutesCategories.slice(0, i)
            const etat           = await calculerEtatCategorie(cat, categoriesPrec, user_id)

            const labsCategorie = tousLesLabs.filter(l => l.categorie === cat.nom)

            const labsAvecTaux = await Promise.all(labsCategorie.map(async (lab) => {
                const sessions = await Session.find({ user_id, lab_id: lab._id })

                // Meilleure session (max étapes complétées)
                const meilleure = sessions.reduce((best, s) => {
                    const ok     = s.etapes?.filter(e => e.completee).length ?? 0
                    const bestOk = best?.etapes?.filter(e => e.completee).length ?? 0
                    return ok >= bestOk ? s : best
                }, sessions[0] || null)

                const etapesTotal    = meilleure?.etapes?.length ?? 0
                const etapesOk       = meilleure?.etapes?.filter(e => e.completee).length ?? 0
                const tauxCompletion = etapesTotal > 0
                    ? Math.round((etapesOk / etapesTotal) * 100) : 0

                const reussie = await Session.findOne({ user_id, lab_id: lab._id, reussi: true })

                // Date du dernier essai
                const derniereSession = sessions.length > 0
                    ? sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt
                    : null

                return {
                    _id:             lab._id,
                    titre:           lab.titre,
                    description:     lab.description,
                    difficulte:      lab.difficulte,
                    ordre:           lab.ordre,
                    tauxCompletion,
                    reussi:          !!reussie,
                    debloque:        etat.estOuverte,
                    etapesTotal,
                    etapesOk,
                    derniereSession,
                    nombreEssais:    sessions.length,
                }
            }))

            const tauxCategorie = labsAvecTaux.length > 0
                ? Math.round(labsAvecTaux.reduce((s, l) => s + l.tauxCompletion, 0) / labsAvecTaux.length)
                : 0
            const labsReussis = labsAvecTaux.filter(l => l.reussi).length

            resultat.push({
                _id:            cat._id,
                nom:            cat.nom,
                description:    cat.description,
                ordre:          cat.ordre,
                date_ouverture: cat.date_ouverture,
                estOuverte:     etat.estOuverte,
                raison:         etat.raison,
                tauxCategorie,
                labsReussis,
                totalLabs:      labsAvecTaux.length,
                labs:           labsAvecTaux,
            })
        }

        res.json(resultat)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* ─────────────────────────────────────────
   GET /api/labs
   Renvoie tous les labs avec état débloqué/réussi/étapes
───────────────────────────────────────── */
router.get('/', async (req, res) => {
    try {
        const user_id          = req.user.id
        const labs             = await Lab.find().sort({ ordre: 1 })
        const toutesCategories = await Categorie.find().sort({ ordre: 1 })

        // Cache des états de chaque catégorie (éviter recalcul)
        const etatsCategories = {}
        for (let i = 0; i < toutesCategories.length; i++) {
            const cat            = toutesCategories[i]
            const categoriesPrec = toutesCategories.slice(0, i)
            etatsCategories[cat.nom] = await calculerEtatCategorie(cat, categoriesPrec, user_id)
        }

        const labsAvecStatut = await Promise.all(labs.map(async (lab) => {
            const etatCat = etatsCategories[lab.categorie] || { estOuverte: true }
            let debloque  = etatCat.estOuverte

            const sessionLabReussie = await Session.findOne({
                user_id,
                lab_id: lab._id,
                reussi: true
            })

            const toutesLesSessions = await Session.find({ user_id, lab_id: lab._id })
            const meilleureSession  = toutesLesSessions.reduce((best, s) => {
                const ok     = s.etapes?.filter(e => e.completee).length ?? 0
                const bestOk = best?.etapes?.filter(e => e.completee).length ?? 0
                return ok >= bestOk ? s : best
            }, toutesLesSessions[0] || null)

            const etapesTotal    = meilleureSession?.etapes?.length ?? 0
            const etapesOk       = meilleureSession?.etapes?.filter(e => e.completee).length ?? 0
            const tauxCompletion = etapesTotal > 0
                ? Math.round((etapesOk / etapesTotal) * 100) : 0

            return {
                _id:            lab._id,
                titre:          lab.titre,
                description:    lab.description,
                image_docker:   lab.image_docker,
                cmd:            lab.cmd,
                difficulte:     lab.difficulte,
                ordre:          lab.ordre,
                categorie:      lab.categorie,
                date_ouverture: lab.date_ouverture,
                debloque,
                reussi:         !!sessionLabReussie,
                tauxCompletion,
                etapesTotal,
                etapesOk,
            }
        }))

        res.json(labsAvecStatut)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* ─────────────────────────────────────────
   DELETE arrêter un lab
───────────────────────────────────────── */
router.delete('/arreter/:conteneur_id', async (req, res) => {
    try {
        const conteneur = docker.getContainer(req.params.conteneur_id)
        try {
            await conteneur.inspect()
            await conteneur.stop()
            await conteneur.remove()
        } catch (e) { }
        res.json({ message: 'Lab arrêté' })
    } catch (err) {
        res.json({ message: 'OK' })
    }
})

module.exports = router