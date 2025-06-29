const express = require('express')
const {
  getAllCitizens,
  getVerifiedIDs,
  getVerifiedBirths,
} = require('../controllers/citizenController')

const router = express.Router()

// GET: All verified citizen records (both ID cards and birth records)
router.get('/all', getAllCitizens)

// GET: Only verified ID cards (matches frontend expectation)
router.get('/verified-ids', getVerifiedIDs)

// GET: Only verified birth records (matches frontend expectation)
router.get('/verified-births', getVerifiedBirths)

module.exports = router
