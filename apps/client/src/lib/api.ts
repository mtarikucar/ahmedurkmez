import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) =>
    api.post('/auth/register', userData),
  getProfile: () =>
    api.get('/auth/me'),
};

export const articlesAPI = {
  getAll: (params?: any) =>
    api.get('/articles', { params }),
  getBySlug: (slug: string) =>
    api.get(`/articles/slug/${slug}`),
  getFeatured: (limit?: number) =>
    api.get('/articles/featured', { params: { limit } }),
  getRelated: (id: number, limit?: number) =>
    api.get(`/articles/${id}/related`, { params: { limit } }),
  like: (id: number) =>
    api.post(`/articles/${id}/like`),
};

export const categoriesAPI = {
  getAll: () =>
    api.get('/categories'),
  getById: (id: number) =>
    api.get(`/categories/${id}`),
};

export const commentsAPI = {
  getByArticle: (articleId: number) =>
    api.get(`/comments/article/${articleId}`),
  create: (commentData: any) =>
    api.post('/comments', commentData),
  like: (id: number) =>
    api.post(`/comments/${id}/like`),
};

export const contactAPI = {
  create: (contactData: any) =>
    api.post('/contacts', contactData),
};

export default api;
