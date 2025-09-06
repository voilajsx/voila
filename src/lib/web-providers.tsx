/**
 * Voila Framework React Providers - Global state management for web applications
 * @file src/lib/web-providers.tsx
 * 
 * @llm-rule WHEN: Web apps need global state management for user, theme, notifications
 * @llm-rule AVOID: Redux or complex state managers - use React Context for simple cases
 * @llm-rule PATTERN: Context provider with typed state interface
 * @llm-rule NOTE: Lightweight alternative to Redux for basic global state needs
 * 
 * Provides React Context providers for managing application-wide state including:
 * - User authentication state
 * - Theme preferences (light/dark mode)
 * - API environment configuration
 * - Global notification system
 */

import React, { useState, createContext } from 'react';

/**
 * Global state interface for Voila applications
 * Contains all application-wide state properties
 */
export interface VoilaGlobalState {
  /** Current authenticated user information */
  user?: { id: string; name: string; role: string };
  /** Current theme preference */
  theme: 'light' | 'dark';
  /** API environment configuration */
  apiEnvironment: 'development' | 'staging' | 'production';
  /** Global notification queue */
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
}

/**
 * React Context for Voila global state
 * Provides state and setState to consuming components
 */
export const VoilaStateContext = createContext<{
  state: VoilaGlobalState;
  setState: React.Dispatch<React.SetStateAction<VoilaGlobalState>>;
} | null>(null);

/**
 * Voila State Provider - Global state provider component
 * 
 * Wrap your application with this provider to enable global state management.
 * Provides React Context for accessing and updating application state across components.
 * 
 * @param children - Child components that will have access to global state
 * @param initialState - Optional initial state values to override defaults
 * @returns JSX provider component
 * 
 * @example
 * ```tsx
 * <VoilaStateProvider initialState={{ theme: 'dark' }}>
 *   <App />
 * </VoilaStateProvider>
 * ```
 */
export function VoilaStateProvider({ 
  children, 
  initialState = {
    theme: 'light',
    apiEnvironment: 'development',
    notifications: []
  }
}: {
  children: React.ReactNode;
  initialState?: Partial<VoilaGlobalState>;
}) {
  const [state, setState] = useState<VoilaGlobalState>({
    theme: 'light',
    apiEnvironment: 'development',
    notifications: [],
    ...initialState
  });

  return (
    <VoilaStateContext.Provider value={{ state, setState }}>
      {children}
    </VoilaStateContext.Provider>
  );
}