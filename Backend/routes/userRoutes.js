// File: routes/userRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Birth = require("../models/Birth");
const IDCard = require("../models/IDCard");

// ➕ Add new user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    console.log(` User saved: ${user.fullName} (${user.role})`);
    res.status(201).json(user);
  } catch (err) {
    console.error(" Error saving user:", err);
    res.status(400).json({ error: err.message });
  }
});

// 📄 Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 📊 Get comprehensive dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Get all statistics in parallel for better performance
    const [
      // User statistics
      newUsersToday,
      totalAdmins,
      totalReviewers,
      totalUsers,

      // Birth records statistics
      totalBirthRecords,
      verifiedBirthRecords,
      rejectedBirthRecords,
      todaysBirthRequests,
      maleCitizens,
      femaleCitizens,

      // ID records statistics
      totalIDRecords,
      verifiedIDRecords,
      rejectedIDRecords,
      todaysIDRequests,
      pendingIDRecords,

      // Pending documents (awaiting approval)
      pendingBirthRecords,
    ] = await Promise.all([
      // User queries
      User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      User.countDocuments({ role: "Admin" }),
      User.countDocuments({ role: "Reviewer" }),
      User.countDocuments({}),

      // Birth records queries
      Birth.countDocuments({}),
      Birth.countDocuments({ status: "verified" }),
      Birth.countDocuments({ status: "rejected" }),
      Birth.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      Birth.countDocuments({ gender: { $regex: /^male$/i } }),
      Birth.countDocuments({ gender: { $regex: /^female$/i } }),

      // ID records queries
      IDCard.countDocuments({}),
      IDCard.countDocuments({ status: "approved" }),
      IDCard.countDocuments({ status: "rejected" }),
      IDCard.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      IDCard.countDocuments({ status: "pending" }),

      // Pending documents
      Birth.countDocuments({ status: "pending" }),
    ]);

    // Calculate documents about to expire (birth records expiring within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const docsAboutToExpire = await Birth.countDocuments({
      dateOfExpiry: { $lte: thirtyDaysFromNow, $gte: new Date() },
      status: "verified",
    });

    // Total rejected cases (birth + ID)
    const totalRejectedCases = rejectedBirthRecords + rejectedIDRecords;

    // Total documents awaiting approval
    const docsAwaitingApproval = pendingBirthRecords + pendingIDRecords;

    // Death records (placeholder - no death model exists yet)
    const deathRecords = 0;
    const todaysDeathRequests = 0;

    res.json({
      // Birth records
      birthRecords: totalBirthRecords || 0,
      todaysBirthRequests: todaysBirthRequests || 0,

      // ID records
      idRecords: totalIDRecords || 0,
      todaysIDRequests: todaysIDRequests || 0,

      // Verified/Rejected
      verifiedUsers: verifiedBirthRecords + verifiedIDRecords || 0,
      rejectedCases: totalRejectedCases || 0,

      // Death records (placeholder)
      deathRecords: deathRecords || 0,
      todaysDeathRequests: todaysDeathRequests || 0,

      // Document status
      docsAwaitingApproval: docsAwaitingApproval || 0,
      docsAboutToExpire: docsAboutToExpire || 0,

      // User statistics
      newUsersToday: newUsersToday || 0,
      totalAdmins: totalAdmins || 0,
      totalReviewers: totalReviewers || 0,
      totalUsers: totalUsers || 0,

      // Gender breakdown
      male: maleCitizens || 0,
      female: femaleCitizens || 0,
    });
  } catch (err) {
    console.error("📊 Error in /stats:", err);
    res.status(500).json({
      // Return default values on error
      birthRecords: 0,
      idRecords: 0,
      verifiedUsers: 0,
      rejectedCases: 0,
      deathRecords: 0,
      todaysIDRequests: 0,
      todaysDeathRequests: 0,
      docsAwaitingApproval: 0,
      docsAboutToExpire: 0,
      newUsersToday: 0,
      totalAdmins: 0,
      totalReviewers: 0,
      totalUsers: 0,
      male: 0,
      female: 0,
      todaysBirthRequests: 0,
      error: "Stats fetch failed",
    });
  }
});

// 🖊️ Update user
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    console.error(" PUT error:", err);
    res.status(400).json({ error: err.message });
  }
});

//  Delete user
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
