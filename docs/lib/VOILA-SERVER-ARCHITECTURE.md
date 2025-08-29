# Voila Framework - Server Architecture & Discovery System

**Deep dive into Voila's auto-discovery server architecture and production-ready features.**

## Architecture Overview

Voila's server follows a **contract-driven, auto-discovery architecture** that automatically finds, validates, and mounts API features without manual configuration.

### Core Components

```
Server Startup Sequence:
1. Contract Validation → 2. Route Discovery → 3. Event Listeners → 4. Error Handling → 5. HTTP Server
```

### Key Files
- **`src/server.ts`** - Main server with AppKit integration and graceful shutdown
- **`src/lib/discovery.ts`** - Auto-discovery engine for routes and events
- **`src/lib/contracts.ts`** - Contract validation and registry system

## Server Startup Process

### 1. Environment Setup
```typescript
// AppKit service initialization in dependency order
const util = utilClass.get();
const config = configClass.get();
const logger = loggerClass.get('server');
const error = errorClass.get();
const security = securityClass.get();
```

### 2. Contract Validation Phase
```typescript
async function initializeContracts(): Promise<void> {
  // Production optimization: skip runtime validation
  if (NODE_ENV === 'production') {
    logger.info('Production mode: skipping contract validation');
    return;
  }
  
  // Development: validate all contracts
  const apiPath = join(__dirname, 'api');
  const result = await validateAllApps(apiPath);
  
  // Fail fast on contract violations
  if (!result.success) {
    throw new Error(`Contract validation failed: ${result.errors}`);
  }
}
```

### 3. Route Discovery Phase
```typescript
async function initializeRoutes(): Promise<void> {
  // Initialize discovery with contract registry
  apiDiscovery = new ApiDiscovery(join(__dirname, 'api'), contractRegistry);
  
  // Auto-mount all discovered routes
  discoveryResult = await apiDiscovery.mountRoutes(app);
  
  logger.info('API discovery completed', {
    totalFeatures: discoveryResult.totalFeatures,
    totalApps: discoveryResult.apps.length
  });
}
```

### 4. Event Listener Initialization
```typescript
// Initialize cross-app event listeners
if (apiDiscovery && discoveryResult) {
  await apiDiscovery.initializeEventListeners(discoveryResult);
}
```

### 5. Middleware Pipeline Setup
```typescript
// CRITICAL ORDER for AppKit compatibility:
// 1. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Security middleware
app.use('/api', security.requests(100, 900000)); // Rate limiting

// 3. Request logging and tracing
app.use((req, res, next) => {
  req.requestId = util.uuid();
  req.logger = logger.child({ requestId: req.requestId });
  // Request timing and completion logging
});

// 4. Routes (auto-mounted by discovery)
// 5. 404 handler (after routes)
// 6. Error handling (MUST be last)
```

## Auto-Discovery System

### Discovery Engine (`src/lib/discovery.ts`)

The discovery engine automatically finds and mounts API features using filesystem conventions.

#### Filesystem Convention
```
src/api/
├── myapp/                          # Application
│   ├── features/                   # Feature isolation
│   │   └── greeting/               # Feature module
│   │       ├── greeting.index.ts  # Contract (required for discovery)
│   │       ├── greeting.routes.ts # Routes (required for mounting)
│   │       └── greeting.services.ts # Event listeners (optional)
```

#### Discovery Process
```typescript
class ApiDiscovery {
  // 1. Filesystem scan
  discover(): DiscoveryResult {
    // Scan src/api/*/features/*/ directories
    // Find *.routes.ts and *.services.ts files
    // Return discovered routes and event listeners
  }
  
  // 2. Route mounting
  async mountRoutes(router: Router): Promise<DiscoveryResult> {
    for (const route of discoveredRoutes) {
      // Contract validation
      const contract = contractRegistry.getContract(`${route.app}.${route.feature}`);
      
      // Dynamic ES module import
      const routeModule = await import(`file://${route.path}`);
      const featureRouter = routeModule.default;
      
      // Mount at conventional path: /api/{app}/{feature}
      router.use(route.mountPath, featureRouter);
    }
  }
  
  // 3. Event listener initialization
  async initializeEventListeners(discovery: DiscoveryResult): Promise<void> {
    for (const listener of discovery.eventListeners) {
      const serviceModule = await import(`file://${listener.path}`);
      const initFunction = serviceModule.initializeEventListeners;
      await initFunction(); // Initialize cross-app communication
    }
  }
}
```

### Route Discovery
```typescript
// Convention: {feature}.routes.ts exports Express router
const routeFileName = `${featureName}.routes.ts`;
const mountPath = `/api/${appName}/${featureName}`;

