const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const petsRoutes = require('./routes/petsRoutes');
const contactsRoutes = require('./routes/contactsRoutes');
const documentRoutes = require('./routes/documentRoutes');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀Server started on port ${PORT}`));