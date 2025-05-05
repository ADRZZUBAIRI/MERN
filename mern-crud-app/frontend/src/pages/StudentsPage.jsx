// File: frontend/src/pages/StudentsPage.jsx
// Page for managing Students CRUD (Adapt structure from BooksPage)
import React, { useState } from 'react';
import useCrud from '../hooks/useCrud';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import Modal from '../components/Modal';
import AlertMessage from '../components/AlertMessage';
import { PlusIcon } from '@heroicons/react/24/solid';

const StudentsPage = () => {
  const { items: students, loading, error, createItem, updateItem, deleteItem, setError } = useCrud('students');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const studentFields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'grade', label: 'Grade', required: true }, // e.g., '10th', 'A'
    { name: 'rollNumber', label: 'Roll Number', required: true },
    { name: 'age', label: 'Age', type: 'number', min: 3, max: 100 }, // Optional age
  ];

  const studentColumns = [
    { key: 'name', header: 'Name' },
    { key: 'grade', header: 'Grade' },
    { key: 'rollNumber', header: 'Roll Number' },
    { key: 'age', header: 'Age' },
  ];

   const handleOpenModal = (student = null) => {
    setCurrentStudent(student);
    setFormError('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStudent(null);
    setFormLoading(false);
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMessage('');
    let result;

    // Clean up formData: convert age to number if present
    const processedData = { ...formData };
    if (processedData.age) {
        processedData.age = Number(processedData.age);
    } else {
        // If optional and empty, remove or set default
        delete processedData.age;
    }

    if (currentStudent) {
      result = await updateItem(currentStudent._id, processedData);
    } else {
      result = await createItem(processedData);
    }

    setFormLoading(false);
    if (result.success) {
      setSuccessMessage(`Student ${currentStudent ? 'updated' : 'added'} successfully!`);
      handleCloseModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setFormError(result.message || `Failed to ${currentStudent ? 'update' : 'add'} student.`);
    }
  };

   const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
        setFormLoading(true);
        setFormError('');
        setSuccessMessage('');
        const result = await deleteItem(id);
        setFormLoading(false);
         if (result.success) {
            setSuccessMessage('Student deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
             setError(result.message || 'Failed to delete student.');
             setTimeout(() => setError(null), 3000);
        }
    }
  };

  return (
     <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Students</h1>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" // Purple button
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

       {error && <AlertMessage message={error} type="error" onClose={() => setError(null)} />}
       {successMessage && <AlertMessage message={successMessage} type="success" onClose={() => setSuccessMessage('')} />}


      <CrudTable
        items={students}
        columns={studentColumns}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading}
        resourceName="Student"
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentStudent ? 'Edit Student' : 'Add New Student'}>
          {formError && <AlertMessage message={formError} type="error" onClose={() => setFormError('')} />}
          <CrudForm
            initialData={currentStudent || {}}
            fields={studentFields}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            loading={formLoading}
            submitButtonText={currentStudent ? 'Update Student' : 'Add Student'}
          />
      </Modal>
    </div>
  );
};

export default StudentsPage;
