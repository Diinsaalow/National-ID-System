const mongoose = require('mongoose');

const IDCardSchema = new mongoose.Schema({
  idNumber: String,
  fullName: String,
  dob: String,
  gender: String,
  placeOfBirth: String,
  nationality: String,
  parentSerial: String,
  dateOfIssue: String,
  dateOfExpiry: String,
  county: String,
  email: String,
  photoPath: String,
  type: { type: String, default: 'ID Card' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('IDCard', IDCardSchema);
