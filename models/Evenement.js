const mongoose = require('mongoose');

const evenementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Evenement = mongoose.model('Evenement', evenementSchema);

module.exports = Evenement;