import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only logout if token is explicitly invalid/expired on auth-related requests
    const isAuthRequest = error.config?.url?.includes('/api/auth');
    if (error.response?.status === 401 && !isAuthRequest) {
      console.warn('Unauthorized API call:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

// --- GLOBAL AXIOS INTERCEPTORS ---
// This protects all components in the project using `import axios from 'axios'` directly.
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthRequest = error.config?.url?.includes('/api/auth');
    if (error.response?.status === 401 && !isAuthRequest) {
      console.warn('Unauthorized API call:', error.config?.url);
    }
    return Promise.reject(error);
  }
);