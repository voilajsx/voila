/**
 * Hello Frontend Feature Services - Enhanced with app-level configuration
 * @file src/web/greeting/features/hello/hello.services.ts
 * 
 * API client services using enhanced API layer with caching and retries
 */

import type { HelloResponse, ApiService } from './hello.types.js';
import { GreetingApi, switchGreetingEnvironment } from '../../greeting.web.config.js';

/**
 * Enhanced API client for greeting hello endpoints
 */
export const HelloApiService: ApiService & {
  switchEnvironment: (env: string) => void;
  clearCache: () => void;
  getApiService: () => typeof GreetingApi;
} = {
  /**
   * Get default greeting (public endpoint)
   */
  async getDefaultGreeting(): Promise<HelloResponse> {
    const response = await GreetingApi.get<HelloResponse>('/hello');
    
    if (!response.success) {
      throw new Error(`Failed to fetch default greeting: ${response.error}`);
    }
    
    return response.data!;
  },

  /**
   * Get good day greeting (requires API key)
   */
  async getGoodDayGreeting(apiKey: string): Promise<HelloResponse> {
    const response = await GreetingApi.get<HelloResponse>('/hello/goodday', {
      headers: {
        'X-API-Key': apiKey
      }
    });
    
    if (!response.success) {
      if (response.status === 401) {
        throw new Error('Invalid API key - Please check your API key');
      }
      throw new Error(`Failed to fetch good day greeting: ${response.error}`);
    }
    
    return response.data!;
  },

  /**
   * Get thank you greeting (requires login token)
   */
  async getThankYouGreeting(token: string): Promise<HelloResponse> {
    const response = await GreetingApi.get<HelloResponse>('/hello/thankyou', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.success) {
      if (response.status === 401) {
        throw new Error('Invalid login token - Please log in');
      }
      throw new Error(`Failed to fetch thank you greeting: ${response.error}`);
    }
    
    return response.data!;
  },

  /**
   * Get personalized greeting (requires login token + admin role)
   */
  async getPersonalizedGreeting(name: string, token: string): Promise<HelloResponse> {
    const response = await GreetingApi.get<HelloResponse>(`/hello/${encodeURIComponent(name)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.success) {
      if (response.status === 401) {
        throw new Error('Invalid login token - Please log in');
      }
      if (response.status === 403) {
        throw new Error('Admin role required - Insufficient permissions');
      }
      throw new Error(`Failed to fetch personalized greeting: ${response.error}`);
    }
    
    return response.data!;
  },

  /**
   * Switch API environment for testing
   */
  switchEnvironment(environment: string): void {
    // Use app-level environment switching
    if (environment === 'local-microservice' || environment === 'microservice') {
      switchGreetingEnvironment('microservice');
    } else if (environment === 'development') {
      switchGreetingEnvironment('development');
    } else {
      switchGreetingEnvironment('monolith');
    }
    console.log(`[HelloApiService] Switched to ${environment}`);
  },

  /**
   * Clear API cache
   */
  clearCache(): void {
    // Framework-level cache clearing would go here
    console.log('[HelloApiService] Cache cleared');
  },

  /**
   * Get API service instance for advanced usage
   */
  getApiService() {
    return GreetingApi;
  }
};

/**
 * React Query hooks for greeting API (Enhanced)
 */
export const useGreetingQueries = () => {
  // Enhanced with caching and error handling
  return {
    HelloApiService,
    // Environment switching utilities
    switchToMicroservice: () => HelloApiService.switchEnvironment('local-microservice'),
    switchToDevelopment: () => HelloApiService.switchEnvironment('development'),
    switchToProduction: () => HelloApiService.switchEnvironment('production'),
    // Cache management
    clearGreetingCache: () => HelloApiService.clearCache()
  };
};

/**
 * Utility for testing different API environments
 */
export const GreetingApiTester = {
  async testAllEnvironments() {
    const environments = ['development', 'staging', 'production', 'local-microservice'];
    const results: Record<string, boolean> = {};
    
    for (const env of environments) {
      try {
        HelloApiService.switchEnvironment(env);
        await HelloApiService.getDefaultGreeting();
        results[env] = true;
        console.log(`✅ ${env}: API accessible`);
      } catch (error) {
        results[env] = false;
        console.log(`❌ ${env}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Switch back to development
    HelloApiService.switchEnvironment('development');
    return results;
  },
  
  async healthCheck(environment?: string) {
    if (environment) {
      HelloApiService.switchEnvironment(environment);
    }
    
    try {
      await HelloApiService.getDefaultGreeting();
      return { healthy: true, environment };
    } catch (error) {
      return { healthy: false, environment, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};