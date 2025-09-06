/**
 * Hello Web Hook - React hook for greeting API with caching and validation
 * @file src/web/apps/greeting/features/hello/hooks/useHello.ts
 * @group Web Hooks
 * 
 * @llm-rule WHEN: Need greeting functionality with multi-language support and authentication
 * @llm-rule AVOID: Direct GreetingApi calls - use this hook for consistency and caching
 * @llm-rule PATTERN: Returns {greetings, auth, actions, computed} structure with React Query integration
 * @llm-rule NOTE: Matches backend HelloService patterns, uses real auth tokens from .env.auth
 */

import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useVoilaApi, useVoilaStorage } from '../../../../../../lib/web-hooks';
import { GreetingApi } from '../../../greeting.web.config.js';
import { AuthTokenHelpers } from '../../../../../../lib/test-auth';
import type { UseHelloReturn, HelloResponse, ApiError } from '../types/hello';

/**
 * Main Hello Feature Hook - Primary interface
 * Optimized, type-safe, and follows Bloom patterns
 */
export function useHello(): UseHelloReturn {
  const api = useVoilaApi(GreetingApi);
  const queryClient = useQueryClient();
  
  // Load TEST tokens from .env.auth using helper (DEVELOPMENT/TESTING ONLY)
  // TODO: Replace with real user authentication in production
  const API_TOKEN = AuthTokenHelpers.getApiToken();
  const USER_LOGIN_TOKEN = AuthTokenHelpers.getUserToken();
  const ADMIN_LOGIN_TOKEN = AuthTokenHelpers.getAdminToken();


  // Base queries with proper typing and automatic token selection
  const defaultGreeting = api.get<HelloResponse>('/hello');
  
  // /hello/goodday requires API token (WEBHOOK_SERVICE_API_TOKEN)
  const goodDayGreeting = api.get<HelloResponse>('/hello/goodday', {
    headers: { 'Authorization': `Bearer ${API_TOKEN}` }
  });
  
  // /hello/thankyou requires any login token (USER_BASIC)
  const thankYouGreeting = api.get<HelloResponse>('/hello/thankyou', {
    headers: { 'Authorization': `Bearer ${USER_LOGIN_TOKEN}` }
  });

  /**
   * Generate personalized greeting with name validation
   * @llm-rule WHEN: User provides name for personalized greeting
   * @llm-rule AVOID: Processing empty/invalid names - validate first
   * @llm-rule PATTERN: URL-encode names and return React Query result
   */
  const getPersonalGreeting = useCallback((name: string) => {
    const trimmedName = name?.trim() || '';
    // /hello/:name requires admin.tenant role (ADMIN_TENANT token)
    return api.get<HelloResponse>(`/hello/${encodeURIComponent(trimmedName || 'anonymous')}`, {
      headers: { 'Authorization': `Bearer ${ADMIN_LOGIN_TOKEN}` },
      enabled: !!trimmedName  // Only requires name, token is hardcoded
    });
  }, [api]);

  /**
   * Clear all greeting cache and invalidate queries
   * @llm-rule WHEN: Need to refresh all cached greeting data
   * @llm-rule PATTERN: Uses React Query invalidateQueries for cache management
   */
  const clearCache = useCallback(() => {
    api.invalidateQueries();
  }, [api]);

  /**
   * Refresh all greeting queries with hardcoded tokens
   * @llm-rule WHEN: User requests manual refresh of greeting data
   * @llm-rule PATTERN: Refetch all queries since tokens are hardcoded
   */
  const refresh = useCallback(() => {
    defaultGreeting.refetch?.();
    goodDayGreeting.refetch?.();
    thankYouGreeting.refetch?.();
  }, [defaultGreeting.refetch, goodDayGreeting.refetch, thankYouGreeting.refetch]);

  // Memoized computed values for performance
  const computed = useMemo(() => ({
    isLoading: defaultGreeting.isLoading || goodDayGreeting.isLoading || thankYouGreeting.isLoading,
    hasError: !!(defaultGreeting.error || goodDayGreeting.error || thankYouGreeting.error),
    isReady: !defaultGreeting.isLoading && !defaultGreeting.error,
    hasApiKey: !!API_TOKEN,
    hasAuthToken: !!USER_LOGIN_TOKEN,
    canShowGoodDay: !!API_TOKEN && !goodDayGreeting.isLoading,
    canShowThankYou: !!USER_LOGIN_TOKEN && !thankYouGreeting.isLoading
  }), [
    defaultGreeting.isLoading, defaultGreeting.error,
    goodDayGreeting.isLoading, goodDayGreeting.error,
    thankYouGreeting.isLoading, thankYouGreeting.error
  ]);

  // Memoized auth state for performance
  const auth = useMemo(() => ({
    apiKey: API_TOKEN,
    authToken: USER_LOGIN_TOKEN,
    isAuthenticated: true, // Always authenticated with hardcoded tokens
    setApiKey: () => {}, // No-op since tokens are hardcoded
    setAuthToken: () => {} // No-op since tokens are hardcoded
  }), [API_TOKEN, USER_LOGIN_TOKEN]);

  // Memoized actions for performance
  const actions = useMemo(() => ({
    getPersonalGreeting,
    clearCache,
    refresh
  }), [getPersonalGreeting, clearCache, refresh]);

  return {
    // Data
    greetings: {
      default: defaultGreeting,
      goodDay: goodDayGreeting,
      thankYou: thankYouGreeting
    },
    
    // Auth state
    auth,
    
    // Actions
    actions,
    
    // Computed state
    ...computed
  };
}

