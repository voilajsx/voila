/**
 * Voila Web Framework - Root Application Component
 * @file src/web/App.tsx
 * 
 * Auto-discovery routing with contract-driven architecture
 */

import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@voilajsx/uikit/theme-provider';
import { VoilaStateProvider } from '@lib/web-providers';
import { loadComponentFromPath } from '@lib/web-routes';
import { getContractSeoForRoute, applySeoConfig } from '@lib/web-seo';

// Import SEO module to trigger auto-initialization
import '@lib/web-seo';

// Loading component
const LoadingPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading Voila Framework...</p>
    </div>
  </div>
);

// 404 page
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
      <a 
        href="/" 
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg shadow transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

// Dynamic route component that loads based on URL
const DynamicRoute: React.FC = () => {
  const location = useLocation();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const ComponentClass = await loadComponentFromPath(location.pathname);
        
        if (!ComponentClass) {
          setError('Component not found');
          return;
        }

        // Apply SEO automatically from contracts
        const seoConfig = getContractSeoForRoute(location.pathname);
        if (seoConfig) {
          applySeoConfig(seoConfig, {});
        }

        setComponent(() => ComponentClass);
      } catch (err: any) {
        console.error(`Failed to load component for ${location.pathname}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [location.pathname]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !Component) {
    return <NotFoundPage />;
  }

  return <Component />;
};

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1
    }
  }
});

const App: React.FC = () => {
  // Direct environment variable reading
  const theme = import.meta.env.VITE_THEME || 'default';
  const mode = import.meta.env.VITE_MODE || 'light';
  
  // Clear localStorage on mount to force environment config
  React.useEffect(() => {
    localStorage.removeItem('vite-ui-theme');
    console.log('🎨 Theme from environment:', theme, mode);
  }, [theme, mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <VoilaStateProvider 
        initialState={{
          theme: mode as 'light' | 'dark',
          apiEnvironment: 'development',
          notifications: []
        }}
      >
        <ThemeProvider 
          theme={theme} 
          mode={mode}
          forceConfig={true}
          storageKey="vite-ui-theme"
        >
          <BrowserRouter>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/*" element={<DynamicRoute />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </VoilaStateProvider>
    </QueryClientProvider>
  );
};

export default App;