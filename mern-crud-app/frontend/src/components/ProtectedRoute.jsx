// File: frontend/src/components/ProtectedRoute.jsx
// Protects routes that require authentication
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show a loading indicator while checking auth status
    // You can replace this with a more sophisticated spinner/loader component
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If authenticated, render the child routes (Outlet)
  // Otherwise, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  // 'replace' prevents the login route from being added to the history stack
};

export default ProtectedRoute;
