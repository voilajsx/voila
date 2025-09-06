/**
 * Voila Framework API Client - Framework-level API utilities
 * @file src/lib/web-api.ts
 * 
 * @llm-rule WHEN: Web apps need standardized HTTP client with retry logic
 * @llm-rule AVOID: Direct fetch calls - use this client for consistency
 * @llm-rule PATTERN: Config-driven client with exponential backoff retry
 * @llm-rule NOTE: Each app configures its own baseUrl and settings
 * 
 * Provides standardized API client that apps can configure with their own URLs
 */

export interface AppApiConfig {
  baseUrl: string;
  retries?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

/**
 * Framework-level API Client
 * Apps configure their own URLs and settings
 * 
 * @llm-rule WHEN: Need HTTP client with retry, timeout, and error handling
 * @llm-rule AVOID: Creating new fetch wrapper - extend this class instead
 * @llm-rule PATTERN: Exponential backoff with configurable retries
 */
export class VoilaApiClient {
  constructor(private config: AppApiConfig) {}

  /**
   * Perform GET request with retry logic
   * @param endpoint - API endpoint path (relative to baseUrl)
   * @param options - Optional headers
   * @returns Promise resolving to typed API response
   */
  async get<T>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: options?.headers
    });
  }

  /**
   * Perform POST request with retry logic
   * @param endpoint - API endpoint path (relative to baseUrl)
   * @param data - Request body data
   * @param options - Optional headers
   * @returns Promise resolving to typed API response
   */
  async post<T>(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: options?.headers
    });
  }

  async put<T>(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: options?.headers
    });
  }

  async delete<T>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: options?.headers
    });
  }

  private async request<T>(endpoint: string, requestOptions: {
    method: string;
    body?: string;
    headers?: Record<string, string>;
  }): Promise<ApiResponse<T>> {
    const retries = this.config.retries || 3;
    const timeout = this.config.timeout || 5000;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
          method: requestOptions.method,
          headers: {
            'Content-Type': 'application/json',
            ...this.config.headers,
            ...requestOptions.headers
          },
          body: requestOptions.body,
          signal: AbortSignal.timeout(timeout)
        });

        if (response.ok) {
          const data = await response.json();
          return { success: true, data, status: response.status };
        } else {
          // Don't retry client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            return { 
              success: false, 
              error: `HTTP ${response.status}`, 
              status: response.status 
            };
          }
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`[VoilaApiClient] ${this.config.baseUrl} attempt ${attempt}/${retries} failed:`, error instanceof Error ? error.message : 'Request failed');
        
        // If this is the last attempt, return the error
        if (attempt === retries) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Request failed' 
          };
        }
        
        // Wait before retry with exponential backoff
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        }
      }
    }
    
    return { success: false, error: 'Request failed after all retries' };
  }
}

/**
 * Factory function to create app-specific API clients
 * @param config - App-specific API configuration
 * @returns Configured VoilaApiClient instance
 * @llm-rule WHEN: Setting up API client for a new web app
 * @llm-rule PATTERN: Use this factory instead of direct constructor
 */
export function createAppApiClient(config: AppApiConfig): VoilaApiClient {
  return new VoilaApiClient(config);
}