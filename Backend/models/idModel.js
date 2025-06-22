// File: models/idModel.js
const mongoose = require('mongoose');

const idSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  placeOfBirth: String,
  nationality: String,
  parentSerial: String,
  dateOfIssue: { type: Date, required: true },
  dateOfExpiry: { type: Date, required: true },
  county: String,
  email: { type: String, required: true },
  photo: { type: String, required: true },
  type: { type: String, default: 'ID Card' },
  status: { type: String, default: 'pending' },
  reason: String
}, { timestamps: true });

module.exports = mongoose.model('ID', idSchema);
