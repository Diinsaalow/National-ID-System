const express = require('express')
const {
  getAllCitizens,
  getVerifiedIDs,
  getVerifiedBirths,
} = require('../controllers/citizenController')
const IDCard = require('../models/IDCard')
const Birth = require('../models/Birth')

const router = express.Router()

// GET: All verified citizen records (both ID cards and birth records)
router.get('/all', getAllCitizens)

// GET: Only verified ID cards (matches frontend expectation)
router.get('/verified-ids', getVerifiedIDs)

// GET: Only verified birth records (matches frontend expectation)
router.get('/verified-births', getVerifiedBirths)

// PUT: Update citizen record by ID and type
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { type, ...updateData } = req.body

    let updatedRecord

    if (type === 'ID Card') {
      updatedRecord = await IDCard.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
    } else if (type === 'Birth Record') {
      updatedRecord = await Birth.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
    } else {
      return res.status(400).json({ message: 'Invalid record type' })
    }

    if (!updatedRecord) {
      return res.status(404).json({ message: 'Citizen record not found' })
    }

    res.json({
      message: 'Citizen record updated successfully',
      data: updatedRecord,
    })
  } catch (error) {
    console.error('Error updating citizen record:', error)
    res.status(500).json({
      message: 'Failed to update citizen record',
      error: error.message,
    })
  }
})

// DELETE: Delete citizen record by ID and type
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { type } = req.query

    let deletedRecord

    if (type === 'ID Card') {
      deletedRecord = await IDCard.findByIdAndDelete(id)
    } else if (type === 'Birth Record') {
      deletedRecord = await Birth.findByIdAndDelete(id)
    } else {
      return res.status(400).json({ message: 'Invalid record type' })
    }

    if (!deletedRecord) {
      return res.status(404).json({ message: 'Citizen record not found' })
    }

    res.json({
      message: 'Citizen record deleted successfully',
      data: deletedRecord,
    })
  } catch (error) {
    console.error('Error deleting citizen record:', error)
    res.status(500).json({
      message: 'Failed to delete citizen record',
      error: error.message,
    })
  }
})

module.exports = router
