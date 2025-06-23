const mongoose = require('mongoose')
const User = require('./models/User')
const { hashPassword } = require('./utils/password')
require('dotenv').config()

const testRegistration = async () => {
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

    // Test data
    const testData = {
      username: 'testuser123',
      email: 'test123@example.com',
      password: 'password123',
      fullName: 'Test User',
      role: 'Reviewer',
    }

    console.log('Test data:', { ...testData, password: '***' })

    // Test password hashing directly
    console.log('\n🔐 Testing password hashing...')
    try {
      const hashedPassword = await hashPassword(testData.password)
      console.log(
        ' Password hashed successfully:',
        hashedPassword.substring(0, 20) + '...'
      )
    } catch (error) {
      console.error(' Password hashing failed:', error.message)
      return
    }

    // Test user creation
    console.log('\n👤 Testing user creation...')
    try {
      const hashedPassword = await hashPassword(testData.password)
      const user = new User({
        username: testData.username,
        email: testData.email,
        password: hashedPassword,
        fullName: testData.fullName,
        role: testData.role,
      })

      await user.save()
      console.log(' User created successfully:', user.username)
    } catch (error) {
      console.error(' User creation failed:', error.message)
      return
    }

    // Clean up
    await User.deleteOne({ email: testData.email })
    console.log(' Test user cleaned up')

    console.log('\n🎉 Registration test completed successfully!')
  } catch (error) {
    console.error(' Test error:', error)
  } finally {
    await mongoose.disconnect()
    console.log(' Disconnected from MongoDB')
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testRegistration()
}

module.exports = testRegistration
