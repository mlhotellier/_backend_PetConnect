// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Inscription d'un utilisateur
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Créer l'utilisateur
    const user = new User({ email, password });
    await user.save(); // Assurez-vous que l'utilisateur est enregistré dans la base de données

    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ token }); // Retourner le token JWT
  } catch (error) {
    console.error(error); // Ajout d'un log pour mieux comprendre l'erreur
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

// Connexion d'un utilisateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    // Vérifier si le mot de passe correspond
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Identifiants invalides' });

    const userId = user._id
    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ token, userId }); // Retourner le token JWT
  } catch (error) {
    console.error(error); // Ajout d'un log pour mieux comprendre l'erreur
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

module.exports = router;