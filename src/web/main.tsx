/**
 * Voila Web Framework - Main Entry Point
 * @file src/web/main.tsx
 * 
 * React application entry point with contract-driven auto-discovery
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@voilajsx/uikit/theme-provider';

// Import UIKit styles - REQUIRED for all components
import '@voilajsx/uikit/styles';

// Import root app component
import App from './app.js';

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1
    }
  }
});

// Get root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// React 18 concurrent features
const root = ReactDOM.createRoot(rootElement);

// Application with providers
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme="default" mode="light">
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);