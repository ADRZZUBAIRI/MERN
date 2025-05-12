const express = require("express");
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.use(protect);
router.route("/").get(getStudents).post(createStudent);
router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);
module.exports = router;
