// File: frontend/src/components/CrudTable.jsx
// Reusable table component for displaying CRUD items
import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const CrudTable = ({ items, columns, onEdit, onDelete, loading, resourceName }) => {

  if (loading && items.length === 0) { // Show spinner only on initial load
     return <div className="flex justify-center items-center py-10"><LoadingSpinner /></div>;
  }

  if (!loading && items.length === 0) {
      return <p className="text-center text-gray-500 py-10">No {resourceName} found.</p>;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={`${item._id}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {item[col.key] !== undefined && item[col.key] !== null ? String(item[col.key]) : 'N/A'}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button
                  onClick={() => onEdit(item)}
                  className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  title={`Edit ${resourceName}`}
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  <span className="sr-only">Edit</span>
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                   title={`Delete ${resourceName}`}
                >
                  <TrashIcon className="h-5 w-5" />
                   <span className="sr-only">Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrudTable;
