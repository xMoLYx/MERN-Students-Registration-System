const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

// db connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:4173', // Lokalny adres dla testów
    'http://localhost:5173', // Lokalny adres dla testów (Vite)
    'https://mern-students-registration-system-kli3-nyki9h6or.vercel.app', // Frontend na Vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// routes
app.use('/', require('./routes/authRoutes'));

// dynamic port
const port = process.env.PORT || 2525;
app.listen(port, () => console.log(`Server is running on port ${port}`));
