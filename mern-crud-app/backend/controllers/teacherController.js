// File: backend/controllers/teacherController.js
const Teacher = require("../models/Teacher");
const Student = require("../models/Student"); // Needed for updating students on teacher deletion
const mongoose = require("mongoose"); // For ObjectId validation

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Get Teachers Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single teacher by ID
// @route   GET /api/teachers/:id
// @access  Private
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    console.error("Get Teacher By ID Error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid teacher ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get students for a specific teacher
// @route   GET /api/teachers/:id/students
// @access  Private
const getStudentsForTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacher ID format" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const students = await Student.find({ teacher: teacherId }).populate(
      "teacher",
      "name subject"
    ); // Optionally populate teacher again if needed
    res.status(200).json(students);
  } catch (error) {
    console.error("Get Students for Teacher Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Private
const createTeacher = async (req, res) => {
  const { name, subject, experienceYears, email } = req.body;
  if (!name || !subject) {
    return res.status(400).json({ message: "Please provide name and subject" });
  }
  try {
    if (email) {
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res
          .status(400)
          .json({ message: `Teacher with email ${email} already exists` });
      }
    }
    const newTeacher = new Teacher({ name, subject, experienceYears, email });
    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    console.error("Create Teacher Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Private
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const { email } = req.body;
    if (email && email !== teacher.email) {
      const existingTeacher = await Teacher.findOne({ email: email });
      if (existingTeacher && existingTeacher._id.toString() !== req.params.id) {
        return res
          .status(400)
          .json({
            message: `Another teacher with email ${email} already exists`,
          });
      }
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedTeacher);
  } catch (error) {
    console.error("Update Teacher Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid teacher ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private
const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Set teacher field to null for all students assigned to this teacher
    await Student.updateMany(
      { teacher: teacherId },
      { $set: { teacher: null } }
    );

    await Teacher.findByIdAndDelete(teacherId);

    res
      .status(200)
      .json({
        message: "Teacher removed successfully and students unassigned.",
        id: teacherId,
      });
  } catch (error) {
    console.error("Delete Teacher Error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid teacher ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  getStudentsForTeacher, // Export new controller
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