// Example discovered route:
{
  app: 'climate',
  feature: 'weather', 
  path: '/Users/.../weather.routes.ts',
  mountPath: '/api/climate/weather'
}
```

### Event Listener Discovery
```typescript
// Convention: {feature}.services.ts with initializeEventListeners export
const serviceFileName = `${featureName}.services.ts`;

// Scans for files containing:
// export function initializeEventListeners() { ... }

// Auto-initializes cross-app event communication
```

## Built-in Endpoints

### Health Monitoring
```typescript
// Primary health endpoint - Kubernetes/Docker compatible
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: '1.0.0',
    requestId: util.uuid()
  });
});
```

### Live API Documentation
```typescript
// Self-documenting API endpoint
app.get('/api', (req, res) => {
  const docs = apiDiscovery.generateApiDocs(discoveryResult);
  const contractSummary = contractRegistry.getContractSummary();
  
  res.json({
    message: 'Voila Framework API',
    environment: NODE_ENV,
    contracts: { validated: true, ...contractSummary },
    ...docs
  });
});
```

### OpenAPI Specification
```typescript
// Standards-compliant OpenAPI/Swagger endpoint
app.get('/api/openapi', (req, res) => {
  const openapi = contractRegistry.generateOpenAPI();
  res.json(openapi);
});
```

### App-Specific Health Checks
```typescript
// Example: Climate app health check
app.get('/api/climate/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'climate',
    features: { weather: 'active', search: 'active' },
    externalServices: { openweathermap: 'connected' }
  });
});
```

## Production Features

### Graceful Shutdown
```typescript
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info('Shutdown signal received', { signal });
  
  try {
    // 1. Stop accepting new connections
    await new Promise<void>((resolve) => server.close(() => resolve()));
    
    // 2. Flush and close AppKit services
    await logger.flush();
    await logger.close();
    
    process.exit(0);
  } catch (err: any) {
    logger.error('Error during graceful shutdown', { error: err.message });
    process.exit(1);
  }
};

// Container orchestration signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Kubernetes
process.on('SIGINT', () => gracefulShutdown('SIGINT'));   // Ctrl+C / Docker
```

### Request Tracing
```typescript
app.use((req, res, next) => {
  // Generate unique request ID for tracing
  req.requestId = util.uuid();
  req.logger = logger.child({
    requestId: req.requestId,
    method: req.method,
    url: req.url
  });

  // Track request duration
  const startTime = Date.now();
  res.on('finish', () => {
    req.logger.info('Request completed', {
      statusCode: res.statusCode,
      duration: Date.now() - startTime
    });
  });

  next();
});
```

### Security & Rate Limiting
```typescript
// AppKit security with rate limiting
app.use('/api', security.requests(100, 900000)); // 100 requests per 15 minutes

// Request size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### Error Handling
```typescript
// 404 handler for API routes (MUST be after route mounting)
app.use('/api/*', (req, res, next) => {
  const requestId = util.uuid();
  logger.warn('API endpoint not found', {
    requestId,
    path: req.path,
    method: req.method
  });
  
  const notFoundError = error.notFound(`API endpoint not found: ${req.method} ${req.path}`);
  next(notFoundError);
});

// Global error handler (MUST be last middleware)
app.use(error.handleErrors({
  showStack: NODE_ENV === 'development',
  logErrors: true
}));
```

## Development vs Production

### Development Mode
- ✅ Runtime contract validation
- ✅ Detailed error messages and stack traces
- ✅ Hot reload support via nodemon
- ✅ Debug logging enabled
- ✅ Graceful error recovery

### Production Mode
- ✅ Skips runtime contract validation (performance optimization)
- ✅ Minimal error messages (security)
- ✅ Performance monitoring
- ✅ Graceful shutdown support
- ✅ Container orchestration ready

### Environment Detection
```typescript
const NODE_ENV = config.get('server.env', process.env.NODE_ENV || 'development');

// Environment-specific behavior
if (NODE_ENV === 'production') {
  // Skip validation, enable production optimizations
} else {
  // Enable development features, detailed logging
}
```

## Discovery System Integration

### Contract Integration
```typescript
// Discovery validates against contracts during mounting
for (const route of discovery.routes) {
  const contractKey = `${route.app}.${route.feature}`;
  const contract = contractRegistry.getContract(contractKey);
  
  if (!contract) {
    console.error(`Feature ${route.app}/${route.feature} has no contract - skipping`);
    continue;
  }
  
  // Mount only if contract exists and is valid
  router.use(route.mountPath, featureRouter);
}
```

### Live Documentation Generation
```typescript
generateApiDocs(discovery: DiscoveryResult): any {
  const docs = {
    framework: 'voila',
    version: '1.0.0',
    discovery: {
      apps: discovery.apps.length,
      features: discovery.totalFeatures,
      timestamp: new Date().toISOString()
    },
    endpoints: {}
  };

  // Group discovered routes by app
  for (const route of discovery.routes) {
    if (!docs.endpoints[route.app]) {
      docs.endpoints[route.app] = {};
    }
    docs.endpoints[route.app][route.feature] = route.mountPath;
  }

  return docs;
}
```

