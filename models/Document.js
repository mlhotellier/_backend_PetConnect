const mongoose = require('mongoose');

const docSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalname: { type: String, required: true },
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: Number },
  uploadedAt: { type: Date, default: Date.now },
});

const Document = mongoose.model('Document', docSchema);

module.exports = Document;