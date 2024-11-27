// routes/profileRoutes.js
const express = require('express');
const Contact = require('../models/Contact');
const User = require('../models/User');
const router = express.Router();

// Route pour ajouter un contact
router.post('/add', async (req, res) => {
  const { name, adress, phone, mail, userId } = req.body;

  // Vérifier si l'ID utilisateur est présent
  if (!userId) {
    return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
  }

  // Validation des champs (vérifier les champs obligatoires)
  if (!name || !adress || !phone || !mail) {
    return res.status(400).json({ message: 'Tous les champs doivent être remplis.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Créer un nouvel contact
    const contact = new Contact({
      name,
      adress,
      phone,
      mail,
      user: userId, // Lier l'utilisateur
    });

    const savedContact = await contact.save();
    res.status(201).json(savedContact); // Retourner le contact sauvegardé
  } catch (error) {
    console.error('Erreur lors de l\'ajout du contact:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du contact' });
  }
});

// Route pour récupérer tous les contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contacts' });
  }
});

// Route pour supprimer un contact
router.delete('/remove/:id', async (req, res) => {
  const contactId = req.params.id;
  
  try {
    const contact = await Contact.findById(contactId);
    
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
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, adress, phone, mail } = req.body;

  try {
    const contact = await Contact.findById(id);
    
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