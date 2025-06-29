# Citizen Records API Documentation

This document describes the new API endpoints for fetching all citizen records in the NIRA system.

## Overview

The citizen records API provides endpoints to fetch verified citizen records from both ID cards and birth records. The data is normalized to provide a consistent format regardless of the source.

## Endpoints

### 1. Get All Citizen Records

**GET** `/api/all`

Fetches all verified citizen records (both ID cards and birth records) in a single request.

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "idNumber": "ID001234567",
    "fullName": "Ahmed Hassan Mohamed",
    "dob": "1990-05-15",
    "gender": "Male",
    "placeOfBirth": "Mogadishu",
    "nationality": "Somali",
    "parentSerial": "PS123456",
    "dateOfExpiry": "2030-01-15",
    "photo": "/uploads/sample-photo-1.jpg",
    "dateOfIssue": "2020-01-15",
    "county": "Banaadir",
    "email": "ahmed.hassan@email.com",
    "type": "ID Card"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "IDNumber": "BR001234567",
    "fullName": "Amina Mohamed Hassan",
    "dateOfBirth": "2023-03-15",
    "gender": "Female",
    "placeOfBirth": "Mogadishu",
    "nationality": "Somali",
    "parentSerialNumber": "PS123459",
    "dateOfExpiry": "2033-04-15",
    "photo": "/uploads/sample-photo-4.jpg",
    "dateOfIssue": "2023-04-15",
    "county": "Banaadir",
    "email": "amina.mohamed@email.com",
    "type": "Birth Record"
  }
]
```

### 2. Get Verified ID Cards Only

**GET** `/api/verified-ids`

Fetches only verified ID card records.

**Response:** Array of verified ID card records

### 3. Get Verified Birth Records Only

**GET** `/api/verified-births`

Fetches only verified birth record records.

**Response:** Array of verified birth record records

## Data Format

The API normalizes data from both ID cards and birth records to provide consistent field names:

### ID Card Fields

- `idNumber` - ID card number
- `fullName` - Full name of the citizen
- `dob` - Date of birth
- `gender` - Gender (Male/Female)
- `placeOfBirth` - Place of birth
- `nationality` - Nationality
- `parentSerial` - Parent serial number
- `dateOfExpiry` - Expiry date
- `photo` - Photo path (from `photoPath` field)
- `dateOfIssue` - Issue date
- `county` - County
- `email` - Email address
- `type` - Always "ID Card"

### Birth Record Fields

- `IDNumber` - Birth record number
- `fullName` - Full name of the citizen
- `dateOfBirth` - Date of birth
- `gender` - Gender (Male/Female)
- `placeOfBirth` - Place of birth
- `nationality` - Nationality
- `parentSerialNumber` - Parent serial number
- `dateOfExpiry` - Expiry date
- `photo` - Photo path
- `dateOfIssue` - Issue date
- `county` - County
- `email` - Email address
- `type` - Always "Birth Record"

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `500` - Server error

Error responses include a message and error details:

```json
{
  "message": "Failed to fetch citizen records",
  "error": "Error details"
}
```

## Usage Examples

### Frontend Integration

```javascript
// Fetch all citizen records
const response = await axios.get('/api/all')
const citizens = response.data

// Fetch only ID cards
const idResponse = await axios.get('/api/verified-ids')
const idCards = idResponse.data

// Fetch only birth records
const birthResponse = await axios.get('/api/verified-births')
const birthRecords = birthResponse.data
```

## Seeding Sample Data

To populate the database with sample data for testing:

```bash
cd Backend
node scripts/seedCitizenData.js
```

This will create 3 sample ID cards and 3 sample birth records with approved status.

## Notes

- Only records with `status: 'approved'` are returned
- The API automatically handles the different field names between ID cards and birth records
- Photo paths are normalized to use the `photo` field consistently
- All dates are returned as strings in YYYY-MM-DD format
