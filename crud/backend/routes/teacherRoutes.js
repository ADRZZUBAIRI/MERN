// routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacher");

// GET all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single teacher by ID
router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST a new teacher
router.post("/", async (req, res) => {
  const teacher = new Teacher({
    name: req.body.name,
    subject: req.body.subject,
    experience: req.body.experience,
  });

  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a teacher by ID
router.put("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// DELETE a teacher by ID
router.delete("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
