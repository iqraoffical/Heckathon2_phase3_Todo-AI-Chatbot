// lib/api.ts
import axios, { AxiosResponse } from 'axios';
import { Task, ChatRequest, ChatResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from wherever you store it (localStorage, cookie, etc.)
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Redirect to login or clear auth state
      localStorage.removeItem('auth_token');
      window.location.href = '/login'; // Or however you handle auth redirects
    }
    return Promise.reject(error);
  }
);

// Task API functions
export const taskApi = {
  // Get all tasks for a user
  getTasks: async (userId: string, params?: { completed?: boolean; limit?: number; offset?: number }): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get(`/api/${userId}/tasks`, { params });
    return response.data;
  },

  // Get a single task
  getTask: async (userId: string, taskId: string): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.get(`/api/${userId}/tasks/${taskId}`);
    return response.data;
  },

  // Create a new task
  createTask: async (userId: string, taskData: Partial<Task>): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.post(`/api/${userId}/tasks`, taskData);
    return response.data;
  },

  // Update a task
  updateTask: async (userId: string, taskId: string, taskData: Partial<Task>): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.put(`/api/${userId}/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (userId: string, taskId: string): Promise<void> => {
    await apiClient.delete(`/api/${userId}/tasks/${taskId}`);
  },

  // Mark a task as complete
  completeTask: async (userId: string, taskId: string): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.patch(`/api/${userId}/tasks/${taskId}/complete`, {
      completed: true
    });
    return response.data;
  },
};

// Chat API functions
export const chatApi = {
  sendMessage: async (userId: string, message: string): Promise<ChatResponse> => {
    const response: AxiosResponse<ChatResponse> = await apiClient.post(`/api/${userId}/chat`, {
      message
    });
    return response.data;
  },
};

export default apiClient;