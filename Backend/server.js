// ===== IMPORTS =====
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// ===== APP INITIALIZATION =====
const app = express()
const PORT = process.env.PORT || 5000

// ===== MIDDLEWARES =====
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ===== STATIC FILES =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ===== CONNECT TO MONGODB =====
mongoose
  .connect(
    process.env.MONGO_URI ||
      'mongodb+srv://diinsaalow:diinsaalow@cluster0.km23i.mongodb.net/',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(' MongoDB connected'))
  .catch((err) => console.error(' MongoDB connection error:', err))

// ===== ROUTES IMPORTS =====
const authRoutes = require('./routes/auth')
const birthRoutes = require('./routes/birthRoutes')
const idRoutes = require('./routes/ids')
const notificationRoutes = require('./routes/notifications')
const userRoutes = require('./routes/userRoutes')
const sendEmailRoutes = require('./routes/sendEmail')

// ===== USE ROUTES =====
app.use('/api/auth', authRoutes)
app.use('/api/births', birthRoutes)
app.use('/api/ids', idRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/users', userRoutes)
app.use('/api/send-email', sendEmailRoutes)

// ===== TEST ROUTE =====
app.get('/', (req, res) => {
  res.send('🎉 API is running...')
})

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
