/**
 * Voila Framework Global Hooks - Infrastructure-level React hooks
 * @file src/lib/web-hooks.ts
 * 
 * Provides consistent infrastructure hooks across all Voila apps/features
 */

import { useState, useCallback, useContext } from 'react';
import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import type { VoilaApiClient } from './web-api.js';
import { VoilaStateContext, type VoilaGlobalState } from './web-providers.js';

// ================================
// Storage Hook
// ================================

export interface VoilaStorageOptions {
  storage?: 'localStorage' | 'sessionStorage';
  serialize?: boolean;
}

/**
 * Voila Storage Hook - Consistent local storage management
 * Supports both localStorage and sessionStorage with serialization
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

export interface VoilaApiHookOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  headers?: Record<string, string>;
}

export interface VoilaMutationOptions<TData, TVariables> extends UseMutationOptions<TData, Error, TVariables> {
  headers?: Record<string, string>;
}

/**
 * Voila API Hook - Consistent API management with React Query
 * Integrates with VoilaApiClient for automatic retry/caching
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
        const response = await apiClient.get<T>(endpoint, { headers });
        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }
        return response.data!;
      },
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
 * Access and modify framework-level state
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
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
 */
export function useVoilaDev() {
  return import.meta.env.DEV;
}

/**
 * Get Voila environment variables
 */
export function useVoilaEnv() {
  return {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    theme: import.meta.env.VITE_THEME || 'default',
    mode: import.meta.env.VITE_MODE || 'light'
  };
}