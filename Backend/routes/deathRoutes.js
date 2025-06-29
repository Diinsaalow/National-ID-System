const express = require('express')
const {
  getAllDeathRecords,
  getTodayDeathRecords,
  createDeathRecord,
  updateDeathRecordById,
  deleteDeathRecordById,
} = require('../controllers/deathRecordController')

const router = express.Router()

// GET /api/deaths - Get all death records
router.get('/', getAllDeathRecords)

// GET /api/deaths/today - Get today's death records only
router.get('/today', getTodayDeathRecords)

// POST /api/deaths - Create a new death record
router.post('/', createDeathRecord)

// PUT /api/deaths/:id - Update death record by ID
router.put('/:id', updateDeathRecordById)

// DELETE /api/deaths/:id - Delete death record by ID
router.delete('/:id', deleteDeathRecordById)

module.exports = router
