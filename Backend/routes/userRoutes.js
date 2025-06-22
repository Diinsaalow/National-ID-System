// File: routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ➕ Add new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    console.log(`✅ User saved: ${user.fullName} (${user.role})`);
    res.status(201).json(user);
  } catch (err) {
    console.error('❌ Error saving user:', err);
    res.status(400).json({ error: err.message });
  }
});

// 📄 Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 📊 Get specific stats: New Users Today, Admins, Reviewers
router.get('/stats', async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [newUsersToday, totalAdmins, totalReviewers] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      User.countDocuments({ role: 'Admin' }),
      User.countDocuments({ role: 'Reviewer' }),
    ]);

    res.json({
      newUsersToday: newUsersToday || 0,
      totalAdmins: totalAdmins || 0,
      totalReviewers: totalReviewers || 0,
    });
  } catch (err) {
    console.error('❌ Error in /stats:', err);
    res.status(500).json({
      newUsersToday: 0,
      totalAdmins: 0,
      totalReviewers: 0,
      error: 'Stats fetch failed',
    });
  }
});

// 🖊️ Update user
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) {
    console.error('❌ PUT error:', err);
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
