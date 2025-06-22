// server/routes/auth.js
const express = require('express');
const router = express.Router();
const users = require('../data/users');
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Email not found.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect password.' });
  }

  res.json({ message: 'Login successful', name: user.name });
});

module.exports = router;
