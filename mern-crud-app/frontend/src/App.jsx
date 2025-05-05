// File: frontend/src/App.jsx
// Main application component with routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import TeachersPage from './pages/TeachersPage';
import StudentsPage from './pages/StudentsPage';

// Component to handle redirection for already authenticated users
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Or a spinner
    return isAuthenticated ? <Navigate to="/" replace /> : children;
};


function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Router>
        <Routes>
          {/* Routes accessible only when not logged in */}
           <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
           <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* Routes accessible only when logged in (protected) */}
          <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
             <Route element={<MainLayout />}> {/* Use MainLayout for authenticated routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/students" element={<StudentsPage />} />
                {/* Add other protected routes here */}
             </Route>
          </Route>

          {/* Optional: Catch-all route for 404 Not Found */}
          {/* You might want a dedicated 404 component */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
