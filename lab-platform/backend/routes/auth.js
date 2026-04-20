const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post('/register', async (req, res) => {
    try {
        const { nom, email, mot_de_passe } = req.body

        // Vérifier si l'email existe déjà
        const userExiste = await User.findOne({ email })
        if (userExiste) {
            return res.status(400).json({ message: 'Email déjà utilisé !' })
        }

        // Chiffrer le mot de passe
        const salt = await bcrypt.genSalt(10)
        const motDePasseChiffre = await bcrypt.hash(mot_de_passe, salt)

        // Créer le user
        const user = new User({
            nom,
            email,
            mot_de_passe: motDePasseChiffre,
        })

        await user.save()

        // Créer le token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.json({
            message: 'Compte créé',
            token,
            user: { id: user._id, nom: user.nom, email: user.email, role: user.role }
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// POST /api/auth/login — se connecter
router.post('/login', async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body

        // Vérifier si le user existe
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect !' })
        }

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(mot_de_passe, user.mot_de_passe)
        if (!motDePasseValide) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect !' })
        }

        // ← AJOUT : mettre à jour la dernière connexion
        user.derniere_connexion = new Date()
        await user.save()

        // Créer le token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.json({
            message: 'Connexion réussie',
            token,
            user: { id: user._id, nom: user.nom, email: user.email, role: user.role }
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router