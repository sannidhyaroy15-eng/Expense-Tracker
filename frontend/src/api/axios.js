import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/update', data),
};

// Transaction endpoints
export const transactionAPI = {
  create: (data) => API.post('/transactions', data),
  getAll: (params) => API.get('/transactions', { params }),
  getById: (id) => API.get(`/transactions/${id}`),
  update: (id, data) => API.put(`/transactions/${id}`, data),
  delete: (id) => API.delete(`/transactions/${id}`),
};

// Category endpoints
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// Analytics endpoints
export const analyticsAPI = {
  getSummary: (params) => API.get('/analytics/summary', { params }),
  getExpenseByCategory: (params) => API.get('/analytics/expense-by-category', { params }),
  getMonthlyComparison: (params) => API.get('/analytics/monthly-comparison', { params }),
  getSpendingTrend: (params) => API.get('/analytics/spending-trend', { params }),
};

export default API;
