const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage pour les images des animaux
const storagePets = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/pets'; // Répertoire de stockage des images des animaux
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `pet_${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

// Filtre pour les fichiers des animaux (uniquement des images)
const fileFilterPets = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés pour les animaux'), false);
  }
};

// Configuration du stockage pour les documents (PDF, image, etc.)
const storageDocuments = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/documents'; // Répertoire de stockage des documents
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `document_${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

// Filtre pour les fichiers des documents (PDF, JPG, PNG)
const fileFilterDocuments = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF et image (JPG, PNG) sont autorisés'), false);
  }
};

// Fonction pour choisir la configuration Multer en fonction de l'upload
const uploadPetImage = multer({
  storage: storagePets,
  fileFilter: fileFilterPets,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille du fichier à 5 Mo pour les images des animaux
});

const uploadDocument = multer({
  storage: storageDocuments,
  fileFilter: fileFilterDocuments,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille du fichier à 10 Mo pour les documents
});

module.exports = { uploadPetImage, uploadDocument };
