// File: frontend/src/context/AuthContext.jsx
// Manages authentication state and provides it to the app
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Create the context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // To check initial auth status

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Verify token by fetching user data
          const response = await api.get('/auth/me'); // Uses interceptor for token
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data)); // Store user data
        } catch (error) {
          console.error("Failed to fetch user with stored token", error);
          // Token might be invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false); // Finished initial check
    };

    initializeAuth();
  }, []); // Run only once on mount

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: loggedInUser } = response.data;
      setToken(receivedToken);
      setUser(loggedInUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      // Return error message to display in the form
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

   // Signup function
   const signup = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token: receivedToken, user: newUser } = response.data;
      setToken(receivedToken);
      setUser(newUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // No need to call backend for logout if using JWT stateless auth
    // If using sessions or refresh tokens, you might need an API call here
  };

  // Value provided by the context
  const value = {
    user,
    token,
    isAuthenticated: !!token, // True if token exists
    loading, // Provide loading state for initial auth check
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