### Event System Integration
```typescript
// Cross-app event communication through discovery
async initializeEventListeners(discovery: DiscoveryResult): Promise<void> {
  for (const eventListener of discovery.eventListeners) {
    try {
      // Dynamic import of service module
      const serviceModule = await import(`file://${eventListener.path}`);
      const initFunction = serviceModule.initializeEventListeners;
      
      if (typeof initFunction === 'function') {
        await initFunction();
        console.log(`📥 Initialized event listeners: ${eventListener.app}/${eventListener.feature}`);
      }
    } catch (error) {
      console.error(`❌ Failed to initialize event listeners: ${eventListener.path}`);
    }
  }
}
```

## Monitoring & Debugging

### Server Metrics
```typescript
// Available at /health endpoint
{
  "status": "ok",
  "uptime": 1825.234,
  "environment": "development",
  "discovery": {
    "totalApps": 3,
    "totalFeatures": 12,
    "lastDiscovery": "2024-08-27T10:30:00.000Z"
  },
  "performance": {
    "memoryUsage": {...},
    "cpuUsage": {...}
  }
}
```

### Discovery Logging
```console
🔍 API Discovery completed:
   Apps found: 3
   Features found: 12
   Event listeners found: 6

✅ Contract validated for climate.weather
✅ Contract validated for climate.search
🚀 Mounted: /api/climate/weather -> weather.routes.ts
🚀 Mounted: /api/climate/search -> search.routes.ts
📥 Initialized event listeners: climate/weather -> weather.services.ts
```

### Request Tracing
```console
[2024-08-27T10:30:15.123Z] INFO: Request started
  requestId: "req_abc123"
  method: "GET"
  url: "/api/climate/weather/current"
  
[2024-08-27T10:30:15.456Z] INFO: Request completed
  requestId: "req_abc123"
  statusCode: 200
  duration: 333
```

## Best Practices

### Server Configuration
- **Environment Variables**: Use AppKit config for all environment-specific settings
- **Security**: Always use AppKit security middleware for rate limiting and request validation
- **Logging**: Use structured logging with request IDs for traceability
- **Error Handling**: Implement proper error middleware as the last middleware

### Discovery Optimization
- **File Naming**: Follow strict naming conventions for automatic discovery
- **Contract Validation**: Always validate contracts in development, skip in production
- **Error Recovery**: Handle discovery failures gracefully - server should start even if some features fail
- **Caching**: Cache discovery results for performance in large codebases

### Production Deployment
- **Health Checks**: Use `/health` endpoint for container orchestration
- **Graceful Shutdown**: Implement proper SIGTERM/SIGINT handling
- **Performance**: Skip contract validation in production for startup speed
- **Monitoring**: Monitor discovery metrics and API endpoint usage

### Development Workflow
- **Hot Reload**: Use nodemon for development with file watching
- **Debug Mode**: Enable detailed logging and error messages in development
- **Contract Changes**: Restart server after contract modifications
- **New Features**: Restart server after adding new features for discovery

## Troubleshooting

### Common Discovery Issues
```bash
# Feature not discovered
Issue: Routes not mounting automatically
Fix: Check file naming convention (feature.routes.ts)
Fix: Ensure contract exists (feature.index.ts)
Fix: Restart server after adding new features

# Contract validation failures
Issue: Contract validation failed
Fix: Run 'npm run validate app:api' to see specific errors
Fix: Ensure contract structure matches interface

# Event listeners not initializing
Issue: Cross-app events not working
Fix: Check for 'export function initializeEventListeners()' in services file
Fix: Restart server after adding event listeners
```

### Performance Issues
```bash
# Slow server startup
Issue: Long startup time in development
Fix: Use 'none' validation level during development
Fix: Optimize contract complexity
Fix: Cache discovery results

# Memory usage
Issue: High memory usage
Fix: Review event listener cleanup
Fix: Optimize contract registry size
Fix: Use production mode optimizations
```

### Integration Problems
```bash
# AppKit middleware conflicts
Issue: Middleware not working correctly
Fix: Check middleware order (parsing → security → logging → routes → error)
Fix: Ensure AppKit modules are initialized in dependency order

# Container deployment issues
Issue: Health checks failing
Fix: Ensure /health endpoint is accessible
Fix: Check graceful shutdown implementation
Fix: Verify container has proper signal handling
```

---

**The Result**: A production-ready server architecture that automatically discovers, validates, and mounts API features while providing enterprise-grade monitoring, security, and deployment capabilities.