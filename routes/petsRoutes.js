const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Pet = require('../models/Pet');
const User = require('../models/User');
const router = express.Router();

// Configuration de multer pour gérer l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/pets'; // Répertoire de stockage des images
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Crée le dossier si inexistant
    }
    cb(null, uploadDir); // Stockage dans le répertoire 'uploads/pets'
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `pet_${Date.now()}${ext}`; // Nom unique basé sur timestamp
    cb(null, fileName);
  }
});

// Filtrage des fichiers (accepte uniquement les images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Si c'est une image, on l'accepte
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés'), false); // Refuse autres types de fichiers
  }
};

// Initialiser multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de taille à 5MB
});

// Helper : obtenir le chemin complet de l'image
const getImagePath = (fileName) => path.join(__dirname, '../uploads/pets/optimized', fileName);

// Route pour ajouter un animal
router.post('/add', upload.single('image'), async (req, res) => {
  const { name, birthDate, type, color, weight, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
  }

  // Valider le poids (doit être un nombre positif)
  if (isNaN(weight) || parseFloat(weight) <= 0) {
    return res.status(400).json({ message: 'Le poids doit être un nombre valide et supérieur à zéro.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Créer un nouvel animal
    const pet = new Pet({
      name,
      birthDate,
      type,
      color,
      data: [{ date: new Date().toISOString(), weight: parseFloat(weight) }],
      user: userId,
    });

    if (req.file) {
      const originalImagePath = path.join(__dirname, '../uploads/pets', req.file.filename);
      const optimizedImagePath = getImagePath(`${Date.now()}.webp`);

      // Optimisation de l'image
      await sharp(originalImagePath)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(optimizedImagePath);

      fs.unlinkSync(originalImagePath); // Supprimer l'image originale
      pet.image = path.basename(optimizedImagePath); // Stocker uniquement le nom du fichier optimisé
    }

    const savedPet = await pet.save();
    res.status(201).json(savedPet);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'animal:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'animal' });
  }
});

// Route pour récupérer tous les animaux
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    console.error('Erreur lors de la récupération des animaux:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des animaux' });
  }
});

// Route pour supprimer un animal
router.delete('/remove/:id', async (req, res) => {
  const petId = req.params.id;

  try {
    const pet = await Pet.findById(petId);
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
router.put('/update/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, birthDate, type, color, weight } = req.body;

  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: 'Animal non trouvé' });
    }

    // Mettre à jour les informations de l'animal (sans toucher à l'image si elle n'est pas modifiée)
    pet.name = name || pet.name;
    pet.birthDate = birthDate || pet.birthDate;
    pet.type = type || pet.type;
    pet.color = color || pet.color;

    // Comparer la date sans l'heure
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    const lastDataEntry = pet.data[pet.data.length - 1];

    let dateChanged = false;
    let weightChanged = false;

    if (lastDataEntry) {
      const lastDataDate = new Date(lastDataEntry.date).toISOString().split('T')[0]; // Format YYYY-MM-DD

      // Vérification si la date ou le poids ont changé
      if (lastDataDate !== todayDate) {
        dateChanged = true;
      }

      if (parseFloat(weight) !== lastDataEntry.weight) {
        weightChanged = true;
      }
    }

    // Si la date ou le poids a changé, on ajoute une nouvelle entrée dans la liste de données
    if (dateChanged || weightChanged) {
      const newWeight = {
        date: todayDate,
        weight: parseFloat(weight),
      };
      pet.data.push(newWeight);
    }

    // Vérification de l'image
    if (req.file) {
      // Supprimer l'ancienne image si elle existe
      if (pet.image) {
        const oldImagePath = path.join(__dirname, '../uploads/pets', pet.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Supprimer l'image précédente
        }
      }

      // Traiter la nouvelle image
      const originalImagePath = path.join(__dirname, '../uploads/pets', req.file.filename);
      const optimizedImagePath = getImagePath(`${Date.now()}.webp`);

      // Optimisation de l'image
      await sharp(originalImagePath)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(optimizedImagePath);

      fs.unlinkSync(originalImagePath); // Supprimer l'image originale
      pet.image = path.basename(optimizedImagePath); // Enregistrer le nouveau nom de l'image optimisée
    }

    const updatedPet = await pet.save();
    res.status(200).json(updatedPet); // Retourner l'animal mis à jour
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'animal:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'animal' });
  }
});

// Route pour ajouter un poids à un animal
router.put('/add-weight/:id', async (req, res) => {
  const { id } = req.params; // ID de l'animal
  const { date, weight } = req.body; // Date et poids envoyés dans la requête

  try {
    const pet = await Pet.findById(id); // Récupérer l'animal par son ID
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
