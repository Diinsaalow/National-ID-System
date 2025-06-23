const express = require('express')
const multer = require('multer')
const {
  submitBirth,
  getPending,
  approveBirth,
  rejectBirth,
  getRejected,
  getVerified,
  sendRejectionEmail,
  sendApprovalEmail,
} = require('../controllers/birthController')
const Birth = require('../models/Birth')

const router = express.Router()

// Memory storage for birth certificate photo
const upload = multer({ storage: multer.memoryStorage() })

/*  POST: Submit new birth certificate */
router.post('/', upload.single('photo'), submitBirth)

/*  GET: All pending birth certificates */
router.get('/pending', getPending)

/*  GET: All rejected birth certificates */
router.get('/rejected', getRejected)

/*  GET: All verified birth certificates */
router.get('/verified', getVerified)

/*  POST: Approve specific birth certificate by ID */
router.post('/approve/:id', approveBirth)

/*  POST: Reject specific birth certificate by ID */
router.post('/reject/:id', rejectBirth)

/*  POST: Send rejection email */
router.post('/email/reject', sendRejectionEmail)

/*  POST: Send approval email */
router.post('/email/approve', sendApprovalEmail)

/*  PATCH: Update status (approved or rejected) - used by frontend */
router.patch('/:id/status', async (req, res) => {
  const { status, reason } = req.body
  try {
    const update = { status }
    if (status === 'approved') update.verifiedOn = new Date()
    if (status === 'rejected') {
      update.reason = reason
      update.rejectedOn = new Date()
    }

    const updatedRecord = await Birth.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Birth record not found' })
    }

    res.json({ message: ` Status updated to ${status}`, data: updatedRecord })
  } catch (error) {
    res
      .status(500)
      .json({ message: ' Failed to update status', error: error.message })
  }
})

/*  GET: Universal fetch by status e.g. /api/births?status=approved */
router.get('/', async (req, res) => {
  const { status } = req.query
  try {
    const filter = status ? { status } : {}
    const births = await Birth.find(filter).sort({ createdAt: -1 })
    res.json(births)
  } catch (error) {
    res
      .status(500)
      .json({ message: ' Failed to fetch birth records', error: error.message })
  }
})

module.exports = router
