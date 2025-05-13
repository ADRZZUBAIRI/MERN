// File: frontend/src/pages/StudentsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import useCrud from "../hooks/useCrud";
import api from "../services/api"; // For fetching teachers list & assigned books
import CrudTable from "../components/CrudTable";
import CrudForm from "../components/CrudForm";
import Modal from "../components/Modal";
import AlertMessage from "../components/AlertMessage";
import { PlusIcon, EyeIcon } from "@heroicons/react/24/solid"; // Eye icon for viewing books
import LoadingSpinner from "../components/LoadingSpinner";

const StudentsPage = () => {
  // Use CRUD hook for students
  const {
    items: students,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setError,
  } = useCrud("students");
  // State for modals and forms
  const [isModalOpen, setIsModalOpen] = useState(false); // For Add/Edit Student
  const [isBooksModalOpen, setIsBooksModalOpen] = useState(false); // For Viewing Assigned Books
  const [currentStudent, setCurrentStudent] = useState(null); // Student being edited/viewed
  const [assignedBooksList, setAssignedBooksList] = useState([]); // Books list for the modal
  const [booksLoading, setBooksLoading] = useState(false); // Loading state for fetching books
  const [formLoading, setFormLoading] = useState(false); // Loading state for Add/Edit form submission
  const [formError, setFormError] = useState(""); // Error message for forms/modals
  const [successMessage, setSuccessMessage] = useState(""); // Success message after CUD operations
  const [teachersList, setTeachersList] = useState([]); // List of teachers for assignment dropdown

  // Fetch students when the component mounts
  const memoizedFetchItems = useCallback(() => {
    fetchItems();
  }, [fetchItems]);
  useEffect(() => {
    memoizedFetchItems();
  }, [memoizedFetchItems]);

  // Fetch teachers for the assignment dropdown only when the Add/Edit modal is open
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/teachers"); // Fetch all teachers - CORRECTED PATH
        setTeachersList(response.data || []);
      } catch (err) {
        console.error("Failed to fetch teachers for dropdown:", err);
        setFormError("Could not load teachers list."); // Show error in modal
      }
    };
    if (isModalOpen) {
      // Fetch only if the modal is open
      fetchTeachers();
    }
  }, [isModalOpen]); // Dependency: run effect when modal visibility changes

  // Define fields for the Student form, including teacher assignment
  const studentFields = [
    { name: "name", label: "Name", required: true },
    { name: "grade", label: "Grade", required: true }, // e.g., '10th', 'A'
    { name: "rollNumber", label: "Roll Number", required: true },
    {
      name: "age",
      label: "Age",
      type: "number",
      min: 3,
      max: 100,
      required: false,
    }, // Optional age
    {
      name: "teacher", // Field name matching the model (stores teacher's _id)
      label: "Assign Teacher",
      type: "select", // Use single select type
      optionsSource: teachersList, // Provide the fetched teachers list
      optionLabelKey: "name", // Display teacher's name in the options
      placeholder: "Select a teacher (optional)",
      required: false, // Teacher assignment is optional
    },
  ];

  // Define columns for the Student table, including populated teacher and action button
  const studentColumns = [
    { key: "name", header: "Name" },
    { key: "grade", header: "Grade" },
    { key: "rollNumber", header: "Roll No." },
    { key: "age", header: "Age" },
    { key: "teacher.name", header: "Teacher" }, // Display name from populated teacher object
    {
      key: "actions", // Custom column key
      header: "Assigned Books", // Header for the column
      // Custom renderer for the "View Assigned Books" button
      render: (student) => (
        <button
          onClick={() => handleViewAssignedBooks(student)} // Call handler on click
          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
          title={`View books assigned to ${student.name}`} // Tooltip
        >
          <EyeIcon className="h-5 w-5 inline-block" /> {/* Icon */}
          <span className="sr-only">View Assigned Books</span>{" "}
          {/* Accessibility */}
        </button>
      ),
    },
  ];

  // Define columns for the Books table inside the modal
  const bookColumnsForModal = [
    { key: "title", header: "Title" },
    { key: "author", header: "Author" },
    { key: "isbn", header: "ISBN" },
  ];

  // Handler to open the Add/Edit Student modal
  const handleOpenModal = (student = null) => {
    setCurrentStudent(student);
    setFormError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  // Handler to close the Add/Edit Student modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStudent(null);
    setFormLoading(false);
  };

  // Handler to open the "View Assigned Books" modal and fetch data
  const handleViewAssignedBooks = async (student) => {
    setCurrentStudent(student); // Store the student being viewed
    setIsBooksModalOpen(true); // Open the books modal
    setBooksLoading(true); // Set loading state for books list
    setFormError(""); // Clear previous errors in this modal
    try {
      // Fetch books specifically assigned to this student using query parameter
      const response = await api.get(`/books?assignedToStudent=${student._id}`); // CORRECTED PATH
      setAssignedBooksList(response.data || []); // Update state with fetched books
    } catch (err) {
      console.error("Failed to fetch assigned books:", err);
      // Show error message inside the books modal
      setFormError(
        err.response?.data?.message || "Could not load assigned books."
      );
    } finally {
      setBooksLoading(false); // Clear loading state
    }
  };

  // Handler to close the "View Assigned Books" modal
  const handleCloseBooksModal = () => {
    setIsBooksModalOpen(false);
    setCurrentStudent(null); // Clear the current student
    setAssignedBooksList([]); // Clear the books list
    setFormError(""); // Clear error from books modal
  };

  // Handler for Student form submission (Create or Update)
  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setFormError("");
    setSuccessMessage("");
    let result;
    // Prepare data: remove empty optional fields, ensure teacher is ID or null
    const processedData = { ...formData };
    if (processedData.age === "" || processedData.age == null)
      delete processedData.age;
    // CrudForm handles converting empty select ("") to null if needed
    if (processedData.teacher === "") processedData.teacher = null;

    if (currentStudent) {
      // Update existing student
      result = await updateItem(currentStudent._id, processedData);
    } else {
      // Create new student
      result = await createItem(processedData);
    }
    setFormLoading(false);
    if (result.success) {
      setSuccessMessage(
        `Student ${currentStudent ? "updated" : "added"} successfully!`
      );
      handleCloseModal(); // Close the Add/Edit modal
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after delay
    } else {
      setFormError(
        result.message ||
          `Failed to ${currentStudent ? "update" : "add"} student.`
      );
    }
  };

  // Handler for deleting a student
  const handleDelete = async (id) => {
    // Confirmation dialog, explaining consequences
    if (
      window.confirm(
        "Are you sure you want to delete this student? This will also unassign them from any books."
      )
    ) {
      setFormLoading(true);
      setFormError("");
      setSuccessMessage("");
      const result = await deleteItem(id); // Backend handles unassigning from books
      setFormLoading(false);
      if (result.success) {
        setSuccessMessage("Student deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result.message || "Failed to delete student."); // Show error on main page
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header and Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Students</h1>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add Student
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

      {/* Students Table */}
      <CrudTable
        items={students}
        columns={studentColumns}
        onEdit={handleOpenModal} // Edit action opens the student modal
        onDelete={handleDelete}
        loading={loading}
        resourceName="Student"
      />

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentStudent ? "Edit Student" : "Add New Student"}
      >
        {/* Display form-specific error inside the modal */}
        {formError && (
          <AlertMessage
            message={formError}
            type="error"
            onClose={() => setFormError("")}
          />
        )}
        {/* Student Form */}
        <CrudForm
          initialData={currentStudent || {}} // Pass current student data or empty object
          fields={studentFields} // Pass field definitions
          onSubmit={handleSubmit} // Pass submit handler
          onCancel={handleCloseModal} // Pass cancel handler
          loading={formLoading} // Pass form-specific loading state
          submitButtonText={currentStudent ? "Update Student" : "Add Student"}
        />
      </Modal>

      {/* Modal to display assigned books of a selected student */}
      <Modal
        isOpen={isBooksModalOpen}
        onClose={handleCloseBooksModal}
        title={`Books Assigned to ${currentStudent?.name || "Student"}`}
      >
        {/* Show error message if fetching books failed */}
        {formError && (
          <AlertMessage
            message={formError}
            type="error"
            onClose={() => setFormError("")}
          />
        )}
        {/* Show loading spinner while fetching books */}
        {booksLoading ? (
          <div className="flex justify-center p-4">
            <LoadingSpinner />
          </div>
        ) : // Show books table if loaded and not empty
        assignedBooksList.length > 0 ? (
          <CrudTable
            items={assignedBooksList}
            columns={bookColumnsForModal}
            // No edit/delete actions needed within this view-only modal
            onEdit={null}
            onDelete={null}
            loading={false}
            resourceName="Book"
          />
        ) : (
          // Show message if no books are assigned
          <p className="text-gray-600 text-center py-4">
            No books currently assigned to this student.
          </p>
        )}
      </Modal>
    </div>
  );
};
export default StudentsPage;
