// File: backend/controllers/studentController.js
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Book = require("../models/Book");
const mongoose = require("mongoose");

const getStudents = async (req, res) => {
  try {
    const { teacherId } = req.query;
    let query = {};
    if (teacherId) {
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res
          .status(400)
          .json({ message: "Invalid teacher ID format for query" });
      }
      query.teacher = teacherId;
    }
    const students = await Student.find(query).populate("teacher");
    res.status(200).json(students);
  } catch (error) {
    console.error("Get Students Error:", error.message, error.stack);
    res.status(500).json({ message: "Server Error while fetching students" });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("teacher");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error("Get Student By ID Error:", error.message, error.stack);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid student ID format" });
    }
    res
      .status(500)
      .json({ message: "Server Error while fetching single student" });
  }
};

const createStudent = async (req, res) => {
  const { name, grade, rollNumber, age, teacher } = req.body;
  if (!name || !grade || !rollNumber) {
    return res
      .status(400)
      .json({ message: "Please provide name, grade, and roll number" });
  }
  try {
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res
        .status(400)
        .json({
          message: `Student with roll number ${rollNumber} already exists`,
        });
    }
    if (teacher) {
      if (!mongoose.Types.ObjectId.isValid(teacher)) {
        return res.status(400).json({ message: "Invalid teacher ID format" });
      }
      const teacherExists = await Teacher.findById(teacher);
      if (!teacherExists) {
        return res
          .status(404)
          .json({ message: `Teacher with ID ${teacher} not found.` });
      }
    }
    const newStudentData = { name, grade, rollNumber, age };
    if (teacher) {
      newStudentData.teacher = teacher;
    }
    const newStudent = new Student(newStudentData);
    const savedStudent = await newStudent.save();
    const populatedStudent = await Student.findById(savedStudent._id).populate(
      "teacher"
    );
    res.status(201).json(populatedStudent);
  } catch (error) {
    console.error("Create Student Error:", error.message, error.stack);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server Error while creating student" });
  }
};

const updateStudent = async (req, res) => {
  const { name, grade, rollNumber, age, teacher } = req.body;
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (rollNumber && rollNumber !== student.rollNumber) {
      const existingStudent = await Student.findOne({ rollNumber: rollNumber });
      if (existingStudent && existingStudent._id.toString() !== req.params.id) {
        return res
          .status(400)
          .json({
            message: `Another student with roll number ${rollNumber} already exists`,
          });
      }
    }
    if (teacher !== undefined) {
      if (teacher !== null) {
        if (!mongoose.Types.ObjectId.isValid(teacher)) {
          return res.status(400).json({ message: "Invalid teacher ID format" });
        }
        const teacherExists = await Teacher.findById(teacher);
        if (!teacherExists) {
          return res
            .status(404)
            .json({ message: `Teacher with ID ${teacher} not found.` });
        }
      }
      student.teacher = teacher;
    }
    student.name = name ?? student.name;
    student.grade = grade ?? student.grade;
    student.rollNumber = rollNumber ?? student.rollNumber;
    student.age = age ?? student.age;
    const savedStudent = await student.save();
    const populatedStudent = await Student.findById(savedStudent._id).populate(
      "teacher"
    );
    res.status(200).json(populatedStudent);
  } catch (error) {
    console.error("Update Student Error:", error.message, error.stack);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid student ID format" });
    }
    res.status(500).json({ message: "Server Error while updating student" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await Book.updateMany(
      { assignedStudents: studentId },
      { $pull: { assignedStudents: studentId } }
    );
    await Student.findByIdAndDelete(studentId);
    res
      .status(200)
      .json({
        message: "Student removed successfully and unassigned from books.",
        id: studentId,
      });
  } catch (error) {
    console.error("Delete Student Error:", error.message, error.stack);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid student ID format" });
    }
    res.status(500).json({ message: "Server Error while deleting student" });
  }
};
module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
