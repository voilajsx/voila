/**
 * Voila Web Framework - Main Entry Point
 * @file src/web/main.tsx
 * 
 * Simplified React application entry point for production compatibility
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import UIKit styles - REQUIRED for all components
import '@voilajsx/uikit/styles';

// Import root app component (App.tsx already includes BrowserRouter)
import App from './App';

// Get root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// React 18 concurrent features
const root = ReactDOM.createRoot(rootElement);

// Simplified application without problematic providers
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);