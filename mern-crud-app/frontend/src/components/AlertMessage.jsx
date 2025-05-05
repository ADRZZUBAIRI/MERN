// File: frontend/src/components/AlertMessage.jsx
// Component to display success or error messages
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

const AlertMessage = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-100' : 'bg-green-100';
  const borderColor = isError ? 'border-red-400' : 'border-green-400';
  const textColor = isError ? 'text-red-700' : 'text-green-700';
  const Icon = isError ? XCircleIcon : CheckCircleIcon;

  return (
    <div className={`border-l-4 ${borderColor} ${bgColor} p-4 mb-4 rounded-md shadow-sm`} role="alert">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${textColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md ${bgColor} p-1.5 ${textColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isError ? 'focus:ring-red-500 focus:ring-offset-red-100' : 'focus:ring-green-500 focus:ring-offset-green-100'}`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;
