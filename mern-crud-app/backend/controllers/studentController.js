// File: backend/controllers/studentController.js
const Student = require("../models/Student");
const Teacher = require("../models/Teacher"); // Needed for validation
const Book = require("../models/Book"); // Needed for updating books on student deletion
const mongoose = require("mongoose"); // For ObjectId validation

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    // Example: GET /api/students?teacherId=teacherId
    const { teacherId } = req.query;
    let query = {};
    if (teacherId) {
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res
          .status(400)
          .json({ message: "Invalid teacher ID format for query" });
      }
      query.teacher = teacherId; // Find students for a specific teacher
    }

    const students = await Student.find(query).populate(
      "teacher",
      "name subject"
    ); // Populate teacher info
    // We will fetch assignedBooks separately on the frontend if needed via /api/books?assignedToStudent=studentId
    res.status(200).json(students);
  } catch (error) {
    console.error("Get Students Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "teacher",
      "name subject"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error("Get Student By ID Error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid student ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  const { name, grade, rollNumber, age, teacher } = req.body; // 'teacher' is teacherId

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

    // Validate teacher if provided
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
    // Populate before sending response
    const populatedStudent = await Student.findById(savedStudent._id).populate(
      "teacher",
      "name subject"
    );
    res.status(201).json(populatedStudent);
  } catch (error) {
    console.error("Create Student Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
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

    // Validate teacher if provided and changed
    if (teacher !== undefined) {
      // teacher can be null to unassign
      if (teacher !== null) {
        // if not null, it must be a valid ID
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
      student.teacher = teacher; // Assign null or the new teacher ID
    }

    student.name = name ?? student.name;
    student.grade = grade ?? student.grade;
    student.rollNumber = rollNumber ?? student.rollNumber;
    student.age = age ?? student.age;

    const savedStudent = await student.save();
    const populatedStudent = await Student.findById(savedStudent._id).populate(
      "teacher",
      "name subject"
    );
    res.status(200).json(populatedStudent);
  } catch (error) {
    console.error("Update Student Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid student ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove this student from any book's assignedStudents list
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
    console.error("Delete Student Error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid student ID format" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
