const mongoose = require('mongoose')
const IDCard = require('../models/IDCard')
const BirthRecord = require('../models/BirthRecord')
require('dotenv').config()

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI ||
      'mongodb+srv://diinsaalow:diinsaalow@cluster0.km23i.mongodb.net/',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Sample ID Card data
const sampleIDCards = [
  {
    idNumber: 'ID001234567',
    fullName: 'Ahmed Hassan Mohamed',
    dob: '1990-05-15',
    gender: 'Male',
    placeOfBirth: 'Mogadishu',
    nationality: 'Somali',
    parentSerial: 'PS123456',
    dateOfIssue: '2020-01-15',
    dateOfExpiry: '2030-01-15',
    county: 'Banaadir',
    email: 'ahmed.hassan@email.com',
    photoPath: '/uploads/sample-photo-1.jpg',
    type: 'ID Card',
    status: 'approved',
  },
  {
    idNumber: 'ID001234568',
    fullName: 'Fatima Ali Abdi',
    dob: '1985-08-22',
    gender: 'Female',
    placeOfBirth: 'Hargeisa',
    nationality: 'Somali',
    parentSerial: 'PS123457',
    dateOfIssue: '2020-02-20',
    dateOfExpiry: '2030-02-20',
    county: 'Woqooyi Galbeed',
    email: 'fatima.ali@email.com',
    photoPath: '/uploads/sample-photo-2.jpg',
    type: 'ID Card',
    status: 'approved',
  },
  {
    idNumber: 'ID001234569',
    fullName: 'Omar Jama Hussein',
    dob: '1995-12-10',
    gender: 'Male',
    placeOfBirth: 'Kismayo',
    nationality: 'Somali',
    parentSerial: 'PS123458',
    dateOfIssue: '2020-03-10',
    dateOfExpiry: '2030-03-10',
    county: 'Lower Juba',
    email: 'omar.jama@email.com',
    photoPath: '/uploads/sample-photo-3.jpg',
    type: 'ID Card',
    status: 'approved',
  },
]

// Sample Birth Record data
const sampleBirthRecords = [
  {
    IDNumber: 'BR001234567',
    fullName: 'Amina Mohamed Hassan',
    dateOfBirth: '2023-03-15',
    gender: 'Female',
    placeOfBirth: 'Mogadishu',
    nationality: 'Somali',
    parentSerialNumber: 'PS123459',
    dateOfIssue: '2023-04-15',
    dateOfExpiry: '2033-04-15',
    county: 'Banaadir',
    email: 'amina.mohamed@email.com',
    photo: '/uploads/sample-photo-4.jpg',
    status: 'approved',
  },
  {
    IDNumber: 'BR001234568',
    fullName: 'Khalid Abdi Omar',
    dateOfBirth: '2022-07-08',
    gender: 'Male',
    placeOfBirth: 'Bosaso',
    nationality: 'Somali',
    parentSerialNumber: 'PS123460',
    dateOfIssue: '2022-08-08',
    dateOfExpiry: '2032-08-08',
    county: 'Bari',
    email: 'khalid.abdi@email.com',
    photo: '/uploads/sample-photo-5.jpg',
    status: 'approved',
  },
  {
    IDNumber: 'BR001234569',
    fullName: 'Hodan Yusuf Ahmed',
    dateOfBirth: '2023-11-20',
    gender: 'Female',
    placeOfBirth: 'Baidoa',
    nationality: 'Somali',
    parentSerialNumber: 'PS123461',
    dateOfIssue: '2023-12-20',
    dateOfExpiry: '2033-12-20',
    county: 'Bay',
    email: 'hodan.yusuf@email.com',
    photo: '/uploads/sample-photo-6.jpg',
    status: 'approved',
  },
]

// Seed function
const seedData = async () => {
  try {
    // Clear existing data
    await IDCard.deleteMany({})
    await BirthRecord.deleteMany({})

    console.log('Cleared existing data')

    // Insert sample ID cards
    const insertedIDCards = await IDCard.insertMany(sampleIDCards)
    console.log(`Inserted ${insertedIDCards.length} ID cards`)

    // Insert sample birth records
    const insertedBirthRecords = await BirthRecord.insertMany(
      sampleBirthRecords
    )
    console.log(`Inserted ${insertedBirthRecords.length} birth records`)

    console.log('Sample data seeded successfully!')
    console.log(
      'Total records created:',
      insertedIDCards.length + insertedBirthRecords.length
    )
  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    mongoose.connection.close()
    console.log('Database connection closed')
  }
}

// Run the seed function
seedData()
