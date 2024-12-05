const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Document = require('../models/Document');
const { uploadDocument } = require('../middleware/upload');
const router = express.Router();

// Endpoint pour télécharger un document (PDF, image, etc.)
router.post('/add', authMiddleware, uploadDocument.single('document'), async (req, res) => {
    // Utilisation de l'ID utilisateur depuis le token (authMiddleware)
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
    }
  
    if (!req.file) {
      return res.status(400).send('Aucun fichier téléchargé.');
    }
  
    try {
      // Création d'un document associé à l'utilisateur
      const newDocument = new Document({
        userId, 
        filename: req.file.filename,
        originalname: req.file.originalname,
        filePath: `/uploads/documents/${req.file.originalname}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedAt: new Date(),
      });
  
      // Sauvegarde du document dans la base de données
      await newDocument.save();
  
      res.json({
        message: 'Document téléchargé avec succès.',
        filePath: newDocument.filePath,
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload du document', error);
      res.status(500).json({ message: 'Erreur lors de l\'upload du document' });
    }
});

// Route pour récupérer les documents
router.get('/', async (req, res) => {
    try {
      const documents = await Document.find();
      res.json({ documents });
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

module.exports = router;
