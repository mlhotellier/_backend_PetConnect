const mongoose = require('mongoose');

const evenementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    petName: { type: String },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Evenement = mongoose.model('Evenement', evenementSchema);

module.exports = Evenement;