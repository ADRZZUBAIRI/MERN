// File: frontend/src/pages/TeachersPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import useCrud from "../hooks/useCrud";
import api from "../services/api"; // For fetching students of a teacher
import CrudTable from "../components/CrudTable";
import CrudForm from "../components/CrudForm";
import Modal from "../components/Modal";
import AlertMessage from "../components/AlertMessage";
import { PlusIcon, EyeIcon } from "@heroicons/react/24/solid"; // Eye icon for viewing students
import LoadingSpinner from "../components/LoadingSpinner";

const TeachersPage = () => {
  // Use CRUD hook for teachers
  const {
    items: teachers,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setError,
  } = useCrud("teachers");
  // State for modals and forms
  const [isModalOpen, setIsModalOpen] = useState(false); // For Add/Edit Teacher
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false); // For Viewing Students
  const [currentTeacher, setCurrentTeacher] = useState(null); // Teacher being edited/viewed
  const [studentsOfTeacher, setStudentsOfTeacher] = useState([]); // Students list for the modal
  const [studentsLoading, setStudentsLoading] = useState(false); // Loading state for fetching students
  const [formLoading, setFormLoading] = useState(false); // Loading state for Add/Edit form submission
  const [formError, setFormError] = useState(""); // Error message for forms/modals
  const [successMessage, setSuccessMessage] = useState(""); // Success message after CUD operations

  // Fetch teachers when the component mounts
  const memoizedFetchItems = useCallback(() => {
    fetchItems();
  }, [fetchItems]);
  useEffect(() => {
    memoizedFetchItems();
  }, [memoizedFetchItems]);

  // Define fields for the Teacher form
  const teacherFields = [
    { name: "name", label: "Name", required: true },
    { name: "subject", label: "Subject", required: true },
    {
      name: "experienceYears",
      label: "Experience (Years)",
      type: "number",
      min: 0,
      required: false,
    },
    { name: "email", label: "Email", type: "email", required: false }, // Optional email
  ];

  // Define columns for the Teacher table, adding a custom action column
  const teacherColumns = [
    { key: "name", header: "Name" },
    { key: "subject", header: "Subject" },
    { key: "experienceYears", header: "Experience (Yrs)" },
    { key: "email", header: "Email" },
    {
      key: "actions", // Custom column key
      header: "Students", // Header for the column
      // Custom renderer for the "View Students" button
      render: (teacher) => (
        <button
          onClick={() => handleViewStudents(teacher)} // Call handler on click
          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
          title={`View students assigned to ${teacher.name}`} // Tooltip
        >
          <EyeIcon className="h-5 w-5 inline-block" /> {/* Icon */}
          <span className="sr-only">View Students</span> {/* Accessibility */}
        </button>
      ),
    },
  ];

  // Define columns for the Students table inside the modal
  const studentColumnsForModal = [
    { key: "name", header: "Name" },
    { key: "rollNumber", header: "Roll No." },
    { key: "grade", header: "Grade" },
  ];

  // Handler to open the Add/Edit Teacher modal
  const handleOpenModal = (teacher = null) => {
    setCurrentTeacher(teacher);
    setFormError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  // Handler to close the Add/Edit Teacher modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTeacher(null);
    setFormLoading(false);
  };

  // Handler to open the "View Students" modal and fetch data
  const handleViewStudents = async (teacher) => {
    setCurrentTeacher(teacher); // Store the teacher being viewed
    setIsStudentsModalOpen(true); // Open the students modal
    setStudentsLoading(true); // Set loading state for students list
    setFormError(""); // Clear previous errors in this modal
    try {
      // Fetch students specifically assigned to this teacher
      const response = await api.get(`/teachers/${teacher._id}/students`); // CORRECTED PATH
      setStudentsOfTeacher(response.data || []); // Update state with fetched students
    } catch (err) {
      console.error("Failed to fetch students for teacher:", err);
      // Show error message inside the students modal
      setFormError(err.response?.data?.message || "Could not load students.");
    } finally {
      setStudentsLoading(false); // Clear loading state
    }
  };

  // Handler to close the "View Students" modal
  const handleCloseStudentsModal = () => {
    setIsStudentsModalOpen(false);
    setCurrentTeacher(null); // Clear the current teacher
    setStudentsOfTeacher([]); // Clear the students list
    setFormError(""); // Clear error from students modal
  };

  // Handler for Teacher form submission (Create or Update)
  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setFormError("");
    setSuccessMessage("");
    let result;
    // Prepare data: remove empty optional fields if necessary
    const processedData = { ...formData };
    if (
      processedData.experienceYears === "" ||
      processedData.experienceYears == null
    )
      delete processedData.experienceYears;
    if (processedData.email === "" || processedData.email == null)
      delete processedData.email;

    if (currentTeacher) {
      // Update existing teacher
      result = await updateItem(currentTeacher._id, processedData);
    } else {
      // Create new teacher
      result = await createItem(processedData);
    }
    setFormLoading(false);
    if (result.success) {
      setSuccessMessage(
        `Teacher ${currentTeacher ? "updated" : "added"} successfully!`
      );
      handleCloseModal(); // Close the Add/Edit modal
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after delay
    } else {
      setFormError(
        result.message ||
          `Failed to ${currentTeacher ? "update" : "add"} teacher.`
      );
    }
  };

  // Handler for deleting a teacher
  const handleDelete = async (id) => {
    // Confirmation dialog, explaining consequences
    if (
      window.confirm(
        "Are you sure you want to delete this teacher? This will unassign them from all students."
      )
    ) {
      setFormLoading(true);
      setFormError("");
      setSuccessMessage("");
      const result = await deleteItem(id); // Backend handles unassigning students
      setFormLoading(false);
      if (result.success) {
        setSuccessMessage("Teacher deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result.message || "Failed to delete teacher."); // Show error on main page
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header and Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Teachers</h1>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add Teacher
        </button>
      </div>

      {/* Display general errors and success messages */}
      {error && (
        <AlertMessage
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      {successMessage && (
        <AlertMessage
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Teachers Table */}
      <CrudTable
        items={teachers}
        columns={teacherColumns}
        onEdit={handleOpenModal} // Edit action opens the teacher modal
        onDelete={handleDelete}
        loading={loading}
        resourceName="Teacher"
      />

      {/* Add/Edit Teacher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentTeacher ? "Edit Teacher" : "Add New Teacher"}
      >
        {formError && (
          <AlertMessage
            message={formError}
            type="error"
            onClose={() => setFormError("")}
          />
        )}
        <CrudForm
          initialData={currentTeacher || {}}
          fields={teacherFields}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
          submitButtonText={currentTeacher ? "Update Teacher" : "Add Teacher"}
        />
      </Modal>

      {/* Modal to display students of a selected teacher */}
      <Modal
        isOpen={isStudentsModalOpen}
        onClose={handleCloseStudentsModal}
        title={`Students Assigned to ${currentTeacher?.name || "Teacher"}`}
      >
        {/* Show error message if fetching students failed */}
        {formError && (
          <AlertMessage
            message={formError}
            type="error"
            onClose={() => setFormError("")}
          />
        )}
        {/* Show loading spinner while fetching students */}
        {studentsLoading ? (
          <div className="flex justify-center p-4">
            <LoadingSpinner />
          </div>
        ) : // Show students table if loaded and not empty
        studentsOfTeacher.length > 0 ? (
          <CrudTable
            items={studentsOfTeacher}
            columns={studentColumnsForModal}
            // No edit/delete actions needed within this view-only modal
            onEdit={null}
            onDelete={null}
            loading={false}
            resourceName="Student"
          />
        ) : (
          // Show message if no students are assigned
          <p className="text-gray-600 text-center py-4">
            No students assigned to this teacher.
          </p>
        )}
      </Modal>
    </div>
  );
};
export default TeachersPage;
