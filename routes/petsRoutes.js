const express = require('express');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Pet = require('../models/Pet');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware d'authentification
const upload = require('../middleware/upload')
const router = express.Router();

const getImagePath = (fileName) => path.join(__dirname, '../uploads/pets/optimized', fileName);

// Route pour ajouter un animal
router.post('/add', authMiddleware, upload.single('image'), async (req, res) => {
  const { name, birthDate, type, color, weight } = req.body;
  
  // Vérifier si les informations sont présentes
  if (!name || !birthDate || !type || !color || !weight) {
    return res.status(400).json({ message: 'Toutes les informations de l\'animal sont requises' });
  }

  // Utilisation de l'ID utilisateur depuis le token (authMiddleware)
  const userId = req.auth.userId;
  if (!userId) {
    return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
  }

  // Vérification du poids
  if (isNaN(weight) || parseFloat(weight) <= 0) {
    return res.status(400).json({ message: 'Le poids doit être un nombre valide et supérieur à zéro.' });
  }

  try {
    // Créer un nouvel animal
    const pet = new Pet({
      name,
      birthDate,
      type,
      color,
      data: [{ date: new Date().toISOString(), weight: parseFloat(weight) }],
      user: userId, // Lier l'animal à l'utilisateur
    });

    // Si une image est téléchargée, la traiter avec Sharp
    if (req.file) {
      const originalImagePath = path.join(__dirname, '../uploads/pets', req.file.filename);
      const optimizedImagePath = getImagePath(`${Date.now()}.webp`);

      // Utilisation de Sharp pour redimensionner et convertir l'image
      await sharp(req.file.path)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(optimizedImagePath); // Sauvegarder l'image optimisée

      // Supprimer l'image originale
      fs.unlinkSync(req.file.path);

      // Mettre à jour le modèle Pet avec le nom de l'image optimisée
      pet.image = path.basename(optimizedImagePath); // Stocker le nom de l'image optimisée
    }

    // Sauvegarder l'animal dans la base de données
    const savedPet = await pet.save();
    res.status(201).json(savedPet); // Retourner l'animal ajouté
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'animal:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'animal' });
  }
});

// Route pour récupérer tous ses animaux de l'utilisateur
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId;  // Récupérer l'ID de l'utilisateur à partir du middleware

    // Trouver les animaux appartenant à l'utilisateur authentifié
    const pets = await Pet.find({ user: userId });

    // Vérification si l'utilisateur a des animaux
    if (!pets || pets.length === 0) {
      return res.status(404).json({ message: 'Aucun animal trouvé pour cet utilisateur.' });
    }

    res.status(200).json(pets); // Retourner les animaux
  } catch (error) {
    console.error('Erreur lors de la récupération des animaux:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des animaux' });
  }
});

// Route pour supprimer un animal
router.delete('/remove/:id', authMiddleware, async (req, res) => {
  const petId = req.params.id;

  try {
    const userId = req.auth.userId;

    const pet = await Pet.findById(petId, { user: userId });
    if (!pet) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }

    if (pet.image) {
      const imagePath = getImagePath(pet.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Pet.findByIdAndDelete(petId);
    res.status(200).json({ message: 'Animal supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'animal:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'animal' });
  }
});

// Route pour mettre à jour un animal
router.put('/update/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { id } = req.params;  // Récupérer l'ID du paramètre de la route
  const { name, birthDate, type, color, weight } = req.body;

  try {
    const userId = req.auth.userId;

    // Trouver l'animal par son ID et vérifier si cet animal appartient à l'utilisateur
    const pet = await Pet.findOne({ _id: id, user: userId });
    if (!pet) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }

    // Vérifier les champs à mettre à jour
    pet.name = name || pet.name;
    pet.birthDate = birthDate || pet.birthDate;
    pet.type = type || pet.type;
    pet.color = color || pet.color;

    // Comparaison de la date sans l'heure (on garde uniquement YYYY-MM-DD)
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    const lastDataEntry = pet.data[pet.data.length - 1];

    let dateChanged = false;
    let weightChanged = false;

    if (lastDataEntry) {
      const lastDataDate = new Date(lastDataEntry.date).toISOString().split('T')[0]; // Format YYYY-MM-DD

      if (lastDataDate !== todayDate) {
        dateChanged = true;
      }

      if (parseFloat(weight) !== lastDataEntry.weight) {
        weightChanged = true;
      }
    }

    // Si la date ou le poids a changé, on ajoute une nouvelle entrée
    if (dateChanged || weightChanged) {
      const newWeight = {
        date: todayDate,
        weight: parseFloat(weight),
      };
      pet.data.push(newWeight);
    }

    // Traitement de l'image
    if (req.file) {
      const originalImagePath = req.file.path;
      const optimizedImagePath = getImagePath(`${Date.now()}.webp`);

      await sharp(originalImagePath)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(optimizedImagePath); // Sauvegarder l'image optimisée

      // Supprimer l'image originale
      fs.unlinkSync(originalImagePath);
      pet.image = path.basename(optimizedImagePath); // Mettre à jour l'image optimisée
    }

    // Sauvegarder les modifications dans la base de données
    const updatedPet = await pet.save();
    res.status(200).json(updatedPet);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'animal:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'animal', error: error.message });
  }
});


// Route pour ajouter un poids à un animal
router.put('/add-weight/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { date, weight } = req.body; // Date et poids envoyés dans la requête
  try {
    const userId = req.auth.userId;
    const pet = await Pet.findOne({ _id: id, user: userId }); // Récupérer l'animal par son ID
    if (!pet) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }

    // Valider le poids
    if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
      return res.status(400).json({ message: 'Le poids doit être un nombre valide et supérieur à zéro.' });
    }

    // Valider la date
    if (!date) {
      return res.status(400).json({ message: 'La date est requise.' });
    }

    const formattedDate = new Date(date).toISOString().split('T')[0]; // Format YYYY-MM-DD
    const existingEntryIndex = pet.data.findIndex(entry =>
      new Date(entry.date).toISOString().split('T')[0] === formattedDate
    );

    if (existingEntryIndex !== -1) {
      // Si une entrée pour cette date existe, mettre à jour le poids
      pet.data[existingEntryIndex].weight = parseFloat(weight);
    } else {
      // Sinon, ajouter une nouvelle entrée
      const newWeightData = {
        date: formattedDate,
        weight: parseFloat(weight),
      };
      pet.data.push(newWeightData);
    }

    const updatedPet = await pet.save(); // Sauvegarder les modifications
    res.status(200).json(updatedPet); // Retourner l'animal mis à jour
  } catch (error) {
    console.error('Erreur lors de l\'ajout/modification du poids:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout/modification du poids' });
  }
});

module.exports = router;
