// File: backend/routes/auth.js
const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private route - requires authentication
router.get('/me', protect, getMe); // Add protect middleware here

module.exports = router;

