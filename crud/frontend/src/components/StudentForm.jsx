// src/components/StudentForm.jsx
import React, { useState, useEffect } from "react";

const StudentForm = ({
  onStudentAdded,
  onStudentUpdated,
  onClose,
  editingStudent,
}) => {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [major, setMajor] = useState("");

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setGrade(editingStudent.grade);
      setMajor(editingStudent.major);
    } else {
      setName("");
      setGrade("");
      setMajor("");
    }
  }, [editingStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentData = { name, grade, major };

    if (editingStudent) {
      onStudentUpdated(editingStudent._id, studentData);
    } else {
      onStudentAdded(studentData);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h3>{editingStudent ? "Edit Student" : "Add New Student"}</h3>
        <button type="button" onClick={onClose} className="close-button">
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="grade">Grade:</label>
            <input
              type="text"
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="major">Major:</label>
            <input
              type="text"
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="submit">
              {editingStudent ? "Update Student" : "Add Student"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
