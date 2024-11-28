
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const router = express.Router();

// // Middleware pour vérifier le token JWT
// const protect = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token à partir de l'en-tête Authorization

//   if (!token) return res.status(401).json({ message: 'Non autorisé, aucun token trouvé' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifier le token
//     req.userId = decoded.id; // Ajouter l'ID utilisateur à la requête
//     next(); // Passer à la route suivante si le token est valide
//   } catch (error) {
//     res.status(401).json({ message: 'Token invalide' });
//   }
// };

// // Route protégée /profile
// router.get('/profile', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId); // Récupérer l'utilisateur avec l'ID du token
//     if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     res.status(200).json(user); // Retourner les informations de l'utilisateur
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

// module.exports = router;