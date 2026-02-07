import { getServerJwtToken } from './auth-server';

// Base API URL - can be configured via environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Server-side API client for making authenticated requests to the backend
 */
export class ServerApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Generic request method that includes JWT token for server-side requests
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await getServerJwtToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      cache: 'no-store', // Disable caching for fresh data
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all tasks for the authenticated user with optional filters
   */
  async getTasks(filters?: {
    search?: string;
    status?: 'all' | 'pending' | 'completed';
    priority?: 'high' | 'medium' | 'low';
    sort_by?: 'created' | 'due_date' | 'priority' | 'title';
    order?: 'asc' | 'desc';
  }) {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    
    return this.request<[]>(endpoint);
  }

  /**
   * Get a specific task by ID
   */
  async getTaskById(id: string) {
    return this.request<{}>(`/tasks/${id}`);
  }

  /**
   * Create a new task
   */
  async createTask(taskData: any) {
    return this.request<{}>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, taskData: any) {
    return this.request<{}>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string) {
    return this.request<{}>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Toggle task completion status
   */
  async toggleComplete(id: string) {
    // First get the current task to determine its status
    const currentTask = await this.getTaskById(id);
    
    // Determine the new status
    const newStatus = (currentTask as any).status === 'completed' ? 'todo' : 'completed';
    
    // Update the task with the new status
    return this.updateTask(id, { status: newStatus });
  }
}

// Create and export a singleton instance of the server API client
export const serverApiClient = new ServerApiClient();

// Export the typed methods for direct use in server components
export const {
  getTasks: getServerTasks,
  getTaskById: getServerTaskById,
  createTask: createServerTask,
  updateTask: updateServerTask,
  deleteTask: deleteServerTask,
  toggleComplete: toggleServerComplete
} = serverApiClient;