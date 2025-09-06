/**
 * Hello Frontend Feature Types
 * @file src/web/apps/greeting/features/hello/types/hello.d.ts
 * 
 * Type definitions matching backend API responses
 */

// Backend API response type (matching hello.models.ts in backend)
export interface HelloData {
  greetings: string[];
  name: string;
  language_count: number;
  timestamp: string;
  requestId: string;
  feature: string;
}

export interface HelloResponse {
  success: boolean;
  data: HelloData;
  error?: string;
}

// API Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Language types
export type SupportedLanguage = 'english' | 'spanish' | 'french';

// Frontend-specific state types
export interface GreetingState {
  currentGreeting: HelloResponse | null;
  loading: boolean;
  error: ApiError | null;
  selectedLanguage: SupportedLanguage;
}

export interface AuthState {
  apiKey: string;
  authToken: string;
  isAuthenticated: boolean;
}

// UI Component props with better type safety
export interface GreetingCardProps {
  greeting: HelloResponse;
  language: SupportedLanguage;
  loading?: boolean;
  onRetry?: () => void;
}

export interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  disabled?: boolean;
}

export interface AuthFormProps {
  onApiKeyChange: (apiKey: string) => void;
  onAuthTokenChange: (token: string) => void;
  apiKey: string;
  authToken: string;
}

// React Query types import for actual return types
import type { UseQueryResult } from '@tanstack/react-query';

// Hook return types
export interface UseHelloReturn {
  greetings: {
    default: UseQueryResult<HelloResponse, Error>;
    goodDay: UseQueryResult<HelloResponse, Error>;
    thankYou: UseQueryResult<HelloResponse, Error>;
  };
  auth: AuthState & {
    setApiKey: (key: string) => void;
    setAuthToken: (token: string) => void;
  };
  actions: {
    getPersonalGreeting: (name: string) => UseQueryResult<HelloResponse, Error> | null;
    clearCache: () => void;
    refresh: () => void;
  };
  isLoading: boolean;
  hasError: boolean;
  isReady: boolean;
  hasApiKey: boolean;
  hasAuthToken: boolean;
  canShowGoodDay: boolean;
  canShowThankYou: boolean;
}