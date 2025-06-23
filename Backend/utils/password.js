const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
  console.log(
    'hashPassword called with:',
    typeof password,
    'value:',
    password ? '***' : 'undefined'
  )

  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string')
  }

  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

const comparePassword = async (password, hashedPassword) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string')
  }

  if (!hashedPassword || typeof hashedPassword !== 'string') {
    throw new Error('Hashed password must be a non-empty string')
  }

  return await bcrypt.compare(password, hashedPassword)
}

module.exports = {
  hashPassword,
  comparePassword,
}
