// Auto-Generated Web Router for Voila Framework
// Discovers and mounts all feature routes automatically

import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebDiscovery, WebDiscoveryResult, WebRouteInfo } from './web-discovery.js';
import { webContractRegistry } from './web-contracts.js';

// ES module path resolution for React component
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface WebRouterProps {
  fallbackComponent?: React.ComponentType;
  loadingComponent?: React.ComponentType;
  notFoundComponent?: React.ComponentType;
}

interface RouteComponentProps {
  route: WebRouteInfo;
}

// Default loading component
const DefaultLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

// Default 404 component
const DefaultNotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <a href="/" className="text-blue-500 hover:text-blue-600 underline">
        Go back home
      </a>
    </div>
  </div>
);

// Route component wrapper with error boundary
const RouteComponent: React.FC<RouteComponentProps> = ({ route }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Dynamic import of the route component - use proper path resolution
        const { pathToFileURL } = await import('url');
        const componentUrl = pathToFileURL(route.componentPath).href;
        const componentModule = await import(/* @vite-ignore */ componentUrl);
        const ComponentClass = componentModule.default || 
                              componentModule[route.component] ||
                              componentModule[`${route.component}Page`];

        if (!ComponentClass) {
          throw new Error(`Component '${route.component}' not found in ${route.componentPath}`);
        }

        setComponent(() => ComponentClass);
      } catch (err: any) {
        console.error(`Failed to load component ${route.app}/${route.feature}/${route.component}:`, err);
        setError(err.message);
      }
    };

    loadComponent();
  }, [route]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Component Load Error</h2>
          <p className="mb-2">{error}</p>
          <p className="text-sm text-gray-500">
            Route: {route.path} ({route.app}/{route.feature})
          </p>
        </div>
      </div>
    );
  }

  if (!Component) {
    return <DefaultLoading />;
  }

  return <Component />;
};

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; protected?: boolean }> = ({ 
  children, 
  protected: isProtected 
}) => {
  // TODO: Implement actual authentication logic
  const isAuthenticated = true; // Placeholder

  if (isProtected && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const WebRouter: React.FC<WebRouterProps> = ({
  fallbackComponent: FallbackComponent,
  loadingComponent: LoadingComponent = DefaultLoading,
  notFoundComponent: NotFoundComponent = DefaultNotFound
}) => {
  const [discovery, setDiscovery] = useState<WebDiscoveryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const discoverRoutes = async () => {
      try {
        // Get web path relative to current file location
        const webPath = path.join(__dirname, '..', 'web');
        const webDiscovery = new WebDiscovery(webPath);
        
        const result = await webDiscovery.discover();
        setDiscovery(result);

        // Log discovery results for debugging
        console.log('🚀 WebRouter: Discovery completed', {
          apps: result.apps,
          features: result.totalFeatures,
          routes: result.totalRoutes
        });

        // Generate route manifest for debugging
        if (process.env.NODE_ENV === 'development') {
          const manifest = webDiscovery.generateRouteManifest(result);
          console.log('📋 Route Manifest:', manifest);
        }

      } catch (err: any) {
        console.error('❌ WebRouter: Discovery failed', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    discoverRoutes();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold mb-4">Router Error</h1>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!discovery || discovery.routes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">No Routes Discovered</h1>
          <p className="text-gray-600 mb-4">
            No web features found in src/web/*/features/
          </p>
          <p className="text-sm text-gray-500">
            Create a feature with a contract to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {/* Auto-generated routes from discovered features */}
        {discovery.routes.map((route, index) => (
          <Route
            key={`${route.app}-${route.feature}-${route.path}-${index}`}
            path={route.path}
            element={
              <ProtectedRoute protected={route.protected}>
                <RouteComponent route={route} />
              </ProtectedRoute>
            }
          />
        ))}

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<NotFoundComponent />} />
      </Routes>
    </Suspense>
  );
};

// Helper hook for accessing route discovery data
export const useWebRoutes = () => {
  const contracts = webContractRegistry.getAll();
  const routes = contracts.flatMap(contract => 
    contract.routes.handles.map(route => ({
      path: route.path,
      component: route.component,
      app: contract.app,
      feature: contract.name,
      protected: route.protected || false
    }))
  );

  return {
    contracts,
    routes,
    totalRoutes: routes.length,
    totalApps: new Set(contracts.map(c => c.app)).size,
    totalFeatures: contracts.length
  };
};

export default WebRouter;