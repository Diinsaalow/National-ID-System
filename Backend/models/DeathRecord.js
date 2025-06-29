const mongoose = require('mongoose')

const deathRecordSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female'],
    },
    dateOfDeath: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('DeathRecord', deathRecordSchema)
