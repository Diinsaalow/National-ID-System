// File: config/db.js
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/nira_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(' MongoDB connected successfully')
  } catch (err) {
    console.error(' MongoDB connection error:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
