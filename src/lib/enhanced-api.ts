/**
 * Enhanced API Service Layer with Caching and Retry Logic
 * @file src/lib/enhanced-api.ts
 * 
 * Advanced API utilities inspired by Bloom but integrated with Voila's app config system
 */

// Removed getCombinedApiConfig dependency to avoid server-side imports in browser

// Browser-compatible API URL builder
function buildApiUrl(appName: string, endpoint: string, environment?: string): string {
  // Simple URL building for immediate use
  const baseUrl = typeof window !== 'undefined' ? `/api/${appName}` : `http://localhost:8000/api/${appName}`;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${cleanEndpoint}`;
}
import type { VoilaWebFeatureContract } from './web-contracts.js';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
  cached?: boolean;
  headers?: Record<string, string>;
}

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  cache?: boolean;
  cacheTime?: number;
  retries?: number;
}

// Simple in-memory cache
const apiCache = new Map<string, { 
  data: any; 
  timestamp: number; 
  expiry: number; 
}>();

/**
 * Enhanced API service class with app-level configuration
 */
export class EnhancedApiService {
  private appName: string;
  private config: {
    app: string;
    api: {
      baseUrl: string;
      timeout: number;
      retries: number;
      cache: boolean;
      cacheTime: number;
    };
  };
  private contractConfig?: VoilaWebFeatureContract['api'];

  constructor(appName: string, contractConfig?: VoilaWebFeatureContract['api'], environment?: string) {
    this.appName = appName;
    // Simple browser-compatible config
    this.config = {
      app: appName,
      api: {
        baseUrl: typeof window !== 'undefined' ? `/api/${appName}` : `http://localhost:8000/api/${appName}`,
        timeout: 10000,
        retries: 2,
        cache: true,
        cacheTime: 300000
      }
    };
    this.contractConfig = contractConfig;
  }

  /**
   * Make an API request with enhanced features
   */
  async request<T = any>(
    endpoint: string, 
    method: string = 'GET',
    data?: any,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // Merge contract config with options
    const finalOptions = this.mergeOptions(options);
    
    // Build full URL
    const url = buildApiUrl(this.appName, endpoint);
    const cacheKey = method === 'GET' ? `${method}:${url}:${JSON.stringify(finalOptions.headers || {})}` : '';
    
    // Check cache for GET requests
    if (method === 'GET' && finalOptions.cache && cacheKey) {
      const cachedResponse = this.getCachedResponse<T>(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Retry logic
    for (let attempt = 1; attempt <= finalOptions.retries; attempt++) {
      try {
        const response = await this.makeRequest<T>(url, method, data, finalOptions);
        
        // Cache successful GET requests
        if (method === 'GET' && finalOptions.cache && cacheKey && response.success) {
          this.setCacheEntry(cacheKey, response.data, finalOptions.cacheTime);
        }
        
        return response;
        
      } catch (error: any) {
        console.error(`[EnhancedAPI] Attempt ${attempt} failed for ${method} ${url}:`, error.message);
        
        // Don't retry on client errors (4xx) or abort
        if (error.name === 'AbortError' || (error.status >= 400 && error.status < 500)) {
          break;
        }
        
        // If this is the last attempt, return error
        if (attempt === finalOptions.retries) {
          return {
            success: false,
            error: error.message || 'Request failed after all retries',
            status: error.status || 0
          };
        }
        
        // Wait before retry with exponential backoff
        await this.wait(Math.pow(2, attempt) * 1000);
      }
    }

    return {
      success: false,
      error: 'Request failed after all retries'
    };
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, options);
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, options);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', data, options);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }

  /**
   * Switch environment (for testing microservices)
   */
  switchEnvironment(environment: string): void {
    // Simple environment switching for browser
    const envUrls = {
      development: `/api/${this.appName}`,
      staging: `https://staging-api.voila.com/api/${this.appName}`,
      production: `https://api.voila.com/api/${this.appName}`,
      'local-microservice': `http://localhost:3001/api`
    };
    
    this.config.api.baseUrl = envUrls[environment as keyof typeof envUrls] || `/api/${this.appName}`;
    console.log(`[EnhancedAPI] Switched ${this.appName} to ${environment}: ${this.config.api.baseUrl}`);
  }

  /**
   * Clear cache for this app
   */
  clearCache(): void {
    const prefix = `GET:${this.config.api.baseUrl}`;
    for (const key of apiCache.keys()) {
      if (key.startsWith(prefix)) {
        apiCache.delete(key);
      }
    }
  }

  // Private methods
  private mergeOptions(options: ApiRequestOptions): Required<ApiRequestOptions> {
    return {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: options.timeout || this.contractConfig?.timeout || this.config.api.timeout || 10000,
      cache: options.cache !== undefined ? options.cache : this.contractConfig?.cache?.enabled !== false,
      cacheTime: options.cacheTime || this.contractConfig?.cache?.duration || this.config.api.cacheTime || 300000,
      retries: options.retries || this.contractConfig?.retries || this.config.api.retries || 2
    };
  }

  private async makeRequest<T>(
    url: string, 
    method: string, 
    data: any, 
    options: Required<ApiRequestOptions>
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);

    try {
      const requestOptions: RequestInit = {
        method,
        headers: options.headers,
        signal: controller.signal
      };

      // Add body for non-GET requests
      if (data && method !== 'GET') {
        if (data instanceof FormData) {
          // Remove Content-Type for FormData
          const headers = requestOptions.headers as Record<string, string>;
          delete headers['Content-Type'];
          requestOptions.body = data;
        } else if (typeof data === 'object') {
          requestOptions.body = JSON.stringify(data);
        } else {
          requestOptions.body = String(data);
        }
      }

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      // Parse response
      let responseData: any;
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else if (contentType.includes('text/')) {
        responseData = await response.text();
      } else {
        responseData = await response.blob();
      }

      if (response.ok) {
        return {
          success: true,
          data: responseData,
          status: response.status,
          headers: response.headers ? Object.fromEntries(response.headers as any) : {},
          cached: false
        };
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    } finally {
      clearTimeout(timeoutId);
    }
  }

  private getCachedResponse<T>(cacheKey: string): ApiResponse<T> | null {
    const cached = apiCache.get(cacheKey);
    
    if (cached && Date.now() < cached.expiry) {
      return {
        success: true,
        data: cached.data,
        cached: true,
        status: 200
      };
    }
    
    // Remove expired entry
    if (cached) {
      apiCache.delete(cacheKey);
    }
    
    return null;
  }

  private setCacheEntry(cacheKey: string, data: any, cacheTime: number): void {
    apiCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + cacheTime
    });
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Factory function to create API service for a specific app/contract
 */
export function createApiService(appName: string, contract?: VoilaWebFeatureContract, environment?: string): EnhancedApiService {
  return new EnhancedApiService(appName, contract?.api, environment);
}

/**
 * Clear all API cache
 */
export function clearAllApiCache(): void {
  apiCache.clear();
}

/**
 * Health check for app API
 */
export async function healthCheck(appName: string, environment?: string): Promise<boolean> {
  try {
    const baseUrl = buildApiUrl(appName, '/health', environment);
    const response = await fetch(baseUrl, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}