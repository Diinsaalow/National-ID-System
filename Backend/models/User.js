const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        'Admin',
        'Reviewer',
        'Birth Recorder',
        'ID Card Recorder',
        'Death Recorder',
      ],
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
