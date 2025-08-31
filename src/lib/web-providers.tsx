/**
 * Voila Framework React Providers
 * @file src/lib/web-providers.tsx
 * 
 * JSX components for providing global state
 */

import React, { useState, createContext } from 'react';

export interface VoilaGlobalState {
  user?: { id: string; name: string; role: string };
  theme: 'light' | 'dark';
  apiEnvironment: 'development' | 'staging' | 'production';
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
}

export const VoilaStateContext = createContext<{
  state: VoilaGlobalState;
  setState: React.Dispatch<React.SetStateAction<VoilaGlobalState>>;
} | null>(null);

/**
 * Voila State Provider - Wrap your app with this
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