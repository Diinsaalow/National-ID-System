const Birth = require('../models/Birth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const hashBuffer = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

exports.submitBirth = async (req, res) => {
  try {
    const {
      IDNumber, fullName, dateOfBirth, gender, placeOfBirth, nationality,
      parentSerialNumber, dateOfExpiry, dateOfIssue, county, email
    } = req.body;

    const photoBuffer = req.file.buffer;
    const photoHash = hashBuffer(photoBuffer);

    const exists = await Birth.findOne({
      $or: [ { IDNumber }, { photoHash } ]
    });
    if (exists) return res.status(400).json({ message: 'Duplicate ID or photo found' });

    const dob = new Date(dateOfBirth);
    const doi = new Date(dateOfIssue);
    const expiry = new Date(dateOfExpiry);

    if ((doi.getFullYear() - dob.getFullYear()) < 15)
      return res.status(400).json({ message: 'Must be at least 15 years old' });

    if ((expiry.getFullYear() - doi.getFullYear()) !== 10)
      return res.status(400).json({ message: 'Expiry must be 10 years after issue date' });

    await Birth.create({
      IDNumber, fullName, dateOfBirth, gender, placeOfBirth, nationality,
      parentSerialNumber, dateOfExpiry, dateOfIssue, county, email, photoHash
    });

    res.status(201).json({ message: 'Submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPending = async (req, res) => {
  const data = await Birth.find({ status: 'pending' }).sort({ createdAt: -1 });
  res.json(data);
};

exports.getRejected = async (req, res) => {
  const data = await Birth.find({ status: 'rejected' }).sort({ rejectedOn: -1 });
  res.json(data);
};

exports.getVerified = async (req, res) => {
  const data = await Birth.find({ status: 'verified' }).sort({ verifiedOn: -1 });
  res.json(data);
};

exports.approveBirth = async (req, res) => {
  const birth = await Birth.findById(req.params.id);
  if (!birth) return res.status(404).json({ message: 'Not found' });

  birth.status = 'verified';
  birth.verifiedOn = new Date();
  await birth.save();

  res.json({ message: 'Approved' });
};

exports.rejectBirth = async (req, res) => {
  const { reason } = req.body;
  const birth = await Birth.findById(req.params.id);
  if (!birth) return res.status(404).json({ message: 'Not found' });

  birth.status = 'rejected';
  birth.reason = reason;
  birth.rejectedOn = new Date();
  await birth.save();

  res.json({ message: 'Rejected' });
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendRejectionEmail = async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text: message });
    res.json({ message: 'Rejection email sent' });
  } catch {
    res.status(500).json({ message: 'Email failed' });
  }
};

exports.sendApprovalEmail = async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text: message });
    res.json({ message: 'Approval email sent' });
  } catch {
    res.status(500).json({ message: 'Email failed' });
  }
};
