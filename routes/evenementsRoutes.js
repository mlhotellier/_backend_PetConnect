const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware d'authentification
const Evenement = require('../models/Evenement');
const Pet = require('../models/Pet');

// Ajouter un événement
router.post('/add', authMiddleware, async (req, res) => {
    const { title, date, petName, description } = req.body;


    try {
        const userId = req.auth.userId; // Assurez-vous que l'utilisateur est authentifié
        if (!userId) {
            return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
        }

        let petNameResolved = ''; // Variable pour stocker le nom de l'animal, s'il existe

        if (petName) {
            // Trouver l'animal correspondant à l'ID
            const pet = await Pet.findById(petName);
            if (!pet) {
                return res.status(404).json({ message: 'Animal non trouvé' });
            }
            petNameResolved = pet.name; // Récupérez le nom de l'animal
        }

        // Créez l'événement avec les données récupérées
        const newEvent = new Evenement({
            title,
            date,
            petName: petNameResolved, // Utilisez le nom de l'animal si disponible
            description,
            user: userId,
        });

        // Sauvegardez l'événement
        await newEvent.save();
        res.status(201).json(newEvent);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

// Récupérer tous les événements
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.auth.userId;

    if (!userId) {
        return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
    }

    try {
      // Vous pouvez ici filtrer les événements en fonction de l'utilisateur
      const evenements = await Evenement.find({ user: userId }); // Trouver les événements associés à l'utilisateur connecté
      res.status(200).json(evenements); // Renvoyer les événements
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
    }
});

router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const userId = req.auth.userId;
    const eventId = req.params.id;

    if (!userId) {
        return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
    }
    
    try {
        // Vérification de l'existence de l'événement et de la correspondance avec l'utilisateur
        const evenement = await Evenement.findOne({ _id: eventId, user: userId });
        
        if (!evenement) {
            return res.status(404).json({ message: 'Événement non trouvé ou vous n\'avez pas la permission de le supprimer' });
        }

        // Suppression de l'événement
        await Evenement.deleteOne({ _id: eventId });

        // Réponse après suppression réussie
        res.json({ message: 'Événement supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'événement', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'événement' });
    }
});

router.put('/update/:id', authMiddleware, async (req, res) => {
    const userId = req.auth.userId;
    const eventId = req.params.id;
    const { title, date, petName, description } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
    }

    try {
        // Vérification de l'existence de l'événement et de la correspondance avec l'utilisateur
        const evenement = await Evenement.findOne({ _id: eventId, user: userId });
        
        if (!evenement) {
            return res.status(404).json({ message: 'Événement non trouvé ou vous n\'avez pas la permission de le supprimer' });
        }

        if (title !== undefined) evenement.title = title;
        if (date !== undefined) evenement.date = date;
        if (petName !== undefined) evenement.petName = petName;
        if (description !== undefined) evenement.description = description;

        const updateEvenement = await evenement.save();
        res.status(200).json(updateEvenement);
    } catch(error) {
        console.error('Erreur lors de la modification de l\'événement', error);
        res.status(500).json({ message: 'Erreur lors de la modification de l\'événement' });
    }
});


module.exports = router;