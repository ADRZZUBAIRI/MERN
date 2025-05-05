// File: frontend/src/pages/HomePage.jsx
// Simple Home/Dashboard page after login
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpenIcon, AcademicCapIcon, UsersIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome, {user?.username || 'User'}!</h1>
      <p className="text-gray-600 mb-6">
        This is your dashboard. You can manage books, teachers, and students from here.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Books Card */}
        <Link to="/books" className="block p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <BookOpenIcon className="h-10 w-10 mb-3 opacity-80" />
          <h2 className="text-xl font-semibold mb-2">Manage Books</h2>
          <p className="text-blue-100">View, add, edit, or delete book records.</p>
        </Link>

        {/* Teachers Card */}
        <Link to="/teachers" className="block p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <AcademicCapIcon className="h-10 w-10 mb-3 opacity-80" />
          <h2 className="text-xl font-semibold mb-2">Manage Teachers</h2>
          <p className="text-green-100">View, add, edit, or delete teacher records.</p>
        </Link>

        {/* Students Card */}
        <Link to="/students" className="block p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <UsersIcon className="h-10 w-10 mb-3 opacity-80" />
          <h2 className="text-xl font-semibold mb-2">Manage Students</h2>
          <p className="text-purple-100">View, add, edit, or delete student records.</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
