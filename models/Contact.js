const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  name: { type: String, required: true },
  adress: { type: String, required: true },
  phone: { type: String, required: true },
  mail: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
