const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// POST /api/send-email
router.post("/", async (req, res) => {
  const { to, subject, message } = req.body;

  // Validate required fields
  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields (to, subject, message) are required.",
    });
  }

  try {
    // Create transporter using environment variables
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"NIRA Team" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: message,
    });

    // Success response
    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);

    // Error response
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

module.exports = router;
