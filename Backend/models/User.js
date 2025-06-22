const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Please provide a valid email address'],
  },
  role: {
    type: String,
    enum: ['Admin', 'Reviewer', 'Birth Recorder', 'ID Card Recorder', 'Death Recorder'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
