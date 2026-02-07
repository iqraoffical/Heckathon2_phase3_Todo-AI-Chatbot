import axios from 'axios';
import { getJwtToken } from './auth-client';

// Create an Axios instance for API calls
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', // Update to your backend URL
});

// Request interceptor to add JWT token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getJwtToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (token expired/invalid)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token might be expired or invalid
      // You could redirect to login page or trigger a token refresh here
      console.error('Unauthorized access - token may be expired');
      
      // Optionally, redirect to login page
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;