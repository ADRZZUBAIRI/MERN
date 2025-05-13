import axios from "axios";
// Base URL for the backend API (already includes /api)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - 401");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Consider a more robust way to trigger logout/redirect globally
      // Avoid redirect loop if already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
export default api;
