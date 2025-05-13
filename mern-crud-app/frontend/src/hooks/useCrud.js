// File: frontend/src/hooks/useCrud.js
import { useState, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Added queryParams argument to fetchItems
const useCrud = (resourcePath) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth(); // Get logout function

  // Helper function to build the API URL with optional ID and query parameters
  const buildUrl = (id = "", queryParams = {}) => {
    // FIX: Construct URL relative to the baseURL in api.js (which already has /api)
    let url = `/${resourcePath}${id ? `/${id}` : ""}`; // Use relative path
    const params = new URLSearchParams(queryParams);
    // Add query parameters to the URL if they exist
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return url;
  };

  // Fetch all items, optionally filtering with queryParams
  const fetchItems = useCallback(
    async (queryParams = {}) => {
      setLoading(true);
      setError(null);
      try {
        // Use the corrected buildUrl function
        const response = await api.get(buildUrl("", queryParams)); // Pass queryParams
        setItems(response.data || []); // Ensure items is always an array
      } catch (err) {
        console.error(`Error fetching ${resourcePath}:`, err);
        const errMsg =
          err.response?.data?.message || `Failed to fetch ${resourcePath}`;
        setError(errMsg);
        // Logout user if request is unauthorized (e.g., token expired)
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    },
    [resourcePath, logout]
  ); // Dependencies for useCallback

  // Create an item
  const createItem = async (newItemData) => {
    // Can also use a separate formLoading state in components for more granular control
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(buildUrl(), newItemData);
      // Fetch items again to get the latest list with populated data.
      // This is simpler than manually merging potentially complex populated data.
      await fetchItems(); // Re-fetch to ensure consistency
      setLoading(false);
      return { success: true, data: response.data }; // Return response data if needed
    } catch (err) {
      console.error(`Error creating ${resourcePath}:`, err);
      const errorMessage =
        err.response?.data?.message || `Failed to create ${resourcePath}`;
      setError(errorMessage);
      setLoading(false);
      if (err.response?.status === 401) logout();
      return { success: false, message: errorMessage };
    }
  };

  // Update an item
  const updateItem = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(buildUrl(id), updatedData);
      // Re-fetch items for consistency after update
      await fetchItems();
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Error updating ${resourcePath}:`, err);
      const errorMessage =
        err.response?.data?.message || `Failed to update ${resourcePath}`;
      setError(errorMessage);
      setLoading(false);
      if (err.response?.status === 401) logout();
      return { success: false, message: errorMessage };
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(buildUrl(id));
      // Re-fetch items after deletion
      await fetchItems();
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error(`Error deleting ${resourcePath}:`, err);
      const errorMessage =
        err.response?.data?.message || `Failed to delete ${resourcePath}`;
      setError(errorMessage);
      setLoading(false);
      if (err.response?.status === 401) logout();
      return { success: false, message: errorMessage };
    }
  };

  // Note: Initial fetch is removed from here. Pages should call fetchItems()
  // in their own useEffect, potentially with query parameters.

  // Return state and CRUD functions
  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setError,
    setItems,
  };
};
export default useCrud;
