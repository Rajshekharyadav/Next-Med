import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for auth tokens, etc.
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here later
    // if (typeof window !== 'undefined') {
    //   const token = localStorage.getItem('auth_token');
    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    //   }
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Endpoints
export const doctorsApi = {
  getAll: () => api.get('/doctors'),
  getById: (id: string) => api.get(`/doctors/${id}`),
  getAvailableSlots: (doctorId: string, date: string) =>
    api.get(`/doctors/${doctorId}/slots?date=${date}`),
};

export const appointmentsApi = {
  create: (data: any) => api.post('/appointments', data),
  getUserAppointments: () => api.get('/appointments/user'),
  cancel: (id: string) => api.delete(`/appointments/${id}`),
  reschedule: (id: string, data: any) => api.put(`/appointments/${id}`, data),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) => api.post('/auth/register', userData),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  updatePassword: (data: any) => api.put('/users/password', data),
};

export default api; 