const User = require('../models/User')
const { generateToken } = require('../utils/jwt')
const { hashPassword, comparePassword } = require('../utils/password')

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body

    console.log('Registration request body:', {
      username,
      email,
      fullName,
      role,
    })
    console.log(
      'Password type:',
      typeof password,
      'Password value:',
      password ? '***' : 'undefined'
    )

    // Additional validation for password
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Password is required and must be a string',
      })
    }

    if (password.trim().length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? 'Email already registered'
            : 'Username already taken',
      })
    }

    console.log('Starting password hashing...')

    // Hash password
    const hashedPassword = await hashPassword(password.trim())

    console.log('Password hashed successfully')

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role || 'Reviewer', // Default role
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error during registration' })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Generate token
    const token = generateToken(user._id)

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    }

    res.json({
      message: 'Login successful',
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
}

// Get current user (authenticated)
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({ user })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body
    const userId = req.user._id

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } })
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, email },
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error during profile update' })
  }
}

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user._id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    )
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    user.password = hashedNewPassword
    await user.save()

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Server error during password change' })
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
}
