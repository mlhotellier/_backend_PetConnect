const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const petsRoutes = require('./routes/petsRoutes');
const contactsRoutes = require('./routes/contactsRoutes');
const cors = require('cors');
const path = require('path'); // Ajoutez ceci
require('dotenv').config();

// Connectez MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Servir les images statiques depuis le dossier 'uploads/pets'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/contacts', contactsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));