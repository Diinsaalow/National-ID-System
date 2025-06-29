const DeathRecord = require('../models/DeathRecord')

// Get all death records
exports.getAllDeathRecords = async (req, res) => {
  try {
    const deathRecords = await DeathRecord.find().sort({ createdAt: -1 })
    res.json(deathRecords)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch death records',
      error: error.message,
    })
  }
}

// Get today's death records only
exports.getTodayDeathRecords = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todaysDeaths = await DeathRecord.find({
      dateOfDeath: {
        $gte: today,
        $lt: tomorrow,
      },
    }).sort({ createdAt: -1 })

    res.json(todaysDeaths)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch today's death records",
      error: error.message,
    })
  }
}

// Create a new death record
exports.createDeathRecord = async (req, res) => {
  try {
    const { serialNumber, name, gender, dateOfDeath, location, reason } =
      req.body

    // Check if serial number already exists
    const existingRecord = await DeathRecord.findOne({ serialNumber })
    if (existingRecord) {
      return res.status(400).json({
        message: 'A death record with this serial number already exists',
      })
    }

    const deathRecord = await DeathRecord.create({
      serialNumber,
      name,
      gender,
      dateOfDeath,
      location,
      reason,
    })

    res.status(201).json({
      message: 'Death record created successfully',
      data: deathRecord,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create death record',
      error: error.message,
    })
  }
}

// Update death record by ID
exports.updateDeathRecordById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Check if serial number is being updated and if it already exists
    if (updateData.serialNumber) {
      const existingRecord = await DeathRecord.findOne({
        serialNumber: updateData.serialNumber,
        _id: { $ne: id }, // Exclude current record from check
      })
      if (existingRecord) {
        return res.status(400).json({
          message: 'A death record with this serial number already exists',
        })
      }
    }

    const updatedRecord = await DeathRecord.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedRecord) {
      return res.status(404).json({
        message: 'Death record not found',
      })
    }

    res.json({
      message: 'Death record updated successfully',
      data: updatedRecord,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update death record',
      error: error.message,
    })
  }
}

// Delete death record by ID
exports.deleteDeathRecordById = async (req, res) => {
  try {
    const { id } = req.params

    const deletedRecord = await DeathRecord.findByIdAndDelete(id)

    if (!deletedRecord) {
      return res.status(404).json({
        message: 'Death record not found',
      })
    }

    res.json({
      message: 'Death record deleted successfully',
      data: deletedRecord,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete death record',
      error: error.message,
    })
  }
}
