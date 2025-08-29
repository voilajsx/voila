# Voila Web Integration - Monolithic Frontend/Backend Architecture

**Complete guide for integrating React-based frontend into Voila's contract-driven backend architecture.**

## Architecture Overview

Voila Web extends the backend's contract-driven, auto-discovery architecture to the frontend, creating a unified monolithic application that runs on a single port in production while maintaining separate development workflows.

### Development vs Production Modes

```
Development Mode:
├── Backend: npm run dev:api (port 3001)
├── Frontend: npm run dev:web (port 5173) 
└── Proxy: Vite dev server proxies /api to backend

Production Mode:
├── Frontend: Built static files in dist/web/
├── Backend: Serves static files + API routes
└── Single Port: Everything runs on port 3001
```

## Project Structure

```
src/
├── api/                           # Backend (existing)
│   ├── myapp/
│   │   └── features/
│   │       └── greeting/
│   │           ├── greeting.index.ts      # Backend contract
│   │           ├── greeting.routes.ts     # API routes
│   │           └── greeting.services.ts   # Backend services
├── web/                           # Frontend (new)
│   ├── shared/                    # Shared utilities
│   │   ├── contracts/             # Contract registry
│   │   ├── services/              # API clients
│   │   └── ui/                    # UIKit integration
│   ├── myapp/                     # App-specific frontend
│   │   ├── features/
│   │   │   └── greeting/
│   │   │       ├── greeting.index.ts      # Frontend contract
│   │   │       ├── greeting.routes.tsx    # React routes
│   │   │       ├── greeting.components.tsx # UI components
│   │   │       └── greeting.services.ts   # Frontend services
│   │   ├── app.tsx                # App root
│   │   └── main.tsx               # Entry point
└── server.ts                      # Enhanced server (modified)
```

## Frontend Contract System

### Web Feature Contract Interface

```typescript
// src/web/shared/contracts/types.ts
export interface VoilaWebFeatureContract {
  name: string;
  app: string;
  description: string;
  validation: 'none' | 'basic' | 'essential' | 'strict';
  
  // Component system
  components: {
    provides: string[];        // Components this feature exports
    consumes: string[];        // Components this feature imports
  };
  
  // State management
  state: {
    manages: string[];         // State this feature owns
    subscribes: string[];      // External state this feature uses
  };
  
  // Routing
  routes: {
    handles: WebRoute[];       // Routes this feature handles
    redirects: WebRedirect[];  // Redirects this feature defines
  };
  
  // API integration
  api: {
    endpoints: string[];       // Backend endpoints this feature uses
    realtime: string[];        // WebSocket events this feature handles
  };
  
  // Dependencies
  dependencies: {
    files: Record<string, string>;  // File dependencies
    services: string[];             // Service dependencies
    external: string[];             // External libraries
  };
  
  // Testing
  tests: WebTestCase[];
}

export interface WebRoute {
  path: string;
  component: string;
  protected?: boolean;
  exact?: boolean;
}

export interface WebRedirect {
  from: string;
  to: string;
  condition?: string;
}

export interface WebTestCase {
  type: 'component' | 'integration' | 'e2e';
  description: string;
  coverage: number;
}
```

### Frontend Feature Contract Example

```typescript
// src/web/myapp/features/greeting/greeting.index.ts
import { createWebFeatureContract } from '@/web/shared/contracts';

export const GreetingWebContract: VoilaWebFeatureContract = createWebFeatureContract({
  name: 'greeting',
  app: 'myapp',
  description: 'Interactive greeting UI with real-time updates',
  validation: 'essential',
  
  components: {
    provides: ['GreetingCard', 'HelloButton', 'StatusIndicator'],
    consumes: ['Button', 'Card', 'LoadingSpinner']
  },
  
  state: {
    manages: ['greetingState', 'userPreferences'],
    subscribes: ['authState', 'appTheme']
  },
  
  routes: {
    handles: [
      { path: '/greeting', component: 'GreetingPage', exact: true },
      { path: '/greeting/:id', component: 'GreetingDetail', protected: true }
    ],
    redirects: [
      { from: '/hello', to: '/greeting', condition: 'authenticated' }
    ]
  },
  
  api: {
    endpoints: ['/api/myapp/greeting/hello', '/api/myapp/greeting/status'],
    realtime: ['greeting:update', 'user:status']
  },
  
  dependencies: {
    files: {
      'greeting.components.tsx': './greeting.components.tsx',
      'greeting.services.ts': './greeting.services.ts'
    },
    services: ['ApiService', 'WebSocketService'],
    external: ['@tanstack/react-query', 'socket.io-client']
  },
  
  tests: [
    { type: 'component', description: 'GreetingCard renders correctly', coverage: 95 },
    { type: 'integration', description: 'API integration works', coverage: 85 },
    { type: 'e2e', description: 'Complete greeting flow', coverage: 90 }
  ]
});

export default GreetingWebContract;
```

