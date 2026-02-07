import axios from 'axios';
import { getJwtToken } from './auth-client';

// Base API URL - can be configured via environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Define types for our API responses
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string; // ISO date string
  tags?: string[];
  category?: string;
  estimated_time?: number; // Estimated time in minutes
  actual_time_spent?: number; // Actual time spent in minutes
  project_id?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  user_id: string;
}

// Define types for Project API responses
export interface Project {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Create an Axios instance for API calls
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token to all requests
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token might be expired or invalid
      console.error('Unauthorized access - token may be expired');
    }

    return Promise.reject(error);
  }
);

// Define the API client with JWT token handling
class ApiClient {
  // Get all tasks for the authenticated user with optional filters
  async getTasks(filters?: {
    search?: string;
    status?: 'all' | 'pending' | 'completed';
    priority?: 'high' | 'medium' | 'low';
    category?: string;
    project_id?: string;
    tags?: string; // Comma-separated tag values
    due_date_from?: string; // Filter tasks with due date greater than or equal to this date
    due_date_to?: string; // Filter tasks with due date less than or equal to this date
    sort_by?: 'created' | 'due_date' | 'priority' | 'title' | 'category' | 'project_id';
    order?: 'asc' | 'desc';
  }): Promise<Task[]> {
    // Build query string from filters
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';

    const response = await axiosInstance.get<Task[]>(endpoint);
    return response.data;
  }

  // Create a new task
  async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Task> {
    const response = await axiosInstance.post<Task>('/tasks', taskData);
    return response.data;
  }

  // Update an existing task
  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    const response = await axiosInstance.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  }

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    await axiosInstance.delete(`/tasks/${id}`);
  }

  // Toggle task completion status
  async toggleComplete(id: string): Promise<Task> {
    // First get the current task to determine its status
    const currentTask = await this.getTaskById(id);

    // Determine the new status
    const newStatus = currentTask.status === 'completed' ? 'todo' : 'completed';

    // Update the task with the new status
    return this.updateTask(id, { status: newStatus });
  }

  // Get a specific task by ID
  async getTaskById(id: string): Promise<Task> {
    const response = await axiosInstance.get<Task>(`/tasks/${id}`);
    return response.data;
  }

  // Get all projects for the authenticated user
  async getProjects(filters?: {
    search?: string;
    sort_by?: 'created' | 'name' | 'updated';
    order?: 'asc' | 'desc';
  }): Promise<Project[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/projects?${queryString}` : '/projects';

    const response = await axiosInstance.get<Project[]>(endpoint);
    return response.data;
  }

  // Create a new project
  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Project> {
    const response = await axiosInstance.post<Project>('/projects', projectData);
    return response.data;
  }

  // Update an existing project
  async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    const response = await axiosInstance.put<Project>(`/projects/${id}`, projectData);
    return response.data;
  }

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    await axiosInstance.delete(`/projects/${id}`);
  }

  // Get a specific project by ID
  async getProjectById(id: string): Promise<Project> {
    const response = await axiosInstance.get<Project>(`/projects/${id}`);
    return response.data;
  }
}

// Create and export a singleton instance of the API client
export const apiClient = new ApiClient();

// Export the typed methods for direct use
export const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
  getTaskById,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById
} = apiClient;

// Also export the axios instance for direct use if needed
export { axiosInstance };




