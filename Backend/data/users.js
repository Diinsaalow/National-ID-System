// server/data/users.js
const bcrypt = require('bcrypt');

const hashedPassword = bcrypt.hashSync('Nira@2025', 10); // Hash password

module.exports = [
  {
    email: 'n@nira.so',
    password: hashedPassword,
    name: 'Admin NIRA'
  }
];
