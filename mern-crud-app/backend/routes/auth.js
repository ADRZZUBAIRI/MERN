// File: backend/routes/auth.js
const express = require("express");
const authCtrl = require("../controllers/authController"); // Use a different alias
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/register", authCtrl.registerUser);
router.post("/login", authCtrl.loginUser);
router.get("/me", protect, authCtrl.getMe);
module.exports = router;
