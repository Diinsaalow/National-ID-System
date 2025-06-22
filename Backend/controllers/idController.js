// File: controllers/idController.js
const ID = require('../models/idModel');

// Add new ID
exports.createID = async (req, res) => {
  try {
    const exists = await ID.findOne({ $or: [{ idNumber: req.body.idNumber }, { photo: req.body.photo }] });
    if (exists) return res.status(400).json({ message: 'ID Number or Photo already exists' });

    const newID = new ID(req.body);
    await newID.save();
    res.status(201).json(newID);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get IDs by status
exports.getIDsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const ids = await ID.find({ status });
    res.json(ids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject or Approve
exports.updateIDStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body; // { status: 'approved' } or { status: 'rejected', reason: '...' }
    const updated = await ID.findByIdAndUpdate(id, update, { new: true });
    res.json({ message: 'Updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
