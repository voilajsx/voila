/**
 * Logs API Services
 * @file src/web/greeting/features/logs/logs.services.ts
 */

// Using simple fetch API to avoid server-side dependencies

export interface LogEntry {
  id: string;
  endpoint: string;
  message: string;
  userName: string;
  userId: string | null;
  userRole: string | null;
  ipAddress: string;
  createdAt: string;
  level?: 'info' | 'warn' | 'error' | 'debug'; // Optional since backend doesn't provide it
  metadata?: Record<string, any>;
}

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateLogRequest {
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  metadata?: Record<string, any>;
}

// Simple API service without dependencies with retry logic
class SimpleLogsApiService {
  private baseUrl = '/api/greeting';
  
  async get<T>(endpoint: string, retries: number = 3): Promise<{ success: boolean; data?: T; error?: string }> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        } else {
          // Don't retry on client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            return { success: false, error: `HTTP ${response.status}` };
          }
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`[LogsAPI] Attempt ${attempt}/${retries} failed:`, error instanceof Error ? error.message : 'Request failed');
        
        // If this is the last attempt, return the error
        if (attempt === retries) {
          return { success: false, error: error instanceof Error ? error.message : 'Request failed' };
        }
        
        // Wait before retry with exponential backoff
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        }
      }
    }
    
    return { success: false, error: 'Request failed after all retries' };
  }
  
  async post<T>(endpoint: string, postData: any): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Request failed' };
    }
  }

  async put<T>(endpoint: string, putData: any, retries: number = 3): Promise<{ success: boolean; data?: T; error?: string }> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(putData),
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        } else {
          // Don't retry on client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            return { success: false, error: `HTTP ${response.status}` };
          }
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`[LogsAPI] Put attempt ${attempt}/${retries} failed:`, error instanceof Error ? error.message : 'Request failed');
        
        // If this is the last attempt, return the error
        if (attempt === retries) {
          return { success: false, error: error instanceof Error ? error.message : 'Request failed' };
        }
        
        // Wait before retry with exponential backoff
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        }
      }
    }
    
    return { success: false, error: 'Put request failed after all retries' };
  }

  async delete<T>(endpoint: string, retries: number = 3): Promise<{ success: boolean; data?: T; error?: string }> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        } else {
          // Don't retry on client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            return { success: false, error: `HTTP ${response.status}` };
          }
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`[LogsAPI] Delete attempt ${attempt}/${retries} failed:`, error instanceof Error ? error.message : 'Request failed');
        
        // If this is the last attempt, return the error
        if (attempt === retries) {
          return { success: false, error: error instanceof Error ? error.message : 'Request failed' };
        }
        
        // Wait before retry with exponential backoff
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        }
      }
    }
    
    return { success: false, error: 'Delete request failed after all retries' };
  }
}

const apiService = new SimpleLogsApiService();

export const LogsApiService = {
  /**
   * Get all logs
   */
  async getLogs(page: number = 1, limit: number = 10): Promise<LogsResponse> {
    const response = await apiService.get<any>(`/logs?page=${page}&limit=${limit}`);
    
    if (!response.success) {
      throw new Error(`Failed to fetch logs: ${response.error}`);
    }
    
    // Transform API response to match frontend expectations
    const apiData = response.data;
    // The API returns: {success: true, data: {logs: [...], pagination: {...}}}
    const actualData = apiData.data || apiData;
    return {
      logs: actualData.logs || [],
      total: actualData.pagination?.total || 0,
      page: actualData.pagination?.page || page,
      limit: actualData.pagination?.limit || limit
    };
  },

  /**
   * Get log by ID
   */
  async getLog(id: string): Promise<LogEntry> {
    const response = await apiService.get<any>(`/logs/${id}`);
    
    if (!response.success) {
      throw new Error(`Failed to fetch log ${id}: ${response.error}`);
    }
    
    return response.data.data || response.data;
  },

  /**
   * Create new log entry
   */
  async createLog(logData: CreateLogRequest): Promise<LogEntry> {
    const response = await apiService.post<any>('/logs/create', logData);
    
    if (!response.success) {
      throw new Error(`Failed to create log: ${response.error}`);
    }
    
    return response.data.data || response.data;
  },

  /**
   * Update log entry
   */
  async updateLog(id: string, logData: Partial<CreateLogRequest & { endpoint?: string; userName?: string }>): Promise<LogEntry> {
    const response = await apiService.put<any>(`/logs/${id}`, logData);
    
    if (!response.success) {
      throw new Error(`Failed to update log ${id}: ${response.error}`);
    }
    
    return response.data.data || response.data;
  },

  /**
   * Search logs
   */
  async searchLogs(query: string, level?: string): Promise<LogsResponse> {
    const params = new URLSearchParams({ q: query });
    if (level) params.append('level', level);
    
    const response = await apiService.get<any>(`/logs/search?${params}`);
    
    if (!response.success) {
      throw new Error(`Failed to search logs: ${response.error}`);
    }
    
    // Transform API response to match frontend expectations
    const apiData = response.data;
    // The API returns: {success: true, data: {logs: [...], pagination: {...}}}
    const actualData = apiData.data || apiData;
    return {
      logs: actualData.logs || [],
      total: actualData.pagination?.total || 0,
      page: actualData.pagination?.page || 1,
      limit: actualData.pagination?.limit || 10
    };
  },

  /**
   * Delete log entry
   */
  async deleteLog(id: string): Promise<void> {
    const response = await apiService.delete<any>(`/logs/${id}`);
    
    if (!response.success) {
      throw new Error(`Failed to delete log ${id}: ${response.error}`);
    }
  },

  /**
   * Clear all logs (admin only)
   */
  async clearAllLogs(): Promise<void> {
    const response = await apiService.delete<any>('/logs');
    
    if (!response.success) {
      throw new Error(`Failed to clear all logs: ${response.error}`);
    }
  }
};