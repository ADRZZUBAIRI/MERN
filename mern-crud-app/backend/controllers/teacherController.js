// File: backend/controllers/teacherController.js
const Teacher = require('../models/Teacher');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Get Teachers Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single teacher by ID
// @route   GET /api/teachers/:id
// @access  Private
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (error) {
     console.error('Get Teacher By ID Error:', error.message);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid teacher ID format' });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Private
const createTeacher = async (req, res) => {
  const { name, subject, experienceYears, email } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ message: 'Please provide name and subject' });
  }

  try {
     // Optional: Check if a teacher with the same email already exists if email should be unique
     if (email) {
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: `Teacher with email ${email} already exists` });
        }
     }

    const newTeacher = new Teacher({
      name,
      subject,
      experienceYears,
      email,
    });

    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    console.error('Create Teacher Error:', error.message);
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Private
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

     // Optional: Check for email conflict if email is being updated and should be unique
     const { email } = req.body;
     if (email && email !== teacher.email) {
        const existingTeacher = await Teacher.findOne({ email: email });
        if (existingTeacher && existingTeacher._id.toString() !== req.params.id) {
            return res.status(400).json({ message: `Another teacher with email ${email} already exists` });
        }
     }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true } // Return updated doc, run validators
    );

    res.status(200).json(updatedTeacher);
  } catch (error) {
    console.error('Update Teacher Error:', error.message);
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
     }
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid teacher ID format' });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await Teacher.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Teacher removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete Teacher Error:', error.message);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid teacher ID format' });
     }
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
