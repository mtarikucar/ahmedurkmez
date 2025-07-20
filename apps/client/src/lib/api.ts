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
  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch('/auth/change-password', { currentPassword, newPassword }),
};

export const articlesAPI = {
  getAll: (params?: any) => api.get('/articles', { params }),
  getById: (id: number) => api.get(`/articles/${id}`),
  getBySlug: (slug: string) => api.get(`/articles/slug/${slug}`),
  getFeatured: (limit?: number) => api.get('/articles/featured', { params: { limit } }),
  getRelated: (id: number, limit?: number) => api.get(`/articles/${id}/related`, { params: { limit } }),
  create: (data: any) => api.post('/articles', data),
  update: (id: number, data: any) => api.patch(`/articles/${id}`, data),
  delete: (id: number) => api.delete(`/articles/${id}`),
  like: (id: number) => api.post(`/articles/${id}/like`),
  uploadPDF: (id: number, formData: FormData) => api.post(`/articles/${id}/upload-pdf`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadImage: (id: number, formData: FormData) => api.post(`/articles/${id}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  embedVideo: (id: number, embedData: { url: string; title?: string }) => 
    api.post(`/articles/${id}/embed-video`, embedData),
};

export const usersAPI = {
  getAll: (params?: any) => api.get('/users', { params }),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRecentActivity: () => api.get('/admin/dashboard/activity'),
  getPopularArticles: (limit?: number) =>
    api.get('/admin/analytics/popular-articles', { params: { limit } }),
  getArticlesByMonth: () => api.get('/admin/analytics/articles-by-month'),
  getCommentsByMonth: () => api.get('/admin/analytics/comments-by-month'),
};

export const mediaAPI = {
  getAll: (params?: any) => api.get('/upload', { params }),
  uploadFile: (formData: FormData) => api.post('/upload/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createExternal: (data: any) => api.post('/upload/external', data),
  createYouTube: (videoId: string, data: any) => api.post(`/upload/youtube/${videoId}`, data),
  getByArticle: (articleId: number) => api.get(`/upload/article/${articleId}`),
  getStats: () => api.get('/upload/stats'),
  delete: (id: number) => api.delete(`/upload/${id}`),
};

export const categoriesAPI = {
  getAll: (params?: any) => api.get('/categories', { params }),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

export const commentsAPI = {
  getByArticle: (articleId: number) => api.get(`/comments/article/${articleId}`),
  create: (commentData: any) => api.post('/comments', commentData),
  like: (id: number) => api.post(`/comments/${id}/like`),
};

export const contactAPI = {
  create: (data: any) => api.post('/contacts', data),
};

export default api;