## Enhanced Server Configuration

### Modified `src/server.ts`

```typescript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiDiscovery } from './lib/discovery.js';
import { validateAllApps } from './lib/contracts.js';
import { WebDiscovery } from './lib/web-discovery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// AppKit initialization (existing)
const config = configClass.get();
const logger = loggerClass.get('server');
const util = utilClass.get();

async function startServer() {
  try {
    // 1. Contract validation (existing + new web contracts)
    if (NODE_ENV !== 'production') {
      await validateAllApps(path.join(__dirname, 'api'));
      await validateAllWebApps(path.join(__dirname, 'web'));
    }

    // 2. Middleware setup (existing)
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // 3. API routes discovery (existing)
    const apiDiscovery = new ApiDiscovery(path.join(__dirname, 'api'));
    await apiDiscovery.mountRoutes(app);
    
    // 4. NEW: Static file serving (production only)
    if (NODE_ENV === 'production') {
      const webDistPath = path.join(__dirname, '..', 'dist', 'web');
      
      // Serve static assets
      app.use('/assets', express.static(path.join(webDistPath, 'assets')));
      app.use('/favicon.ico', express.static(path.join(webDistPath, 'favicon.ico')));
      
      // Serve React app for all non-API routes
      app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
          return next();
        }
        
        // Serve React app
        res.sendFile(path.join(webDistPath, 'index.html'));
      });
    }
    
    // 5. NEW: Development mode proxy info
    if (NODE_ENV === 'development') {
      app.get('/dev-info', (req, res) => {
        res.json({
          mode: 'development',
          backend: `http://localhost:${PORT}`,
          frontend: 'http://localhost:5173',
          note: 'In development, frontend runs on separate Vite dev server'
        });
      });
    }

    // 6. Health check (existing)
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        mode: NODE_ENV,
        timestamp: new Date().toISOString(),
        services: {
          api: 'active',
          web: NODE_ENV === 'production' ? 'integrated' : 'separate'
        }
      });
    });

    // 7. API documentation (enhanced)
    app.get('/api', (req, res) => {
      const apiDocs = apiDiscovery.generateApiDocs();
      const webInfo = NODE_ENV === 'production' ? 
        { integrated: true, served: 'static' } : 
        { integrated: false, devServer: 'http://localhost:5173' };
        
      res.json({
        message: 'Voila Framework - Full Stack API',
        environment: NODE_ENV,
        architecture: 'monolithic',
        web: webInfo,
        ...apiDocs
      });
    });

    // 8. Error handling (existing)
    app.use('/api/*', (req, res, next) => {
      const notFoundError = error.notFound(`API endpoint not found: ${req.method} ${req.path}`);
      next(notFoundError);
    });

    app.use(error.handleErrors({
      showStack: NODE_ENV === 'development',
      logErrors: true
    }));

    // 9. Start server
    app.listen(PORT, () => {
      logger.info('Voila server started', {
        port: PORT,
        environment: NODE_ENV,
        architecture: 'monolithic',
        services: {
          api: 'active',
          web: NODE_ENV === 'production' ? 'integrated' : 'development-proxy'
        }
      });
    });

  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

// Graceful shutdown (existing)
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();
```

## Web Discovery System

### `src/lib/web-discovery.ts`

```typescript
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { VoilaWebFeatureContract } from '../web/shared/contracts/types.js';

export interface WebDiscoveryResult {
  apps: string[];
  features: WebFeatureInfo[];
  routes: WebRouteInfo[];
  totalFeatures: number;
}

