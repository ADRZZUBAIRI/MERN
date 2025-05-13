// File: frontend/src/components/CrudForm.jsx
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

// Reusable form component for Create/Update operations
const CrudForm = ({
  initialData = {}, // Data for editing, or empty for creating
  fields, // Array defining form fields { name, label, type, required, optionsSource?, optionLabelKey?, placeholder?, min?, max? }
  onSubmit, // Function to call when form is submitted
  onCancel, // Function to call when cancel button is clicked
  loading, // Boolean indicating if form submission is in progress
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
}) => {
  const [formData, setFormData] = useState({});

  // Initialize form data based on fields and initialData when they change
  useEffect(() => {
    const newFormData = {};
    fields.forEach((field) => {
      // Handle multiselect initialization (expects array of IDs)
      if (field.type === "multiselect") {
        const initialValue = initialData[field.name];
        // Ensure value is an array of IDs, extracting from objects if necessary
        if (Array.isArray(initialValue)) {
          newFormData[field.name] = initialValue
            .map((item) =>
              typeof item === "object" && item !== null ? item._id : item
            )
            .filter((id) => id != null);
        } else {
          newFormData[field.name] = []; // Default to empty array
        }
      }
      // Handle single select initialization (expects single ID or empty string)
      else if (field.type === "select") {
        const initialValue = initialData[field.name];
        // Extract ID if it's an object, otherwise use the value directly (or empty string)
        newFormData[field.name] = initialValue
          ? typeof initialValue === "object"
            ? initialValue._id
            : initialValue
          : "";
      }
      // Handle other field types
      else {
        newFormData[field.name] = initialData[field.name] || "";
      }
    });
    setFormData(newFormData);
  }, [initialData, fields]); // Rerun effect if initialData or fields definition changes

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target; // 'options' for multiselect

    // Handle checkbox changes
    if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    }
    // Handle HTML multi-select changes
    else if (type === "select-multiple") {
      const selectedValues = Array.from(options)
        .filter((option) => option.selected) // Get selected options
        .map((option) => option.value); // Extract their values (IDs)
      setFormData((prevData) => ({ ...prevData, [name]: selectedValues }));
    }
    // Handle other input types (text, number, select-one, etc.)
    else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data for submission, cleaning up types if necessary
    const dataToSubmit = { ...formData };
    fields.forEach((field) => {
      // Ensure number fields are numbers, handle empty strings for optional numbers
      if (field.type === "number") {
        if (
          dataToSubmit[field.name] !== "" &&
          dataToSubmit[field.name] != null
        ) {
          dataToSubmit[field.name] = Number(dataToSubmit[field.name]);
        } else if (!field.required) {
          // Remove optional empty number field or set to null based on backend needs
          delete dataToSubmit[field.name]; // Or dataToSubmit[field.name] = null;
        }
      }
      // For single select, send null if empty string and field is optional/allows null
      if (field.type === "select" && dataToSubmit[field.name] === "") {
        if (!field.required) {
          dataToSubmit[field.name] = null; // Send null for empty optional select
        }
      }
      // Multiselect data is already an array of IDs
    });
    onSubmit(dataToSubmit); // Pass cleaned data to parent onSubmit handler
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          {/* Field Label */}
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>

          {/* Render Select Dropdown */}
          {field.type === "select" && field.optionsSource ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""} // Controlled component
              onChange={handleChange}
              required={field.required}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {/* Default/Placeholder Option */}
              <option value="">
                {field.placeholder || `Select ${field.label}`}
              </option>
              {/* Options from optionsSource */}
              {field.optionsSource.map((option) => (
                <option key={option._id} value={option._id}>
                  {/* Display label using optionLabelKey or default to 'name' */}
                  {option[field.optionLabelKey || "name"]}
                </option>
              ))}
            </select>
          ) : /* Render Multi-Select Dropdown */
          field.type === "multiselect" && field.optionsSource ? (
            <select
              multiple // Enable multiple selection
              id={field.name}
              name={field.name}
              value={formData[field.name] || []} // Controlled component, value is array of IDs
              onChange={handleChange}
              required={field.required}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-32" // Increased height
            >
              {/* Options from optionsSource */}
              {field.optionsSource.map((option) => (
                <option key={option._id} value={option._id}>
                  {option[field.optionLabelKey || "name"]}
                </option>
              ))}
            </select>
          ) : (
            /* Render Standard Input Field */
            <input
              type={field.type || "text"}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""} // Controlled component
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder || ""}
              min={field.type === "number" ? field.min : undefined}
              max={field.type === "number" ? field.max : undefined}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          )}
        </div>
      ))}
      {/* Form Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {cancelButtonText}
        </button>
        {/* Submit Button */}
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
