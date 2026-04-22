const mongoose = require('mongoose')

const labSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String, required: true },
    image_docker: { type: String, required: true },
    cmd: { type: [String], default: ['/bin/sh'] },
    difficulte: {
        type: String,
        enum: ['Débutant', 'Intermédiaire', 'Avancé'],
        default: 'Débutant'
    },
    prerequis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        default: null
        // null = pas de prérequis → disponible directement
        // id du lab → doit réussir ce lab avant
    },
    ordre: {
        type: Number,
        default: 0
        // Pour afficher les labs dans l'ordre
    },
    categorie: {
        type: String,
        default: 'Général'
        // Permet de grouper les labs par catégorie
        // ex: 'Fondamentaux Kubernetes', 'Déploiement & Services'
    },
    date_ouverture: {
        type: Date,
        default: null
        // null = disponible immédiatement
        // Date future = lab verrouillé jusqu'à cette date
        // ex: new Date('2026-05-01')
    },

    // ─── NOUVEAUX CHAMPS : contrôle individuel par lab ───
    verrouillage_manuel: {
        type: Boolean,
        default: false
        // true = l'admin force ce lab à être verrouillé
        // (prime sur l'état de la catégorie)
    },
    deblocage_manuel: {
        type: Boolean,
        default: false
        // true = l'admin force ce lab à être débloqué
        // (prime sur l'état de la catégorie)
    }
}, { timestamps: true })

module.exports = mongoose.model('Lab', labSchema)