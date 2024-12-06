const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Document = require('../models/Document');
const { uploadDocument } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Endpoint pour télécharger un document (PDF, image, etc.)
router.post('/add', authMiddleware, uploadDocument.single('document'), async (req, res) => {
    const userId = req.auth.userId; // ID utilisateur depuis le token (authMiddleware)

    if (!userId) {
        return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
    }

    if (!req.file) {
        return res.status(400).send('Aucun fichier téléchargé.');
    }

    try {
        // Création du répertoire utilisateur si inexistant
        const userDir = path.join(__dirname, '../uploads/documents', userId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        // Déplacement du fichier vers le répertoire de l'utilisateur
        const timestamp = Date.now();
        const formattedName = req.file.originalname.replace(/\s+/g, '_'); // Remplace les espaces par des underscores
        const finalFileName = `${timestamp}_${formattedName}`;
        const finalPath = path.join(userDir, finalFileName);

        fs.renameSync(req.file.path, finalPath); // Déplacement du fichier

        // Création d'un document associé à l'utilisateur
        const newDocument = new Document({
            userId,
            filename: finalFileName,
            originalname: req.file.originalname,
            filePath: `/uploads/documents/${userId}/${finalFileName}`,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            uploadedAt: new Date(),
        });

        // Sauvegarde dans la base de données
        await newDocument.save();

        res.json({
            message: 'Document téléchargé avec succès.',
            newDocument: newDocument,
        });
        
    } catch (error) {
        console.error('Erreur lors de l\'upload du document', error);
        res.status(500).json({ message: 'Erreur lors de l\'upload du document' });
    }
});

// Route pour récupérer les documents de l'utilisateur
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.auth.userId; // ID utilisateur depuis le token (authMiddleware)

  try {
      // Récupérer uniquement les documents appartenant à l'utilisateur
      const documents = await Document.find({ userId });

      res.json({ documents });
  } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour supprimer un document et son fichier
router.delete('/delete/:documentId', authMiddleware, async (req, res) => {
  const userId = req.auth.userId;
  const documentId = req.params.documentId; // Assurez-vous que cet ID est correct

  try {
    const document = await Document.findOne({ _id: documentId, userId });

    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé ou accès non autorisé' });
    }

    const filePath = path.join(__dirname, '../uploads/documents', userId, document.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Supprimer le fichier du répertoire
    }

    await Document.deleteOne({ _id: documentId }); // Supprimer du base de données

    res.json({ message: 'Document supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du document', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;