// models/teacher.js
const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String },
  experience: { type: Number },
});

module.exports = mongoose.model("Teacher", teacherSchema);
