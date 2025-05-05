//File: backend/models/Teacher.js
const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true,
  },
  experienceYears: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    // Consider adding validation or uniqueness if needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Teacher', TeacherSchema);
