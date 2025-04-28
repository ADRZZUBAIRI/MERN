// src/components/StudentList.jsx
import React, { useState, useEffect } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/api";
import StudentForm from "./StudentForm";

const StudentList = ({ showNotification }) => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      showNotification("error", "Failed to fetch students.");
    }
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleStudentAdded = async (studentData) => {
    try {
      await createStudent(studentData);
      fetchStudents();
      showNotification("success", "Student added successfully!");
      handleCloseForm();
    } catch (error) {
      console.error("Error adding student:", error);
      showNotification("error", "Failed to add student.");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleStudentUpdated = async (id, studentData) => {
    try {
      await updateStudent(id, studentData);
      fetchStudents();
      showNotification("success", "Student updated successfully!");
      handleCloseForm();
    } catch (error) {
      console.error("Error updating student:", error);
      showNotification("error", "Failed to update student.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        fetchStudents();
        showNotification("success", "Student deleted successfully!");
      } catch (error) {
        console.error("Error deleting student:", error);
        showNotification("error", "Failed to delete student.");
      }
    }
  };

  return (
    <div>
      <h2>Students</h2>
      <div className="button-group">
        <button onClick={handleCreate}>Add New Student</button>
      </div>

      {showForm && (
        <StudentForm
          onStudentAdded={handleStudentAdded}
          onStudentUpdated={handleStudentUpdated}
          onClose={handleCloseForm}
          editingStudent={editingStudent}
        />
      )}

      {students.length > 0 ? (
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              <span>
                {student.name} ({student.grade}, {student.major})
              </span>
              <div className="actions">
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data">No students found.</p>
      )}
    </div>
  );
};

export default StudentList;
