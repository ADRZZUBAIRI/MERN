// File: frontend/src/pages/BooksPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import useCrud from "../hooks/useCrud";
import api from "../services/api"; // For fetching students list
import CrudTable from "../components/CrudTable";
import CrudForm from "../components/CrudForm";
import Modal from "../components/Modal";
import AlertMessage from "../components/AlertMessage";
import { PlusIcon } from "@heroicons/react/24/solid";

const BooksPage = () => {
  // Use CRUD hook for books
  const {
    items: books,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setError,
  } = useCrud("books");
  // State for modals and forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null); // Book being edited/added
  const [formLoading, setFormLoading] = useState(false); // Loading state for form submission
  const [formError, setFormError] = useState(""); // Error message for the form
  const [successMessage, setSuccessMessage] = useState(""); // Success message after CUD operations
  const [studentsList, setStudentsList] = useState([]); // List of students for assignment dropdown

  // Fetch books when the component mounts
  // useCallback ensures fetchItems doesn't change unless its dependencies change
  const memoizedFetchItems = useCallback(() => {
    fetchItems();
  }, [fetchItems]); // fetchItems from useCrud is already memoized

  useEffect(() => {
    memoizedFetchItems();
  }, [memoizedFetchItems]);

  // Fetch students for the assignment dropdown only when the modal is opened
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/students"); // Fetch all students - CORRECTED PATH
        setStudentsList(response.data || []);
      } catch (err) {
        console.error("Failed to fetch students for dropdown:", err);
        setFormError("Could not load students list for assignment."); // Show error in modal
      }
    };
    // Fetch only if the modal is open to optimize API calls
    if (isModalOpen) {
      fetchStudents();
    }
  }, [isModalOpen]); // Dependency: run effect when modal visibility changes

  // Define fields for the Book form, including the relationship field
  const bookFields = [
    { name: "title", label: "Title", required: true },
    { name: "author", label: "Author", required: true },
    { name: "isbn", label: "ISBN", required: true },
    {
      name: "publishedYear",
      label: "Published Year",
      type: "number",
      min: 1000,
      max: new Date().getFullYear() + 5,
      required: false,
    },
    {
      name: "assignedStudents", // Field name matching the model
      label: "Assign to Students",
      type: "multiselect", // Use multiselect type
      optionsSource: studentsList, // Provide the fetched students list
      optionLabelKey: "name", // Display student's name in the options
      placeholder: "Select students (Ctrl/Cmd + Click for multiple)",
      required: false, // Assignment is optional
    },
  ];

  // Define columns for the Book table, including populated fields
  const bookColumns = [
    { key: "title", header: "Title" },
    { key: "author", header: "Author" },
    { key: "isbn", header: "ISBN" },
    { key: "publishedYear", header: "Year" },
    { key: "createdBy.username", header: "Created By" }, // Display username from populated createdBy
    {
      key: "assignedStudents",
      header: "Assigned To",
      // Custom renderer to display names of assigned students
      render: (book) =>
        book.assignedStudents && book.assignedStudents.length > 0
          ? book.assignedStudents.map((s) => s?.name || "Unknown").join(", ") // Safely access name
          : "None",
    },
  ];

  // Handler to open the Add/Edit modal
  const handleOpenModal = (book = null) => {
    setCurrentBook(book); // Set book data for editing, or null for adding
    setFormError(""); // Clear previous form errors
    setSuccessMessage(""); // Clear previous success messages
    setIsModalOpen(true); // Open the modal
  };

  // Handler to close the Add/Edit modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null); // Reset current book
    setFormLoading(false); // Reset form loading state
  };

  // Handler for form submission (Create or Update)
  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setFormError("");
    setSuccessMessage("");
    let result;

    // Prepare data: ensure publishedYear is number or removed if empty, assignedStudents is array of IDs
    const processedData = { ...formData };
    if (
      processedData.publishedYear === "" ||
      processedData.publishedYear == null
    ) {
      delete processedData.publishedYear; // Remove if empty/null and optional
    } else {
      processedData.publishedYear = Number(processedData.publishedYear);
    }
    // CrudForm already ensures assignedStudents is an array of IDs
    processedData.assignedStudents = formData.assignedStudents || [];

    if (currentBook) {
      // Update existing book
      result = await updateItem(currentBook._id, processedData);
    } else {
      // Create new book (createdBy is handled by backend)
      result = await createItem(processedData);
    }

    setFormLoading(false);
    if (result.success) {
      setSuccessMessage(
        `Book ${currentBook ? "updated" : "added"} successfully!`
      );
      handleCloseModal();
      // Clear success message after a delay
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      // Show error message from backend or a generic one
      setFormError(
        result.message || `Failed to ${currentBook ? "update" : "add"} book.`
      );
    }
  };

  // Handler for deleting a book
  const handleDelete = async (id) => {
    // Confirmation dialog
    if (window.confirm("Are you sure you want to delete this book?")) {
      setFormLoading(true); // Use formLoading to indicate an action is in progress
      setFormError("");
      setSuccessMessage("");
      const result = await deleteItem(id);
      setFormLoading(false);
      if (result.success) {
        setSuccessMessage("Book deleted successfully!");
        // Clear message after delay
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        // Display delete error using the main error state from useCrud
        setError(result.message || "Failed to delete book.");
        // Clear error after delay
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header and Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Books</h1>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add Book
        </button>
      </div>

      {/* Display general loading/error from useCrud hook */}
      {error && (
        <AlertMessage
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      {/* Display success messages */}
      {successMessage && (
        <AlertMessage
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Books Table */}
      <CrudTable
        items={books}
        columns={bookColumns}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading} // Pass the main loading state for the table
        resourceName="Book"
      />

      {/* Add/Edit Book Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentBook ? "Edit Book" : "Add New Book"}
      >
        {/* Display form-specific error inside the modal */}
        {formError && (
          <AlertMessage
            message={formError}
            type="error"
            onClose={() => setFormError("")}
          />
        )}
        {/* Book Form */}
        <CrudForm
          // Pass current book data (or empty object with default for multiselect) for editing/adding
          initialData={currentBook || { assignedStudents: [] }}
          fields={bookFields} // Pass field definitions
          onSubmit={handleSubmit} // Pass submit handler
          onCancel={handleCloseModal} // Pass cancel handler
          loading={formLoading} // Pass form-specific loading state
          submitButtonText={currentBook ? "Update Book" : "Add Book"}
        />
      </Modal>
    </div>
  );
};
export default BooksPage;
