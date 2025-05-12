// File: backend/routes/teachers.js
const express = require('express');
const {
  getTeachers,
  getTeacherById,
  getStudentsForTeacher, // Import new controller
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.use(protect);
router.route('/').get(getTeachers).post(createTeacher);
router.route('/:id').get(getTeacherById).put(updateTeacher).delete(deleteTeacher);
router.route('/:id/students').get(getStudentsForTeacher); // New route
module.exports = router;
