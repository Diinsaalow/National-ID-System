// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const BirthRecord = require('../models/BirthRecord');
// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage });

// // Submit birth record → auto approved
// router.post('/', upload.single('photo'), async (req, res) => {
//   try {
//     const record = new BirthRecord({
//       ...req.body,
//       photo: req.file ? `/uploads/${req.file.filename}` : '',
//       status: 'approved'
//     });
//     await record.save();
//     res.status(201).json({ message: '✅ Birth record submitted and approved.', data: record });
//   } catch (err) {
//     res.status(500).json({ message: '❌ Failed to save birth record', error: err.message });
//   }
// });

// // Fetch all approved birth records
// router.get('/approved', async (req, res) => {
//   try {
//     const approved = await BirthRecord.find({ status: 'approved' });
//     res.json(approved);
//   } catch (err) {
//     res.status(500).json({ message: '❌ Failed to fetch records' });
//   }
// });

// module.exports = router;
