const IDCard = require("../models/IDCard");
const Birth = require("../models/Birth");

// Get all verified citizen records (both ID cards and birth records)
const getAllCitizens = async (req, res) => {
  try {
    // Fetch all ID cards (any status)
    const allIDs = await IDCard.find({});

    // Fetch all birth records (any status)
    const allBirths = await Birth.find({});

    // Transform ID cards to match the expected format
    const transformedIDs = allIDs.map((id) => ({
      _id: id._id,
      idNumber: id.idNumber,
      fullName: id.fullName,
      dob: id.dob,
      gender: id.gender,
      placeOfBirth: id.placeOfBirth,
      nationality: id.nationality,
      parentSerial: id.parentSerial,
      dateOfExpiry: id.dateOfExpiry,
      photo: id.photoPath,
      dateOfIssue: id.dateOfIssue,
      county: id.county,
      email: id.email,
      type: "ID Card",
      status: id.status,
    }));

    // Transform birth records to match the expected format
    const transformedBirths = allBirths.map((birth) => ({
      _id: birth._id,
      IDNumber: birth.IDNumber,
      fullName: birth.fullName,
      dateOfBirth: birth.dateOfBirth,
      gender: birth.gender,
      placeOfBirth: birth.placeOfBirth,
      nationality: birth.nationality,
      parentSerialNumber: birth.parentSerialNumber,
      dateOfExpiry: birth.dateOfExpiry,
      photo: birth.photo,
      dateOfIssue: birth.dateOfIssue,
      county: birth.county,
      email: birth.email,
      type: "Birth Record",
      status: birth.status,
    }));

    // Combine both arrays
    const allCitizens = [...transformedIDs, ...transformedBirths];

    res.json(allCitizens);
  } catch (error) {
    console.error("Error fetching all citizens:", error);
    res.status(500).json({
      message: "Failed to fetch citizen records",
      error: error.message,
    });
  }
};

// Get only verified ID cards
const getVerifiedIDs = async (req, res) => {
  try {
    const verifiedIDs = await IDCard.find({ status: "approved" });

    // Transform to match expected format
    const transformedIDs = verifiedIDs.map((id) => ({
      _id: id._id,
      idNumber: id.idNumber,
      fullName: id.fullName,
      dob: id.dob,
      gender: id.gender,
      placeOfBirth: id.placeOfBirth,
      nationality: id.nationality,
      parentSerial: id.parentSerial,
      dateOfExpiry: id.dateOfExpiry,
      photo: id.photoPath,
      dateOfIssue: id.dateOfIssue,
      county: id.county,
      email: id.email,
      type: "ID Card",
    }));

    res.json(transformedIDs);
  } catch (error) {
    console.error("Error fetching verified IDs:", error);
    res.status(500).json({
      message: "Failed to fetch verified ID cards",
      error: error.message,
    });
  }
};

// Get only verified birth records
const getVerifiedBirths = async (req, res) => {
  try {
    const verifiedBirths = await Birth.find({ status: "verified" });

    // Transform to match expected format
    const transformedBirths = verifiedBirths.map((birth) => ({
      _id: birth._id,
      IDNumber: birth.IDNumber,
      fullName: birth.fullName,
      dateOfBirth: birth.dateOfBirth,
      gender: birth.gender,
      placeOfBirth: birth.placeOfBirth,
      nationality: birth.nationality,
      parentSerialNumber: birth.parentSerialNumber,
      dateOfExpiry: birth.dateOfExpiry,
      photo: birth.photo,
      dateOfIssue: birth.dateOfIssue,
      county: birth.county,
      email: birth.email,
      type: "Birth Record",
    }));

    res.json(transformedBirths);
  } catch (error) {
    console.error("Error fetching verified births:", error);
    res.status(500).json({
      message: "Failed to fetch verified birth records",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCitizens,
  getVerifiedIDs,
  getVerifiedBirths,
};
