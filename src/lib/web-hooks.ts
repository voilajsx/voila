/**
 * Voila Framework Global Hooks - Infrastructure-level React hooks
 * @file src/lib/web-hooks.ts
 * 
 * @llm-rule WHEN: Need standardized hooks across all web apps (storage, API, global state)
 * @llm-rule AVOID: Creating custom hooks in each app - use these framework hooks instead
 * @llm-rule PATTERN: Consistent API with React Query integration and typed interfaces
 * @llm-rule NOTE: All hooks are framework-level and can be used in any Voila web application
 * 
 * Provides consistent infrastructure hooks across all Voila apps/features including:
 * - Storage management (localStorage/sessionStorage with serialization)
 * - API client integration with React Query (caching, retry, mutations)
 * - Global state management (user, theme, notifications)
 * - Development utilities and environment access
 */

import { useState, useCallback, useContext } from 'react';
import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import type { VoilaApiClient } from './web-api.js';
import { VoilaStateContext, type VoilaGlobalState } from './web-providers.js';

// ================================
// Storage Hook
// ================================

/**
 * Configuration options for Voila storage hook
 */
export interface VoilaStorageOptions {
  /** Storage type to use - defaults to localStorage */
  storage?: 'localStorage' | 'sessionStorage';
  /** Whether to serialize values as JSON - defaults to true */
  serialize?: boolean;
}

/**
 * Voila Storage Hook - Consistent local storage management
 * 
 * Provides a React hook for managing browser storage with automatic serialization,
 * error handling, and consistent API across localStorage and sessionStorage.
 * 
 * @param key - Storage key to use
 * @param defaultValue - Default value if key doesn't exist
 * @param options - Storage configuration options
 * @returns Tuple of [value, setValue, removeValue]
 * 
 * @example
 * ```tsx
 * const [theme, setTheme, clearTheme] = useVoilaStorage('user-theme', 'light');
 * const [settings, setSettings] = useVoilaStorage('app-settings', {}, { serialize: true });
 * ```
 */
export function useVoilaStorage<T>(
  key: string, 
  defaultValue: T,
  options: VoilaStorageOptions = {}
) {
  const { storage = 'localStorage', serialize = true } = options;
  const storageObject = storage === 'localStorage' ? localStorage : sessionStorage;

  const [value, setValue] = useState<T>(() => {
    try {
      const item = storageObject.getItem(key);
      if (item === null) return defaultValue;
      return serialize ? JSON.parse(item) : item;
    } catch (error) {
      console.warn(`[useVoilaStorage] Failed to parse ${key}:`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      
      if (valueToStore === undefined || valueToStore === null) {
        storageObject.removeItem(key);
      } else {
        const stringValue = serialize ? JSON.stringify(valueToStore) : String(valueToStore);
        storageObject.setItem(key, stringValue);
      }
    } catch (error) {
      console.error(`[useVoilaStorage] Failed to set ${key}:`, error);
    }
  }, [key, serialize, storage, value]);

  const removeValue = useCallback(() => {
    try {
      storageObject.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.error(`[useVoilaStorage] Failed to remove ${key}:`, error);
    }
  }, [key, defaultValue, storage]);

  return [value, setStoredValue, removeValue] as const;
}

// ================================
// API Hook
// ================================

/**
 * Options for Voila API GET requests with React Query integration
 */
export interface VoilaApiHookOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  /** Additional headers to include with the request */
  headers?: Record<string, string>;
}

/**
 * Options for Voila API mutation requests (POST, PUT, DELETE)
 */
export interface VoilaMutationOptions<TData, TVariables> extends UseMutationOptions<TData, Error, TVariables> {
  /** Additional headers to include with the request */
  headers?: Record<string, string>;
}

/**
 * Voila API Hook - Consistent API management with React Query
 * 
 * Integrates VoilaApiClient with React Query for advanced caching, retry logic,
 * and optimistic updates. Provides methods for all HTTP verbs with consistent
 * error handling and query invalidation.
 * 
 * @param apiClient - Configured VoilaApiClient instance
 * @returns Object with HTTP methods and cache utilities
 * 
 * @example
 * ```tsx
 * const api = useVoilaApi(greetingApiClient);
 * const { data, isLoading } = api.get('/hello/world');
 * const mutation = api.post('/hello', { onSuccess: () => console.log('Success!') });
 * ```
 */
