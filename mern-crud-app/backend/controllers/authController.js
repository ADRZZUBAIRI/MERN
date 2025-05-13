// File: backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { id: user.id };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: { id: user.id, username: user.username, email: user.email },
        });
      }
    );
  } catch (err) {
    console.error("Registration Error:", err.message, err.stack);
    res.status(500).send("Server error during registration");
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials (email)" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials (password)" });
    }
    const payload = { id: user.id };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, username: user.username, email: user.email },
        });
      }
    );
  } catch (err) {
    console.error("Login Error:", err.message, err.stack);
    res.status(500).send("Server error during login");
  }
};

// @desc    Get current logged-in user data
// @route   GET /api/auth/me
// @access  Private (requires token)
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(req.user);
};
module.exports = { registerUser, loginUser, getMe };
