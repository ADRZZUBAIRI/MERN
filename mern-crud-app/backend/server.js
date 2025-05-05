// File: backend/server.js
// Main backend server file
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON format

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/students', require('./routes/students'));

// Simple route for testing server is running
app.get('/', (req, res) => res.send('API Running'));

// Define PORT
const PORT = process.env.PORT || 5001; // Use port from .env or default to 5001

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
