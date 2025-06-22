const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/notifications/send
router.post('/send', async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g., your_email@gmail.com
        pass: process.env.EMAIL_PASS, // app password from Gmail
      },
    });

    await transporter.sendMail({
      from: `"NIRA Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
    });

    res.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

module.exports = router;
