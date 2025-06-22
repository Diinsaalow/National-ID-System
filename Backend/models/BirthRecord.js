const mongoose = require('mongoose');

const birthSchema = new mongoose.Schema({
  IDNumber: { type: String, required: true, unique: true },
  fullName: String,
  dateOfBirth: String,
  gender: String,
  placeOfBirth: String,
  nationality: String,
  parentSerialNumber: String,
  dateOfIssue: String,
  dateOfExpiry: String,
  county: String,
  email: String,
  photo: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
});

module.exports = mongoose.model('BirthRecord', birthSchema);
