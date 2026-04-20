const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        // référence vers le modèle User
        // comme une clé étrangère en SQL
    },
    lab_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: true
        // référence vers le modèle Lab
    },
    date_connexion: {
        type: Date,
        default: Date.now
        // date automatique au démarrage
    },
    temps_passe: {
        type: Number,
        default: 0
        // en secondes
    },
    nombre_questions: {
        type: Number,
        default: 0
    },
    nombre_bonnes_reponses: {
        type: Number,
        default: 0
    },
    reussi: {
        type: Boolean,
        default: false
    },
    statut: {
        type: String,
        enum: ['en_cours', 'termine', 'abandonne'],
        default: 'en_cours'
    },
    etapes: [{
        nom: String,           // nom de l'étape
        description: String,   // ce que le user a fait
        completee: Boolean,    // réussie ou non
        temps: Number          // temps pris en secondes
    }]
}, { timestamps: true })

module.exports = mongoose.model('Session', sessionSchema)