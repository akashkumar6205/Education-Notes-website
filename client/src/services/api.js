import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('notes_auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Health
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Auth APIs
export const registerUser = async (userData) => {
  // { name, email, password, confirmPassword, adminKey }
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  // { email, password, adminKey }
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Subject APIs
export const getAllSubjects = async () => {
  const response = await api.get('/subjects');
  return response.data;
};

export const getSubjectsBySemester = async (semester) => {
  const response = await api.get(`/subjects/semester/${semester}`);
  return response.data;
};

export const createSubject = async (subjectData) => {
  // { name, code, semester, description }
  const response = await api.post('/subjects', subjectData);
  return response.data;
};

export const updateSubject = async (id, subjectData) => {
  const response = await api.put(`/subjects/${id}`, subjectData);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
};

// Note APIs
export const getNotes = async (params = {}) => {
  // params: { subject, topic, search, page, limit }
  const query = new URLSearchParams();
  if (params.subject) query.append('subject', params.subject);
  if (params.topic) query.append('topic', params.topic);
  if (params.search) query.append('search', params.search);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const queryString = query.toString();
  const url = queryString ? `/notes?${queryString}` : '/notes';
  const response = await api.get(url);
  return response.data; // { notes, pagination: { total, page, pages } }
};

export const getNoteById = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData) => {
  // { title, content, subject, topic, tags }
  const response = await api.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  // { title, content, topic, tags }
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export const archiveNote = async (id) => {
  const response = await api.patch(`/notes/${id}/archive`);
  return response.data;
};

export default api;
