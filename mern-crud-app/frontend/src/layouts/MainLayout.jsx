// File: frontend/src/layouts/MainLayout.jsx
// Main layout including Navbar and Footer (optional)
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Outlet renders the matched child route component */}
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        © {new Date().getFullYear()} MERN CRUD App. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
