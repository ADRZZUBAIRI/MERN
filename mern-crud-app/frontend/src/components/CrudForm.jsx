// File: frontend/src/components/CrudForm.jsx
// Reusable form component for Create/Update operations
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const CrudForm = ({ initialData = {}, fields, onSubmit, onCancel, loading, submitButtonText = "Submit", cancelButtonText = "Cancel" }) => {
  const [formData, setFormData] = useState({});

  // Initialize form data when initialData changes (for editing)
  useEffect(() => {
    const initialFormData = fields.reduce((acc, field) => {
      acc[field.name] = initialData[field.name] || '';
      return acc;
    }, {});
    setFormData(initialFormData);
  }, [initialData, fields]); // Rerun when initialData or field definitions change

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass current form data to the parent submit handler
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type || 'text'}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            // Add min/max for number types if needed
            min={field.type === 'number' ? field.min : undefined}
            max={field.type === 'number' ? field.max : undefined}
          />
        </div>
      ))}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {cancelButtonText}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="h-5 w-5" /> : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default CrudForm;
