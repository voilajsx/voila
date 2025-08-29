/**
 * Voila Web Framework - Root Application Component
 * @file src/web/app.tsx
 * 
 * Auto-discovery based React application root with 3-option fallback routing
 */

import React, { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Default loading component
const AppLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-foreground font-medium">Loading Voila App...</p>
      <p className="text-muted-foreground text-sm mt-2">Discovering features and routes</p>
    </div>
  </div>
);

// Default 404 component
const AppNotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The page you're looking for doesn't exist or hasn't been implemented yet.
      </p>
      <div className="space-y-2">
        <a 
          href="/" 
          className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Home
        </a>
        <p className="text-sm text-muted-foreground">
          Check the console for route discovery information
        </p>
      </div>
    </div>
  </div>
);

// Error boundary for router failures
const AppError: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center max-w-md">
      <h1 className="text-4xl font-bold text-destructive mb-4">⚠️ Router Error</h1>
      <p className="text-foreground mb-4">
        Failed to initialize the application router. This usually means there's an issue with feature discovery.
      </p>
      <div className="bg-muted p-4 rounded-md text-left mb-4">
        <p className="text-sm text-muted-foreground">
          <strong>Debug steps:</strong>
        </p>
        <ol className="text-sm text-muted-foreground mt-2 space-y-1">
          <li>1. Check browser console for errors</li>
          <li>2. Verify feature contracts exist in src/web/*/features/</li>
          <li>3. Ensure contract files export valid contracts</li>
          <li>4. Check component files exist and export default</li>
        </ol>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
      >
        Reload Application
      </button>
    </div>
  </div>
);

/**
 * Auto-Discovery Router with 3-Option Fallback System
 * For any path like /a/b/c/d:
 * Option 1: a/b/pages/c-d.tsx (app=a, feature=b, page=c-d)
 * Option 2: a/home/pages/b-c-d.tsx (app=a, feature=home, page=b-c-d) 
 * Option 3: main/home/pages/a-b-c-d.tsx (app=main, feature=home, page=a-b-c-d)
 */
const AutoDiscoveryRouter: React.FC = () => {
  const location = useLocation();
  const [RouteComponent, setRouteComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const discoverRoute = async () => {
      setLoading(true);
      setNotFound(false);
      
      const path = location.pathname;
      const segments = path.split('/').filter(Boolean);
      
      // Root path -> main/home/pages/root.tsx
      if (segments.length === 0) {
        try {
          const module = await import('./main/features/home/pages/root.tsx');
          setRouteComponent(() => module.default);
          console.log('✅ Route found: / -> main/home/pages/root.tsx');
          return;
        } catch (error) {
          console.warn('❌ Root route not found: main/home/pages/root.tsx');
          setNotFound(true);
          return;
        }
      }

      // 3-Option Discovery System
      const options = [];
      
      if (segments.length >= 2) {
        // Option 1: app/feature/pages/remaining.tsx
        const [app, feature, ...pageSegments] = segments;
        const pageName = pageSegments.length > 0 ? pageSegments.join('-') : 'root';
        options.push({
          path: `./${app}/features/${feature}/pages/${pageName}.tsx`,
          description: `${app}/${feature}/pages/${pageName}.tsx`
        });
      }
      
      if (segments.length >= 1) {
        // Option 2: app/home/pages/remaining.tsx  
        const [app, ...pageSegments] = segments;
        const pageName = pageSegments.length > 0 ? pageSegments.join('-') : 'root';
        options.push({
          path: `./${app}/features/home/pages/${pageName}.tsx`,
          description: `${app}/home/pages/${pageName}.tsx`
        });
      }
      
      // Option 3: main/home/pages/all-segments.tsx
      const allPageName = segments.join('-');
      options.push({
        path: `./main/features/home/pages/${allPageName}.tsx`,
        description: `main/home/pages/${allPageName}.tsx`
      });

      // Try each option in order
      for (const option of options) {
        try {
          const module = await import(/* @vite-ignore */ option.path);
          setRouteComponent(() => module.default);
          console.log(`✅ Route found: ${path} -> ${option.description}`);
          return;
        } catch (error) {
          console.warn(`⚠️  Option failed: ${option.description}`);
        }
      }
      
      console.error(`❌ No route found for: ${path}`);
      setNotFound(true);
    };

    discoverRoute().finally(() => setLoading(false));
  }, [location.pathname]);

  if (loading) return <AppLoading />;
  if (notFound || !RouteComponent) return <AppNotFound />;
  
  return (
    <Suspense fallback={<AppLoading />}>
      <RouteComponent />
    </Suspense>
  );
};

/**
 * Root application component with auto-discovery router
 */
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AutoDiscoveryRouter />
    </div>
  );
};

export default App;