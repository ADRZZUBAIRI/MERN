// File: frontend/src/components/LoadingSpinner.jsx
// Simple loading spinner
import React from 'react';

const LoadingSpinner = ({ size = 'h-8 w-8' }) => {
  return (
    <div className={`animate-spin rounded-full ${size} border-t-2 border-b-2 border-blue-500`}></div>
  );
};

export default LoadingSpinner;
