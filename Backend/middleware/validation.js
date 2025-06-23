const validateRegistration = (req, res, next) => {
  const { username, email, password, fullName } = req.body

  console.log('Validation - Request body:', { username, email, fullName })
  console.log(
    'Validation - Password type:',
    typeof password,
    'Password exists:',
    !!password
  )

  // Check required fields
  if (!username || !email || !password || !fullName) {
    const missingFields = []
    if (!username) missingFields.push('username')
    if (!email) missingFields.push('email')
    if (!password) missingFields.push('password')
    if (!fullName) missingFields.push('fullName')

    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`,
      missingFields,
    })
  }

  // Ensure all fields are strings
  if (
    typeof username !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof fullName !== 'string'
  ) {
    return res.status(400).json({
      message: 'All fields must be strings',
    })
  }

  // Validate username
  if (username.trim().length < 3 || username.trim().length > 30) {
    return res.status(400).json({
      message: 'Username must be between 3 and 30 characters',
    })
  }

  // Validate email format
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      message: 'Please provide a valid email address',
    })
  }

  // Validate password
  if (password.trim().length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long',
    })
  }

  // Validate fullName
  if (fullName.trim().length < 2) {
    return res.status(400).json({
      message: 'Full name must be at least 2 characters long',
    })
  }

  // Trim all fields before passing to controller
  req.body.username = username.trim()
  req.body.email = email.trim()
  req.body.password = password.trim()
  req.body.fullName = fullName.trim()

  next()
}

const validateLogin = (req, res, next) => {
  const { email, password } = req.body

  // Check required fields
  if (!email || !password) {
    const missingFields = []
    if (!email) missingFields.push('email')
    if (!password) missingFields.push('password')

    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`,
      missingFields,
    })
  }

  // Ensure fields are strings
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      message: 'Email and password must be strings',
    })
  }

  // Validate email format
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      message: 'Please provide a valid email address',
    })
  }

  // Trim fields
  req.body.email = email.trim()
  req.body.password = password.trim()

  next()
}

const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body

  // Check required fields
  if (!currentPassword || !newPassword) {
    const missingFields = []
    if (!currentPassword) missingFields.push('currentPassword')
    if (!newPassword) missingFields.push('newPassword')

    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`,
      missingFields,
    })
  }

  // Ensure fields are strings
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    return res.status(400).json({
      message: 'Passwords must be strings',
    })
  }

  // Validate new password
  if (newPassword.trim().length < 6) {
    return res.status(400).json({
      message: 'New password must be at least 6 characters long',
    })
  }

  // Trim fields
  req.body.currentPassword = currentPassword.trim()
  req.body.newPassword = newPassword.trim()

  next()
}

module.exports = {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
}