export interface WebFeatureInfo {
  app: string;
  feature: string;
  path: string;
  contract: VoilaWebFeatureContract;
}

export interface WebRouteInfo {
  app: string;
  feature: string;
  path: string;
  component: string;
  route: string;
}

export class WebDiscovery {
  constructor(private webPath: string) {}

  async discover(): Promise<WebDiscoveryResult> {
    const webApps = this.findWebApps();
    const features: WebFeatureInfo[] = [];
    const routes: WebRouteInfo[] = [];

    for (const app of webApps) {
      const appFeatures = await this.discoverAppFeatures(app);
      features.push(...appFeatures);
      
      for (const feature of appFeatures) {
        const featureRoutes = this.extractRoutes(feature);
        routes.push(...featureRoutes);
      }
    }

    return {
      apps: webApps,
      features,
      routes,
      totalFeatures: features.length
    };
  }

  private findWebApps(): string[] {
    const webPath = this.webPath;
    if (!fs.existsSync(webPath)) return [];

    return fs.readdirSync(webPath)
      .filter(item => {
        const itemPath = path.join(webPath, item);
        return fs.statSync(itemPath).isDirectory() && 
               item !== 'shared' && 
               fs.existsSync(path.join(itemPath, 'features'));
      });
  }

  private async discoverAppFeatures(app: string): Promise<WebFeatureInfo[]> {
    const featuresPath = path.join(this.webPath, app, 'features');
    if (!fs.existsSync(featuresPath)) return [];

    const features: WebFeatureInfo[] = [];
    const featureDirs = fs.readdirSync(featuresPath)
      .filter(item => fs.statSync(path.join(featuresPath, item)).isDirectory());

    for (const featureDir of featureDirs) {
      const contractPath = path.join(featuresPath, featureDir, `${featureDir}.index.ts`);
      
      if (fs.existsSync(contractPath)) {
        try {
          // Dynamic import of the contract
          const contractModule = await import(`file://${contractPath}`);
          const contract = contractModule.default || contractModule[`${featureDir}WebContract`];
          
          if (contract) {
            features.push({
              app,
              feature: featureDir,
              path: contractPath,
              contract
            });
          }
        } catch (error) {
          console.warn(`Failed to load web contract: ${contractPath}`, error);
        }
      }
    }

    return features;
  }

  private extractRoutes(feature: WebFeatureInfo): WebRouteInfo[] {
    return feature.contract.routes.handles.map(route => ({
      app: feature.app,
      feature: feature.feature,
      path: route.path,
      component: route.component,
      route: route.path
    }));
  }

  generateRouteManifest(discovery: WebDiscoveryResult): any {
    const manifest = {
      framework: 'voila-web',
      version: '1.0.0',
      generated: new Date().toISOString(),
      apps: {},
      totalRoutes: discovery.routes.length
    };

    for (const route of discovery.routes) {
      if (!manifest.apps[route.app]) {
        manifest.apps[route.app] = {};
      }
      if (!manifest.apps[route.app][route.feature]) {
        manifest.apps[route.app][route.feature] = [];
      }
      manifest.apps[route.app][route.feature].push({
        path: route.path,
        component: route.component
      });
    }

    return manifest;
  }
}

export async function validateAllWebApps(webPath: string): Promise<{ success: boolean; errors: string[] }> {
  const discovery = new WebDiscovery(webPath);
  const result = await discovery.discover();
  const errors: string[] = [];

  // Validate each contract
  for (const feature of result.features) {
    const validation = validateWebContract(feature.contract);
    if (!validation.valid) {
      errors.push(`${feature.app}/${feature.feature}: ${validation.errors.join(', ')}`);
    }
  }

  return {
    success: errors.length === 0,
    errors
  };
}

