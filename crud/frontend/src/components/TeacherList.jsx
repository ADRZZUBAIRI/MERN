// src/components/TeacherList.jsx
import React, { useState, useEffect } from "react";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../api/api";
import TeacherForm from "./TeacherForm";

const TeacherList = ({ showNotification }) => {
  const [teachers, setTeachers] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await getTeachers();
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      showNotification("error", "Failed to fetch teachers.");
    }
  };

  const handleCreate = () => {
    setEditingTeacher(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTeacher(null);
  };

  const handleTeacherAdded = async (teacherData) => {
    try {
      await createTeacher(teacherData);
      fetchTeachers();
      showNotification("success", "Teacher added successfully!");
      handleCloseForm();
    } catch (error) {
      console.error("Error adding teacher:", error);
      showNotification("error", "Failed to add teacher.");
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleTeacherUpdated = async (id, teacherData) => {
    try {
      await updateTeacher(id, teacherData);
      fetchTeachers();
      showNotification("success", "Teacher updated successfully!");
      handleCloseForm();
    } catch (error) {
      console.error("Error updating teacher:", error);
      showNotification("error", "Failed to update teacher.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher(id);
        fetchTeachers();
        showNotification("success", "Teacher deleted successfully!");
      } catch (error) {
        console.error("Error deleting teacher:", error);
        showNotification("error", "Failed to delete teacher.");
      }
    }
  };

  return (
    <div>
      <h2>Teachers</h2>
      <div className="button-group">
        <button onClick={handleCreate}>Add New Teacher</button>
      </div>

      {showForm && (
        <TeacherForm
          onTeacherAdded={handleTeacherAdded}
          onTeacherUpdated={handleTeacherUpdated}
          onClose={handleCloseForm}
          editingTeacher={editingTeacher}
        />
      )}

      {teachers.length > 0 ? (
        <ul>
          {teachers.map((teacher) => (
            <li key={teacher._id}>
              <span>
                {teacher.name} ({teacher.subject}, {teacher.experience} years)
              </span>
              <div className="actions">
                <button onClick={() => handleEdit(teacher)}>Edit</button>
                <button onClick={() => handleDelete(teacher._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data">No teachers found.</p>
      )}
    </div>
  );
};

export default TeacherList;
