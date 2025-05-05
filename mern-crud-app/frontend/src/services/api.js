// File: frontend/src/services/api.js
// Centralized Axios instance for API calls
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for global error handling (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response, // Simply return response if successful
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error("Unauthorized access - 401");
      localStorage.removeItem('token'); // Remove invalid token
      localStorage.removeItem('user'); // Remove user info
      // Optionally redirect to login page, you might need to use window.location or pass router history
       window.location.href = '/login';
    }
    // Return the error promise so calling code can handle it
    return Promise.reject(error);
  }
);


export default api;
