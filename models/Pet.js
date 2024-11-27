const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  type: { type: String, required: true },
  color: { type: String, required: true },
  image: { type: String, required: true },
  data: [
    {
      date: { type: Date, required: true },
      weight: { type: Number, required: true },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;