const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware d'authentification
const Evenement = require('../models/Evenement');
const Pet = require('../models/Pet');

// Ajouter un événement
router.post('/add', authMiddleware, async (req, res) => {
    const { date, petId, description } = req.body;

    try {
        const userId = req.auth.userId;  // Assurez-vous que l'utilisateur est authentifié
        if (!userId) {
            return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
        }

        // Trouver l'animal correspondant à l'ID
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Animal non trouvé' });
        }

        // Créez l'événement avec les données récupérées
        const newEvent = new Evenement({
            name: pet.name,  // Utilisez le nom de l'animal récupéré
            date,
            description,
            user: userId,
        });

        // Sauvegardez l'événement
        await newEvent.save();
        res.status(201).json(newEvent);
        console.log('BE',newEvent);
        
    } catch (error) {
        console.error(error);  // Ajoutez cette ligne pour vérifier les erreurs dans les logs
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

// Récupérer tous les événements
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.auth.userId;
    try {
      // Vous pouvez ici filtrer les événements en fonction de l'utilisateur
      const evenements = await Evenement.find({ user: userId }); // Trouver les événements associés à l'utilisateur connecté
      res.status(200).json(evenements); // Renvoyer les événements
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
    }
  });

module.exports = router;