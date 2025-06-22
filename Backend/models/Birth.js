const mongoose = require('mongoose');

const birthSchema = new mongoose.Schema({
  IDNumber: { type: String, required: true, unique: true },
  fullName: String,
  dateOfBirth: Date,
  gender: String,
  placeOfBirth: String,
  nationality: String,
  parentSerialNumber: String,
  dateOfExpiry: Date,
  dateOfIssue: Date,
  county: String,
  email: String,
  status: { type: String, default: 'pending' },
  photoHash: { type: String, unique: true },
  rejectedOn: Date,
  reason: String,
  verifiedOn: Date,
  type: { type: String, default: 'Birth Certificate' },
}, { timestamps: true });

module.exports = mongoose.model('Birth', birthSchema);
