const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage des fichiers via Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/pets'; // Répertoire de stockage des images
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Crée le dossier s'il n'existe pas
    }
    cb(null, uploadDir); // Stocke les fichiers dans le répertoire 'uploads/pets'
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Récupère l'extension du fichier
    const fileName = `pet_${Date.now()}${ext}`; // Crée un nom unique pour le fichier basé sur un timestamp
    cb(null, fileName);
  }
});

// Filtrer les fichiers pour ne permettre que les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Si c'est une image, l'accepter
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés'), false); // Refuser d'autres types de fichiers
  }
};

// Initialiser Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille du fichier à 5 Mo
});

module.exports = upload;