function validateWebContract(contract: VoilaWebFeatureContract): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!contract.name) errors.push('Missing required field: name');
  if (!contract.app) errors.push('Missing required field: app');
  if (!contract.validation) errors.push('Missing required field: validation');

  // Validation levels
  const validLevels = ['none', 'basic', 'essential', 'strict'];
  if (!validLevels.includes(contract.validation)) {
    errors.push(`Invalid validation level: ${contract.validation}`);
  }

  // Route validation
  if (contract.routes?.handles) {
    for (const route of contract.routes.handles) {
      if (!route.path) errors.push('Route missing path');
      if (!route.component) errors.push('Route missing component');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

## Development Workflow

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:web\"",
    "dev:api": "nodemon --watch src --ext ts,js src/server.ts",
    "dev:web": "vite --config vite.config.ts",
    
    "build": "npm run build:web && npm run build:api",
    "build:api": "tsc",
    "build:web": "vite build --config vite.config.ts",
    
    "start": "node dist/server.js",
    "preview": "npm run build && npm run start",
    
    "validate": "npm run validate:api && npm run validate:web",
    "validate:api": "node -e \"import('./src/lib/contracts.js').then(c => c.validateAllApps('./src/api'))\"",
    "validate:web": "node -e \"import('./src/lib/web-discovery.js').then(c => c.validateAllWebApps('./src/web'))\""
  }
}
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Development server
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist/web',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development'
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@web': path.resolve(__dirname, './src/web'),
      '@api': path.resolve(__dirname, './src/api')
    }
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
```

## Frontend Application Structure

### Main Entry Point

```typescript
// src/web/shared/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@voilajsx/uikit/theme-provider';
import '@voilajsx/uikit/styles';

import AppRouter from './AppRouter';
import { WebContractProvider } from './contracts/WebContractProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme="default" mode="light">
          <WebContractProvider>
            <AppRouter />
          </WebContractProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### App Router with Auto-Discovery

```typescript
// src/web/shared/AppRouter.tsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '@voilajsx/uikit/motion';
import { useWebContracts } from './contracts/useWebContracts';

// Auto-generated route components
const RouteComponents = import.meta.glob('../*/features/*/index.tsx');

export default function AppRouter() {
  const { contracts, loading } = useWebContracts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <Routes>
        {/* Auto-generated routes from contracts */}
        {contracts.flatMap(contract => 
          contract.routes.handles.map(route => {
            const Component = React.lazy(() => 
              import(`../${contract.app}/features/${contract.name}/${route.component}.tsx`)
            );
            
            return (
              <Route
                key={`${contract.app}-${contract.name}-${route.path}`}
                path={route.path}
                element={<Component />}
              />
            );
          })
        )}
        
        {/* Fallback routes */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
}
```

## Development Commands

```bash
# Development mode (separate servers)
npm run dev                    # Starts both API and Web dev servers
npm run dev:api               # Backend only (port 3001)
npm run dev:web               # Frontend only (port 5173)

# Production build
npm run build                 # Builds both API and Web
npm run build:api            # Backend only
npm run build:web            # Frontend only  

# Production server (monolithic)
npm run start                # Single server on port 3001

# Validation
npm run validate             # Validates both API and Web contracts
npm run validate:api         # Backend contracts only
npm run validate:web         # Frontend contracts only
```

## Production Deployment

### Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=3001
API_BASE_URL=/api

# Frontend build variables
VITE_API_BASE_URL=/api
VITE_APP_NAME=Voila Full Stack App
```

### Build Process

1. **Frontend Build**: Vite builds React app to `dist/web/`
2. **Backend Build**: TypeScript compiles to `dist/`
3. **Static Serving**: Server serves `dist/web/` for non-API routes
4. **Single Port**: Everything accessible via port 3001

### Deployment Architecture

```
Production Server (Port 3001):
├── /api/*           → Express API routes
├── /health          → Health check endpoint  
├── /assets/*        → Static assets (JS, CSS, images)
├── /favicon.ico     → Favicon
└── /*               → React SPA (index.html)
```

## Benefits of This Architecture

✅ **Unified Development**: Same contract-driven approach for frontend/backend
✅ **Monolithic Deployment**: Single server, single port in production
✅ **Separate Development**: Independent dev servers for optimal DX
✅ **Auto-Discovery**: Frontend routes discovered from contracts
✅ **Type Safety**: Shared types between frontend/backend
✅ **Validation**: 4-level validation system for web contracts
✅ **Scalable**: Feature-based architecture prevents coupling

This architecture provides the best of both worlds: development flexibility with production simplicity, all while maintaining Voila's core philosophy of contract-driven, auto-discovery development.