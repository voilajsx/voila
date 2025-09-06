/**
 * {{FEATURE_NAME_PASCAL}} Feature Hook - Main interface for {{FEATURE_NAME}} functionality
 * @module {{APP_NAME}}/{{FEATURE_NAME}}
 * @file src/web/apps/{{APP_NAME}}/features/{{FEATURE_NAME}}/hooks/use{{FEATURE_NAME_PASCAL}}.ts
 * 
 * @llm-rule WHEN: Need {{FEATURE_NAME}} functionality with data management and API integration
 * @llm-rule AVOID: Direct API calls - use this hook for consistency and caching
 * @llm-rule PATTERN: Returns {data, actions, state, helpers} structure with React Query integration
 * @llm-rule NOTE: Matches backend {{FEATURE_NAME_PASCAL}}Service patterns, uses typed responses
 */

import { useCallback, useMemo } from 'react';
import { useVoilaApi, useVoilaStorage } from '../../../../../../lib/web-hooks';
import { {{APP_NAME_UPPER}}Api } from '../../../{{APP_NAME}}.web.config.js';
import type { Use{{FEATURE_NAME_PASCAL}}Return, {{FEATURE_NAME_PASCAL}}Response, {{FEATURE_NAME_PASCAL}}Data, ApiError } from '../types/{{FEATURE_NAME}}';

/**
 * Main {{FEATURE_NAME_PASCAL}} Feature Hook - Primary interface
 * Optimized, type-safe, and follows Voila patterns
 */
export function use{{FEATURE_NAME_PASCAL}}(): Use{{FEATURE_NAME_PASCAL}}Return {
  const api = useVoilaApi({{APP_NAME_UPPER}}Api);
  const [preferences, setPreferences] = useVoilaStorage('{{FEATURE_NAME}}-preferences', {});

  // Primary data queries with proper typing
  const listQuery = api.get<{{FEATURE_NAME_PASCAL}}Response[]>('/{{FEATURE_NAME}}');
  
  // Mutations for CRUD operations
  const createMutation = api.post<{{FEATURE_NAME_PASCAL}}Response, Partial<{{FEATURE_NAME_PASCAL}}Data>>('/{{FEATURE_NAME}}');
  
  const updateMutation = api.put<{{FEATURE_NAME_PASCAL}}Response, Partial<{{FEATURE_NAME_PASCAL}}Data>>('/{{FEATURE_NAME}}/:id');
  
  const deleteMutation = api.delete<void>('/{{FEATURE_NAME}}/:id');

  /**
   * Refresh all {{FEATURE_NAME}} data
   * @llm-rule WHEN: User requests manual refresh of {{FEATURE_NAME}} data
   * @llm-rule PATTERN: Invalidates and refetches all related queries
   */
  const refresh = useCallback(() => {
    listQuery.refetch?.();
    api.invalidateQueries(['/{{FEATURE_NAME}}']);
  }, [listQuery.refetch, api]);

  /**
   * Clear all {{FEATURE_NAME}} cache
   * @llm-rule WHEN: Need to clear all cached {{FEATURE_NAME}} data
   * @llm-rule PATTERN: Uses React Query invalidateQueries for cache management
   */
  const clearCache = useCallback(() => {
    api.invalidateQueries();
  }, [api]);

  // Helper functions for data manipulation
  const helpers = useMemo(() => ({
    /**
     * Find {{FEATURE_NAME}} item by ID
     */
    findById: (id: string) => {
      return listQuery.data?.find(item => item.data.id === id);
    },
    
    /**
     * Filter {{FEATURE_NAME}} items by status
     */
    filterByStatus: (status: string) => {
      return listQuery.data?.filter(item => item.data.status === status) || [];
    },
    
    /**
     * Get total count of {{FEATURE_NAME}} items
     */
    getTotalCount: () => {
      return listQuery.data?.length || 0;
    }
  }), [listQuery.data]);

  // Computed state values for performance
  const state = useMemo(() => ({
    isLoading: listQuery.isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    hasError: !!(listQuery.error || createMutation.error || updateMutation.error || deleteMutation.error),
    isReady: !listQuery.isLoading && !listQuery.error,
    isEmpty: !listQuery.data || listQuery.data.length === 0
  }), [
    listQuery.isLoading, listQuery.error, listQuery.data,
    createMutation.isPending, createMutation.error,
    updateMutation.isPending, updateMutation.error,
    deleteMutation.isPending, deleteMutation.error
  ]);

  // Current selected item (could be stored in localStorage or state)
  const currentItem = useMemo(() => {
    if (!listQuery.data || listQuery.data.length === 0) return null;
    // For demo purposes, return first item
    return listQuery.data[0];
  }, [listQuery.data]);

  // Memoized actions for performance
  const actions = useMemo(() => ({
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    refresh,
    clearCache
  }), [createMutation, updateMutation, deleteMutation, refresh, clearCache]);

  // Memoized data structure
  const data = useMemo(() => ({
    list: listQuery,
    current: currentItem
  }), [listQuery, currentItem]);

  return {
    // Data
    data,
    
    // Actions
    actions,
    
    // Computed state
    state,
    
    // Helper functions
    helpers
  };
}

/**
 * Hook for specific {{FEATURE_NAME}} item operations
 * @llm-rule WHEN: Need to work with a specific {{FEATURE_NAME}} item by ID
 * @llm-rule PATTERN: Extends main hook with item-specific functionality
 */
export function use{{FEATURE_NAME_PASCAL}}Item(id: string) {
  const main{{FEATURE_NAME_PASCAL}} = use{{FEATURE_NAME_PASCAL}}();
  const api = useVoilaApi({{APP_NAME_UPPER}}Api);
  
  // Get specific item data
  const itemQuery = api.get<{{FEATURE_NAME_PASCAL}}Response>(`/{{FEATURE_NAME}}/${id}`, {
    enabled: !!id
  });
  
  const item = useMemo(() => ({
    ...main{{FEATURE_NAME_PASCAL}},
    current: itemQuery.data,
    isLoading: itemQuery.isLoading,
    error: itemQuery.error
  }), [main{{FEATURE_NAME_PASCAL}}, itemQuery]);
  
  return item;
}