export function useVoilaApi(apiClient: VoilaApiClient) {
  const queryClient = useQueryClient();

  // GET request with React Query caching
  const get = useCallback(<T,>(
    endpoint: string,
    options: VoilaApiHookOptions<T> = {}
  ) => {
    const { headers, ...queryOptions } = options;
    
    return useQuery<T>({
      queryKey: ['voila-api', apiClient.constructor.name, endpoint, headers],
      queryFn: async () => {
        console.log(`🚀 [API GET Request]`, {
          endpoint,
          headers,
          fullUrl: `${apiClient.constructor.name}${endpoint}`,
          actualUrl: `Direct to API server: localhost:8000/api/greeting${endpoint}`,
          timestamp: new Date().toISOString()
        });
        const response = await apiClient.get<T>(endpoint, { headers });
        console.log(`📨 [API GET Response]`, {
          endpoint,
          success: response.success,
          status: response.status,
          error: response.error,
          hasData: !!response.data,
          fullResponse: response,
          timestamp: new Date().toISOString()
        });
        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }
        return response.data!;
      },
      retry: 3, // Limit to 3 retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff: 1s, 2s, 4s, max 30s
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      ...queryOptions
    });
  }, [apiClient]);

  // POST mutation with optimistic updates
  const post = useCallback(<TData, TVariables = any>(
    endpoint: string,
    options: VoilaMutationOptions<TData, TVariables> = {}
  ) => {
    const { headers, ...mutationOptions } = options;
    
    return useMutation<TData, Error, TVariables>({
      mutationFn: async (variables: TVariables) => {
        const response = await apiClient.post<TData>(endpoint, variables, { headers });
        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }
        return response.data!;
      },
      onSuccess: () => {
        // Invalidate related queries
        queryClient.invalidateQueries({ 
          queryKey: ['voila-api', apiClient.constructor.name] 
        });
      },
      ...mutationOptions
    });
  }, [apiClient, queryClient]);

  // PUT mutation
  const put = useCallback(<TData, TVariables = any>(
    endpoint: string,
    options: VoilaMutationOptions<TData, TVariables> = {}
  ) => {
    const { headers, ...mutationOptions } = options;
    
    return useMutation<TData, Error, TVariables>({
      mutationFn: async (variables: TVariables) => {
        const response = await apiClient.put<TData>(endpoint, variables, { headers });
        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }
        return response.data!;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ 
          queryKey: ['voila-api', apiClient.constructor.name] 
        });
      },
      ...mutationOptions
    });
  }, [apiClient, queryClient]);

  // DELETE mutation
  const del = useCallback(<TData,>(
    endpoint: string,
    options: VoilaMutationOptions<TData, void> = {}
  ) => {
    const { headers, ...mutationOptions } = options;
    
    return useMutation<TData, Error, void>({
      mutationFn: async () => {
        const response = await apiClient.delete<TData>(endpoint, { headers });
        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }
        return response.data!;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ 
          queryKey: ['voila-api', apiClient.constructor.name] 
        });
      },
      ...mutationOptions
    });
  }, [apiClient, queryClient]);

  // Cache utilities
  const invalidateQueries = useCallback((filters?: { endpoint?: string }) => {
    const queryKey = ['voila-api', apiClient.constructor.name];
    if (filters?.endpoint) {
      queryKey.push(filters.endpoint);
    }
    return queryClient.invalidateQueries({ queryKey });
  }, [apiClient, queryClient]);

  const prefetchQuery = useCallback(async <T,>(endpoint: string, headers?: Record<string, string>) => {
    return queryClient.prefetchQuery({
      queryKey: ['voila-api', apiClient.constructor.name, endpoint, headers],
      queryFn: async () => {
        const response = await apiClient.get<T>(endpoint, { headers });
        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }
        return response.data!;
      },
      staleTime: 5 * 60 * 1000
    });
  }, [apiClient, queryClient]);

  return {
    get,
    post,
    put,
    delete: del,
    invalidateQueries,
    prefetchQuery,
    queryClient
  };
}

// ================================
// Global State Hook
// ================================

/**
 * Voila State Hook - Global state management
 * 
 * Provides access to framework-level global state including user authentication,
 * theme preferences, API environment, and notifications. Must be used within
 * a VoilaStateProvider context.
 * 
 * @returns Object with state values and mutation methods
 * @throws Error if used outside VoilaStateProvider
 * 
 * @example
 * ```tsx
 * const { user, theme, setTheme, addNotification } = useVoilaState();
 * setTheme('dark');
 * addNotification({ message: 'Hello!', type: 'success' });
 * ```
 */
export function useVoilaState() {
  const context = useContext(VoilaStateContext);
  
  if (!context) {
    throw new Error('useVoilaState must be used within a VoilaStateProvider');
  }

  const { state, setState } = context;

  // Convenience methods for common state updates
  const setUser = useCallback((user: VoilaGlobalState['user']) => {
    setState(prev => ({ ...prev, user }));
  }, [setState]);

  const setTheme = useCallback((theme: VoilaGlobalState['theme']) => {
    setState(prev => ({ ...prev, theme }));
  }, [setState]);

  const setApiEnvironment = useCallback((apiEnvironment: VoilaGlobalState['apiEnvironment']) => {
    setState(prev => ({ ...prev, apiEnvironment }));
  }, [setState]);

  const addNotification = useCallback((notification: Omit<VoilaGlobalState['notifications'][0], 'id'>) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, { id, ...notification }]
    }));
    return id;
  }, [setState]);

  const removeNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  }, [setState]);

  return {
    // State access
    state,
    user: state.user,
    theme: state.theme,
    apiEnvironment: state.apiEnvironment,
    notifications: state.notifications,
    
    // State mutations
    setState,
    setUser,
    setTheme,
    setApiEnvironment,
    addNotification,
    removeNotification
  };
}

// ================================
// Utilities
// ================================

/**
 * Check if running in development mode
 * @returns Boolean indicating if in development environment
 */
export function useVoilaDev() {
  return import.meta.env.DEV;
}

/**
 * Get Voila environment variables and configuration
 * @returns Object with environment flags and configuration values
 */
export function useVoilaEnv() {
  return {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    theme: import.meta.env.VITE_THEME || 'default',
    mode: import.meta.env.VITE_MODE || 'light'
  };
}