const mongoose = require('mongoose')

const categorieSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true
        // ex: "Fondamentaux Kubernetes"
    },
    description: {
        type: String,
        default: ''
        // Description courte de la catégorie
    },
    ordre: {
        type: Number,
        default: 0
        // Pour l'affichage ordonné (1, 2, 3...)
    },
    verrouillage_manuel: {
        type: Boolean,
        default: false
        // true = admin a verrouillé manuellement cette catégorie
    },
    deblocage_manuel: {
        type: Boolean,
        default: false
        // true = admin a débloqué manuellement (même si catégorie précédente non finie)
    },
    date_ouverture: {
        type: Date,
        default: null
        // null = disponible immédiatement
        // Date future = catégorie verrouillée jusqu'à cette date
    }
}, { timestamps: true })

module.exports = mongoose.model('Categorie', categorieSchema)