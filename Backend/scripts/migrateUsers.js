const mongoose = require('mongoose')
const User = require('../models/User')
const { hashPassword } = require('../utils/password')
require('dotenv').config()

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI ||
        'mongodb+srv://diinsaalow:diinsaalow@cluster0.km23i.mongodb.net/',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )

    console.log(' Connected to MongoDB')

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'n@nira.so' })

    if (existingAdmin) {
      console.log(' Admin user already exists, skipping migration')
      return
    }

    // Create admin user with new format
    const hashedPassword = await hashPassword('Nira@2025')

    const adminUser = new User({
      username: 'admin',
      email: 'n@nira.so',
      password: hashedPassword,
      fullName: 'Admin NIRA',
      role: 'Admin',
    })

    await adminUser.save()
    console.log(' Admin user migrated successfully')

    console.log(' Migration completed successfully')
  } catch (error) {
    console.error(' Migration error:', error)
  } finally {
    await mongoose.disconnect()
    console.log(' Disconnected from MongoDB')
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateUsers()
}

module.exports = migrateUsers
