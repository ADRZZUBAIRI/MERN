// File: frontend/src/pages/BooksPage.jsx
// Page for managing Books CRUD
import React, { useState } from 'react';
import useCrud from '../hooks/useCrud';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import Modal from '../components/Modal';
import AlertMessage from '../components/AlertMessage';
import { PlusIcon } from '@heroicons/react/24/solid';

const BooksPage = () => {
  const { items: books, loading, error, createItem, updateItem, deleteItem, setError } = useCrud('books');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null); // For editing
  const [formLoading, setFormLoading] = useState(false); // Loading state specific to form submission
  const [formError, setFormError] = useState(''); // Error state specific to form submission
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  const bookFields = [
    { name: 'title', label: 'Title', required: true },
    { name: 'author', label: 'Author', required: true },
    { name: 'isbn', label: 'ISBN', required: true },
    { name: 'publishedYear', label: 'Published Year', type: 'number', min: 1000, max: new Date().getFullYear() + 1 },
  ];

  const bookColumns = [
    { key: 'title', header: 'Title' },
    { key: 'author', header: 'Author' },
    { key: 'isbn', header: 'ISBN' },
    { key: 'publishedYear', header: 'Year' },
  ];

  const handleOpenModal = (book = null) => {
    setCurrentBook(book); // Set to null for 'Add', or book object for 'Edit'
    setFormError(''); // Clear previous form errors
    setSuccessMessage(''); // Clear previous success messages
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null); // Reset current book on close
    setFormLoading(false); // Reset form loading state
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMessage('');
    let result;

    // Clean up formData: convert publishedYear to number if present
    const processedData = { ...formData };
    if (processedData.publishedYear) {
        processedData.publishedYear = Number(processedData.publishedYear);
    } else {
        // Handle case where publishedYear might be empty or optional
        delete processedData.publishedYear; // Or set to null if your backend expects it
    }


    if (currentBook) {
      // Update existing book
      result = await updateItem(currentBook._id, processedData);
    } else {
      // Create new book
      result = await createItem(processedData);
    }

    setFormLoading(false);
    if (result.success) {
      setSuccessMessage(`Book ${currentBook ? 'updated' : 'added'} successfully!`);
      handleCloseModal();
       // Optionally clear success message after a delay
       setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setFormError(result.message || `Failed to ${currentBook ? 'update' : 'add'} book.`);
    }
  };

   const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
        setFormLoading(true); // Use formLoading to indicate an action is in progress
        setFormError('');
        setSuccessMessage('');
        const result = await deleteItem(id);
        setFormLoading(false);
         if (result.success) {
            setSuccessMessage('Book deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
             // Display delete error using the main error state from useCrud
             setError(result.message || 'Failed to delete book.');
             setTimeout(() => setError(null), 3000); // Clear error after delay
        }
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Books</h1>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Book
        </button>
      </div>

      {/* Display general loading/error from useCrud hook */}
      {error && <AlertMessage message={error} type="error" onClose={() => setError(null)} />}
      {/* Display success messages */}
      {successMessage && <AlertMessage message={successMessage} type="success" onClose={() => setSuccessMessage('')} />}


      <CrudTable
        items={books}
        columns={bookColumns}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading} // Pass the main loading state
        resourceName="Book"
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentBook ? 'Edit Book' : 'Add New Book'}>
         {/* Display form-specific error */}
         {formError && <AlertMessage message={formError} type="error" onClose={() => setFormError('')} />}
         <CrudForm
            initialData={currentBook || {}} // Pass current book data or empty object
            fields={bookFields}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            loading={formLoading} // Pass form-specific loading state
            submitButtonText={currentBook ? 'Update Book' : 'Add Book'}
         />
      </Modal>
    </div>
  );
};

export default BooksPage;
