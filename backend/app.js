const express = require('express')
const mongoose = require('mongoose')

// Import routes
const authRoutes = require('./routes/authRoutes')
const booksRoutes = require('./routes/booksRoutes')

const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(express.json())

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));


// Middleware CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', booksRoutes)

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app