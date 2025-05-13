// File: backend/routes/teachers.js
const express = require("express");
const teacherCtrl = require("../controllers/teacherController"); // Use a different alias
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.use(protect);
router.route("/").get(teacherCtrl.getTeachers).post(teacherCtrl.createTeacher);
router
  .route("/:id")
  .get(teacherCtrl.getTeacherById)
  .put(teacherCtrl.updateTeacher)
  .delete(teacherCtrl.deleteTeacher);
router.route("/:id/students").get(teacherCtrl.getStudentsForTeacher);
module.exports = router;
