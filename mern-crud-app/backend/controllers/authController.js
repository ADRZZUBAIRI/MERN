// File: backend/controllers/authController.js
// Handles user registration and login logic
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    user = await User.findOne({ username });
     if (user) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Create new user instance
    user = new User({
      username,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      id: user.id, // Use user.id (mongoose adds this virtual getter)
    };

    // Sign JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ // 201 Created status
          token,
          user: { // Send back some user info (excluding password)
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).send('Server error during registration');
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials (email)' });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials (password)' });
    }

    // Create JWT payload
    const payload = {
      id: user.id,
    };

    // Sign JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({
           token,
           user: { // Send back some user info (excluding password)
            id: user.id,
            username: user.username,
            email: user.email
          }
         });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error during login');
  }
};

// @desc    Get current logged-in user data
// @route   GET /api/auth/me
// @access  Private (requires token)
const getMe = async (req, res) => {
    // req.user is attached by the protect middleware
    // We already fetched the user in the middleware, excluding the password
    if (!req.user) {
         return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(req.user);
};


module.exports = {
  registerUser,
  loginUser,
  getMe,
};
