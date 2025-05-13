// File: backend/models/Student.js
const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please add a name"], trim: true },
  grade: { type: String, required: [true, "Please add a grade"], trim: true },
  rollNumber: {
    type: String,
    required: [true, "Please add a roll number"],
    unique: true,
    trim: true,
  },
  age: { type: Number },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Student", StudentSchema);
