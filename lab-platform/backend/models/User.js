const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mot_de_passe: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
        // Par défaut tout le monde est user
        // Seul l'admin peut accéder au dashboard
    },
    derniere_connexion: {
        type: Date,
        default: null
        // Mise à jour à chaque login réussi
        // null = l'user ne s'est jamais connecté depuis l'ajout de ce champ
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)