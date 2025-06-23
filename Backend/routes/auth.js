// server/routes/auth.js
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')
const {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
} = require('../middleware/validation')

// Public routes
router.post('/register', validateRegistration, authController.register)
router.post('/login', validateLogin, authController.login)

// Protected routes (require authentication)
router.get('/me', auth, authController.getCurrentUser)
router.put('/profile', auth, authController.updateProfile)
router.put(
  '/change-password',
  auth,
  validatePasswordChange,
  authController.changePassword
)

module.exports = router
