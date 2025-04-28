// src/components/TeacherForm.jsx
import React, { useState, useEffect } from "react";

const TeacherForm = ({
  onTeacherAdded,
  onTeacherUpdated,
  onClose,
  editingTeacher,
}) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    if (editingTeacher) {
      setName(editingTeacher.name);
      setSubject(editingTeacher.subject);
      setExperience(
        editingTeacher.experience ? editingTeacher.experience.toString() : ""
      );
    } else {
      setName("");
      setSubject("");
      setExperience("");
    }
  }, [editingTeacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const teacherData = { name, subject, experience: parseInt(experience, 10) };

    if (editingTeacher) {
      onTeacherUpdated(editingTeacher._id, teacherData);
    } else {
      onTeacherAdded(teacherData);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h3>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</h3>
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
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="experience">Experience:</label>
            <input
              type="number"
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="submit">
              {editingTeacher ? "Update Teacher" : "Add Teacher"}
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

export default TeacherForm;
