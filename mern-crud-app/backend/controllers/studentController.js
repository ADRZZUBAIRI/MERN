// File: backend/controllers/studentController.js
const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error('Get Students Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
     console.error('Get Student By ID Error:', error.message);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid student ID format' });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  const { name, grade, rollNumber, age } = req.body;

  if (!name || !grade || !rollNumber) {
    return res.status(400).json({ message: 'Please provide name, grade, and roll number' });
  }

  try {
    // Check if roll number already exists
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: `Student with roll number ${rollNumber} already exists` });
    }

    const newStudent = new Student({
      name,
      grade,
      rollNumber,
      age,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Create Student Error:', error.message);
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

     // Check if the updated roll number conflicts with another existing student
     const { rollNumber } = req.body;
     if (rollNumber && rollNumber !== student.rollNumber) {
        const existingStudent = await Student.findOne({ rollNumber: rollNumber });
        if (existingStudent && existingStudent._id.toString() !== req.params.id) {
            return res.status(400).json({ message: `Another student with roll number ${rollNumber} already exists` });
        }
     }

    const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Update Student Error:', error.message);
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
     }
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid student ID format' });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Student removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete Student Error:', error.message);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid student ID format' });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
