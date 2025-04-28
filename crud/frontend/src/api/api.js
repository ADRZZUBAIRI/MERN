// src/api/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Student API Calls
export const getStudents = () => api.get('/students');
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (studentData) => api.post('/students', studentData);
export const updateStudent = (id, studentData) => api.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Teacher API Calls
export const getTeachers = () => api.get('/teachers');
export const getTeacher = (id) => api.get(`/teachers/${id}`);
export const createTeacher = (teacherData) => api.post('/teachers', teacherData);
export const updateTeacher = (id, teacherData) => api.put(`/teachers/${id}`, teacherData);
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`);