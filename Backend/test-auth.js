const mongoose = require('mongoose')
const User = require('./models/User')
const { generateToken } = require('./utils/jwt')
const { hashPassword, comparePassword } = require('./utils/password')
require('dotenv').config()

const testAuth = async () => {
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

    console.log('✅ Connected to MongoDB')

    // Test password hashing
    console.log('\n🔐 Testing password hashing...')
    const password = 'testpassword123'
    const hashedPassword = await hashPassword(password)
    console.log('✅ Password hashed successfully')

    // Test password comparison
    const isMatch = await comparePassword(password, hashedPassword)
    console.log('✅ Password comparison:', isMatch ? 'SUCCESS' : 'FAILED')

    // Test JWT token generation
    console.log('\n🎫 Testing JWT token generation...')
    const testUserId = new mongoose.Types.ObjectId()
    const token = generateToken(testUserId)
    console.log('✅ JWT token generated:', token.substring(0, 20) + '...')

    // Test user creation
    console.log('\n👤 Testing user creation...')
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      fullName: 'Test User',
      role: 'Reviewer',
    })

    await testUser.save()
    console.log('✅ Test user created successfully')

    // Test user retrieval
    const foundUser = await User.findOne({ email: 'test@example.com' }).select(
      '-password'
    )
    console.log('✅ User retrieved:', foundUser.username)

    // Clean up test user
    await User.deleteOne({ email: 'test@example.com' })
    console.log('✅ Test user cleaned up')

    console.log('\n🎉 All authentication tests passed!')
  } catch (error) {
    console.error('❌ Test error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testAuth()
}

module.exports = testAuth
