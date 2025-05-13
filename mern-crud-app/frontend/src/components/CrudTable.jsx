// File: frontend/src/components/CrudTable.jsx
import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "./LoadingSpinner";

// Helper function to safely access nested properties (e.g., 'teacher.name')
// Returns 'N/A' if path is invalid or value is undefined/null
const getNestedValue = (obj, path) => {
  if (!path || typeof path !== "string")
    return obj !== null && obj !== undefined ? String(obj) : "N/A";
  const properties = path.split(".");
  // Use reduce to traverse the path
  const value = properties.reduce(
    (prev, curr) =>
      prev && prev[curr] !== undefined && prev[curr] !== null
        ? prev[curr]
        : undefined,
    obj
  );
  return value !== undefined ? String(value) : "N/A"; // Return 'N/A' if value is undefined/null
};

// Reusable table component for displaying CRUD items
const CrudTable = ({
  items,
  columns,
  onEdit,
  onDelete,
  loading,
  resourceName,
}) => {
  // Show spinner only on initial load when items are empty
  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }
  // Show message if no items are found after loading
  if (!loading && items.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No {resourceName} found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-gray-100">
          <tr>
            {/* Render column headers */}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {/* Actions column header */}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Render table rows */}
          {items.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              {/* Render cells for each column */}
              {columns.map((col) => (
                <td
                  key={`${item._id}-${col.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                >
                  {/* Use custom render function if provided, otherwise get nested value */}
                  {col.render
                    ? col.render(item)
                    : getNestedValue(item, col.key)}
                </td>
              ))}
              {/* Actions cell (Edit/Delete buttons) */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                {/* Edit Button */}
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                    title={`Edit ${resourceName}`}
                  >
                    <PencilSquareIcon className="h-5 w-5 inline-block" />
                    <span className="sr-only">Edit</span>
                  </button>
                )}
                {/* Delete Button */}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title={`Delete ${resourceName}`}
                  >
                    <TrashIcon className="h-5 w-5 inline-block" />
                    <span className="sr-only">Delete</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CrudTable;
