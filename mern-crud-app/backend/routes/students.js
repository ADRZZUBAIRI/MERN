// File: backend/routes/students.js
const express = require("express");
const studentCtrl = require("../controllers/studentController"); // Use a different alias
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.use(protect);
router.route("/").get(studentCtrl.getStudents).post(studentCtrl.createStudent);
router
  .route("/:id")
  .get(studentCtrl.getStudentById)
  .put(studentCtrl.updateStudent)
  .delete(studentCtrl.deleteStudent);
module.exports = router;
