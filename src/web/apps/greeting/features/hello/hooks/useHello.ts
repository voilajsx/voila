/**
 * Hello Feature Hook - Optimized & Clean
 * @file src/web/apps/greeting/features/hello/hooks/useHello.ts
 * 
 * Main hook for Hello feature following Bloom patterns
 */

import { useCallback, useMemo } from 'react';
import { useVoilaApi, useVoilaStorage } from '@lib/web-hooks';
import { GreetingApi } from '../../../greeting.web.config.js';

/**
 * Main Hello Feature Hook - Primary interface
 * Simple, optimized, and follows Bloom patterns
 */
export function useHello() {
  const api = useVoilaApi(GreetingApi);
  const [apiKey, setApiKey] = useVoilaStorage('hello-api-key', '');
  const [authToken, setAuthToken] = useVoilaStorage('hello-auth-token', '');

  // Base queries
  const defaultGreeting = api.get('/hello');
  
  const goodDayGreeting = api.get('/hello/goodday', {
    headers: apiKey ? { 'X-API-Key': apiKey } : {},
    enabled: !!apiKey
  });
  
  const thankYouGreeting = api.get('/hello/thankyou', {
    headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
    enabled: !!authToken
  });

  // Optimized personalized greeting function
  const getPersonalGreeting = useCallback((name: string) => {
    if (!name?.trim()) return null;
    return api.get(`/hello/${encodeURIComponent(name.trim())}`);
  }, [api]);

  // Clear all greeting cache
  const clearCache = useCallback(() => {
    api.invalidateQueries();
  }, [api]);

  // Memoized computed values
  const computed = useMemo(() => ({
    isLoading: defaultGreeting.isLoading || goodDayGreeting.isLoading || thankYouGreeting.isLoading,
    hasError: defaultGreeting.error || goodDayGreeting.error || thankYouGreeting.error,
    isReady: !defaultGreeting.isLoading && !defaultGreeting.error,
    hasApiKey: !!apiKey,
    hasAuthToken: !!authToken,
    canShowGoodDay: !!apiKey && !goodDayGreeting.isLoading,
    canShowThankYou: !!authToken && !thankYouGreeting.isLoading
  }), [
    defaultGreeting.isLoading, defaultGreeting.error,
    goodDayGreeting.isLoading, goodDayGreeting.error,
    thankYouGreeting.isLoading, thankYouGreeting.error,
    apiKey, authToken
  ]);

  return {
    // Data
    greetings: {
      default: defaultGreeting,
      goodDay: goodDayGreeting,
      thankYou: thankYouGreeting
    },
    
    // Auth state
    auth: {
      apiKey,
      setApiKey,
      authToken,
      setAuthToken
    },
    
    // Actions
    actions: {
      getPersonalGreeting,
      clearCache,
      refresh: () => {
        defaultGreeting.refetch?.();
        if (apiKey) goodDayGreeting.refetch?.();
        if (authToken) thankYouGreeting.refetch?.();
      }
    },
    
    // Computed state
    ...computed
  };
}

