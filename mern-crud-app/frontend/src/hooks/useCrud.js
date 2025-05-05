// File: frontend/src/hooks/useCrud.js
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const useCrud = (resourcePath) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const buildUrl = (id = "") => `/${resourcePath}${id ? `/${id}` : ""}`;
  const getId = (item) => item._id || item.id;

  // Fetch all items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(buildUrl());
      setItems(response.data || []);
    } catch (err) {
      console.error(`Error fetching ${resourcePath}:`, err);
      setError(
        err.response?.data?.message || `Failed to fetch ${resourcePath}`
      );
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  }, [resourcePath, logout]);

  // Fetch single item by ID
  const getItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(buildUrl(id));
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Error fetching single ${resourcePath}:`, err);
      const errorMessage =
        err.response?.data?.message || `Failed to fetch item`;
      setError(errorMessage);
      setLoading(false);
      if (err.response?.status === 401) logout();
      return { success: false, message: errorMessage };
    }
  };

  // Create an item
  const createItem = async (newItemData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(buildUrl(), newItemData);
      setItems((prevItems) => [...prevItems, response.data]);
      setLoading(false);
      return { success: true, data: response.data };
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
      setItems((prevItems) =>
        prevItems.map((item) => (getId(item) === id ? response.data : item))
      );
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
      setItems((prevItems) => prevItems.filter((item) => getId(item) !== id));
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

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    setError,
    setItems,
  };
};

export default useCrud;
