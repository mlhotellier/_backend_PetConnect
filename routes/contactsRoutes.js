const express = require('express');
const Contact = require('../models/Contact');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware d'authentification

// Route pour ajouter un contact
router.post('/add', authMiddleware, async (req, res) => {
  const { name, adress, phone, mail } = req.body;
  const userId = req.auth.userId;  // Récupérer l'ID de l'utilisateur à partir du middleware d'authentification

  if (!name || !adress || !phone || !mail) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    // Créer un nouveau contact et lier l'ID utilisateur
    const newContact = new Contact({
      name,
      adress,
      phone,
      mail,
      user: userId, // Lier ce contact à l'utilisateur authentifié
    });

    await newContact.save(); // Sauvegarder le contact dans la base de données
    res.status(201).json(newContact); // Retourner le contact ajouté
  } catch (error) {
    console.error('Erreur lors de l\'ajout du contact:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du contact' });
  }
});

// Route pour récupérer tous les contacts
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.auth.userId;  // Récupérer l'ID de l'utilisateur à partir du middleware

  try {
    const contacts = await Contact.find({ user: userId });  // Chercher les contacts de l'utilisateur
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: 'Aucun contact trouvé pour cet utilisateur.' });
    }
    res.status(200).json(contacts); // Retourner les contacts trouvés
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contacts' });
  }
});

// Route pour supprimer un contact
router.delete('/remove/:id', authMiddleware, async (req, res) => {
  const contactId = req.params.id;
  
  try {
    const userId = req.auth.userId;

    const contact = await Contact.findById(contactId, { user: userId });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact non trouvé' });
    }

    await Contact.findByIdAndDelete(contactId);
    res.status(200).json({ message: 'Contact supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du contact:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du contact' });
  }
});

// Route pour mettre à jour un contact
router.put('/update/:id', authMiddleware, async (req, res) => {
  const contactId = req.params.id;
  const { name, adress, phone, mail } = req.body;

  try {
    const userId = req.auth.userId;

    const contact = await Contact.findById(contactId, { user: userId });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact non trouvé' });
    }

    // Vérification des modifications
    contact.name = name || contact.name;
    contact.adress = adress || contact.adress;
    contact.phone = phone || contact.phone;
    contact.mail = mail || contact.mail;

    const updatedContact = await contact.save();
    
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contact:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du cotnact' });
  }
});

module.exports = router;