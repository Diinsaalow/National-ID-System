// File: routes/ids.js
const express = require('express')
const multer = require('multer')
const path = require('path')
const IDCard = require('../models/IDCard')

const router = express.Router()

//  Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})
const upload = multer({ storage })

//  POST: Submit new ID card application
router.post('/', upload.single('photoFile'), async (req, res) => {
  try {
    const photoPath = req.file ? `/uploads/${req.file.filename}` : ''
    const newID = new IDCard({
      ...req.body,
      photoPath,
      type: 'ID Card',
      status: 'pending',
    })

    await newID.save()
    res
      .status(201)
      .json({ message: ' ID Card submitted successfully', id: newID._id })
  } catch (error) {
    console.error(' Error submitting ID:', error)
    res
      .status(500)
      .json({ message: 'Failed to submit ID card', error: error.message })
  }
})

//  PUT: Update ID card by ID
router.put('/:id', upload.single('photoFile'), async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    // Handle photo upload if provided
    if (req.file) {
      updateData.photoPath = `/uploads/${req.file.filename}`
    }

    const updatedID = await IDCard.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedID) {
      return res.status(404).json({ message: 'ID card not found' })
    }

    res.json({
      message: 'ID card updated successfully',
      data: updatedID,
    })
  } catch (error) {
    console.error('Error updating ID card:', error)
    res.status(500).json({
      message: 'Failed to update ID card',
      error: error.message,
    })
  }
})

//  DELETE: Delete ID card by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const deletedID = await IDCard.findByIdAndDelete(id)

    if (!deletedID) {
      return res.status(404).json({ message: 'ID card not found' })
    }

    res.json({
      message: 'ID card deleted successfully',
      data: deletedID,
    })
  } catch (error) {
    console.error('Error deleting ID card:', error)
    res.status(500).json({
      message: 'Failed to delete ID card',
      error: error.message,
    })
  }
})

//  PATCH: Update status (approve/reject)
router.patch('/:id/status', async (req, res) => {
  const { status, reason } = req.body

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: ' Invalid status value' })
  }

  try {
    const update = { status }
    if (reason) update.reason = reason

    const updated = await IDCard.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })
    if (!updated)
      return res.status(404).json({ message: 'ID record not found' })

    res.json({ message: `Status updated to ${status}`, data: updated })
  } catch (error) {
    res
      .status(500)
      .json({ message: ' Failed to update status', error: error.message })
  }
})

//  GET: Get all ID cards (optionally filtered by status)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {}
    const ids = await IDCard.find(filter).sort({ createdAt: -1 })
    res.json(ids)
  } catch (error) {
    res
      .status(500)
      .json({ message: ' Failed to fetch ID cards', error: error.message })
  }
})

//  GET: Get only pending ID cards
router.get('/pending', async (req, res) => {
  try {
    const pendingIDs = await IDCard.find({ status: 'pending' })
    res.json(pendingIDs)
  } catch (error) {
    res
      .status(500)
      .json({ message: ' Failed to load pending IDs', error: error.message })
  }
})

//  GET: Get only rejected ID cards
router.get('/rejected', async (req, res) => {
  try {
    const rejectedIDs = await IDCard.find({ status: 'rejected' })
    res.json(rejectedIDs)
  } catch (error) {
    res
      .status(500)
      .json({ message: ' Failed to load rejected IDs', error: error.message })
  }
})

//  GET: Get only approved ID cards
router.get('/verified', async (req, res) => {
  try {
    const verifiedIDs = await IDCard.find({ status: 'approved' })
    res.json(verifiedIDs)
  } catch (error) {
    res
      .status(500)
      .json({ message: ' Failed to load verified IDs', error: error.message })
  }
})

module.exports = router
