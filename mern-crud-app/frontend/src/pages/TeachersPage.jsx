// File: frontend/src/pages/TeachersPage.jsx
// Page for managing Teachers CRUD (Adapt structure from BooksPage)
import React, { useState } from 'react';
import useCrud from '../hooks/useCrud';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import Modal from '../components/Modal';
import AlertMessage from '../components/AlertMessage';
import { PlusIcon } from '@heroicons/react/24/solid';

const TeachersPage = () => {
  const { items: teachers, loading, error, createItem, updateItem, deleteItem, setError } = useCrud('teachers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const teacherFields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'subject', label: 'Subject', required: true },
    { name: 'experienceYears', label: 'Experience (Years)', type: 'number', min: 0 },
    { name: 'email', label: 'Email', type: 'email' }, // Optional email
  ];

  const teacherColumns = [
    { key: 'name', header: 'Name' },
    { key: 'subject', header: 'Subject' },
    { key: 'experienceYears', header: 'Experience (Yrs)' },
    { key: 'email', header: 'Email' },
  ];

  const handleOpenModal = (teacher = null) => {
    setCurrentTeacher(teacher);
    setFormError('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTeacher(null);
    setFormLoading(false);
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMessage('');
    let result;

     // Clean up formData: convert experienceYears to number if present
    const processedData = { ...formData };
    if (processedData.experienceYears) {
        processedData.experienceYears = Number(processedData.experienceYears);
    } else {
        // If optional and empty, remove or set default based on backend
        delete processedData.experienceYears;
    }
     // Remove email if empty, as it's optional
    if (!processedData.email) {
        delete processedData.email;
    }


    if (currentTeacher) {
      result = await updateItem(currentTeacher._id, processedData);
    } else {
      result = await createItem(processedData);
    }

    setFormLoading(false);
    if (result.success) {
      setSuccessMessage(`Teacher ${currentTeacher ? 'updated' : 'added'} successfully!`);
      handleCloseModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setFormError(result.message || `Failed to ${currentTeacher ? 'update' : 'add'} teacher.`);
    }
  };

   const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
        setFormLoading(true);
        setFormError('');
        setSuccessMessage('');
        const result = await deleteItem(id);
        setFormLoading(false);
         if (result.success) {
            setSuccessMessage('Teacher deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
             setError(result.message || 'Failed to delete teacher.');
             setTimeout(() => setError(null), 3000);
        }
    }
  };


  return (
     <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Teachers</h1>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" // Green button
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Teacher
        </button>
      </div>

      {error && <AlertMessage message={error} type="error" onClose={() => setError(null)} />}
      {successMessage && <AlertMessage message={successMessage} type="success" onClose={() => setSuccessMessage('')} />}

      <CrudTable
        items={teachers}
        columns={teacherColumns}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading}
        resourceName="Teacher"
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentTeacher ? 'Edit Teacher' : 'Add New Teacher'}>
         {formError && <AlertMessage message={formError} type="error" onClose={() => setFormError('')} />}
         <CrudForm
            initialData={currentTeacher || {}}
            fields={teacherFields}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            loading={formLoading}
            submitButtonText={currentTeacher ? 'Update Teacher' : 'Add Teacher'}
         />
      </Modal>
    </div>
  );
};

export default TeachersPage;
