import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rp_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin9591') && path !== '/admin9591') {
        localStorage.removeItem('rp_token');
        window.location.href = '/admin9591';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  setup: (data) => api.post('/auth/setup', data),
};

// Products
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (slug) => api.get(`/products/${slug}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Articles
export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getAllAdmin: () => api.get('/articles/admin/all'),
  getOne: (slug) => api.get(`/articles/${slug}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

// Research
export const researchAPI = {
  getAll: (params) => api.get('/research', { params }),
  getOne: (slug) => api.get(`/research/${slug}`),
  trackDownload: (id) => api.post(`/research/${id}/download`),
  create: (data) => api.post('/research', data),
  update: (id, data) => api.put(`/research/${id}`, data),
  delete: (id) => api.delete(`/research/${id}`),
};

// AI Projects
export const aiProjectsAPI = {
  getAll: (params) => api.get('/ai-projects', { params }),
  getOne: (slug) => api.get(`/ai-projects/${slug}`),
  create: (data) => api.post('/ai-projects', data),
  update: (id, data) => api.put(`/ai-projects/${id}`, data),
  delete: (id) => api.delete(`/ai-projects/${id}`),
};

// Contacts
export const contactsAPI = {
  send: (data) => api.post('/contacts', data),
  getAll: (params) => api.get('/contacts', { params }),
  updateStatus: (id, status) => api.patch(`/contacts/${id}/status`, { status }),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// Categories
export const categoriesAPI = {
  getAll: (params) => api.get('/categories', { params }),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Media
export const mediaAPI = {
  getAll: (params) => api.get('/media', { params }),
  upload: (formData) => api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/media/${id}`),
};

// Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};
