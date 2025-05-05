// File: frontend/src/components/Navbar.jsx
// Navigation bar component
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftOnRectangleIcon, UserCircleIcon, BookOpenIcon, AcademicCapIcon, UsersIcon } from '@heroicons/react/24/outline'; // Using outline icons

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-bold tracking-tight">
              MERN App
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated && (
                <>
                  <NavLink to="/books">
                    <BookOpenIcon className="h-5 w-5 mr-1 inline-block" /> Books
                  </NavLink>
                  <NavLink to="/teachers">
                    <AcademicCapIcon className="h-5 w-5 mr-1 inline-block" /> Teachers
                  </NavLink>
                  <NavLink to="/students">
                    <UsersIcon className="h-5 w-5 mr-1 inline-block" /> Students
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Right side: Auth links or User info/Logout */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-300 mr-4 flex items-center">
                     <UserCircleIcon className="h-6 w-6 mr-1 text-indigo-300"/>
                     Hi, {user?.username || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out"
                  >
                     <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-x-4">
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/signup">Sign Up</NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button (implement if needed) */}
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            {/* ... (Implementation for mobile menu toggle) ... */}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper component for NavLinks to reduce repetition
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-300 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center"
  >
    {children}
  </Link>
);

export default Navbar;
