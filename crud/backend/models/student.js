// models/student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: String },
  major: { type: String },
});

module.exports = mongoose.model("Student", studentSchema);
