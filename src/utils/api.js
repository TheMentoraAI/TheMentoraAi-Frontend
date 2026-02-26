import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    // Local development (uncomment for local):
    // baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    // Production - Railway backend:
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://thementoraai-backend-production.up.railway.app',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            console.log('[API] Request to:', config.url, 'Base URL:', config.baseURL);
            console.log('[API] Token exists:', !!token);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('[API] Authorization header added');
            } else {
                console.warn('[API] No access token found in localStorage');
            }
        }
        return config;
    },
    (error) => {
        console.error('[API] Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log('[API] Response from:', response.config.url, 'Status:', response.status);
        return response;
    },
    (error) => {
        console.error('[API] Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            validationError: error.response?.data?.detail // Log the specific validation error
        });

        // Log deep detail for debugging 422s
        if (error.response?.status === 422) {
            console.error('[API] 422 Validation Details:', JSON.stringify(error.response.data, null, 2));
        }

        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            if (typeof window !== 'undefined') {
                console.warn('[API] 401 Unauthorized - clearing tokens and redirecting to login');
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (userData) => api.post('/api/auth/register', userData),
    login: (credentials) => api.post('/api/auth/login', credentials),
    logout: () => api.post('/api/auth/logout'),
};

// User API calls
export const userAPI = {
    getMe: () => api.get('/api/users/me'),
    getStats: () => api.get('/api/users/stats'),
    getDailyProgress: () => api.get('/api/users/daily-progress'),
    updateProfile: (data) => api.put('/api/users/profile', data),
};

// Track API calls
export const trackAPI = {
    getEnrolled: () => api.get('/api/tracks/enrolled'),
    getProgress: (trackSlug) => api.get(`/api/tracks/${trackSlug}/progress`),
    enroll: (trackSlug, trackData) => api.post(`/api/tracks/${trackSlug}/enroll`, trackData),
    updateProgress: (trackSlug, progressData) => api.put(`/api/tracks/${trackSlug}/progress`, progressData),
    getCompletedTasks: (trackSlug) => api.get(`/api/tracks/${trackSlug}/tasks/completed`),
    completeTask: (taskId, completionData) => api.post(`/api/tracks/tasks/${taskId}/complete`, completionData),
};

// Legacy API calls (existing endpoints)
export const legacyAPI = {
    getLessons: (track) => api.get(`/lessons/${track}`),
    getTasks: (track) => api.get(`/tasks/${track}`),
    generateTask: (data) => api.post('/generate-task', data),
    evaluate: (data) => api.post('/evaluate', data),
};

export default api;
