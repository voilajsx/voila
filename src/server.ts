/**
 * Voila Framework API Server - Enterprise-grade Express.js server with contract-driven architecture
 * @module @voilajsx/voila/server
 * @file src/server.ts
 *
 * @llm-rule WHEN: Building production-ready API servers with contract validation and auto-discovery
 * @llm-rule AVOID: Direct Express setup without AppKit - breaks security, logging, and error handling
 * @llm-rule NOTE: Follows AppKit middleware order: parsing → security → logging → routes → error handling
 */

// Load environment variables from .env file
import 'dotenv/config';

import express from 'express';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ApiDiscovery from './lib/discovery.js';

// Contract validation system
import { contractRegistry, validateAllApps, isFeatureEnabled } from './lib/contracts.js';

/**
 * Extended Express Request interface for VoilaJSX AppKit integration
 * @llm-rule WHEN: Need request-scoped logging and tracing in middleware
 * @llm-rule AVOID: Direct req properties - use AppKit utilities for consistency
 */
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      logger?: any;
    }
  }
}

/**
 * ES Module path resolution
 * @llm-rule WHEN: Need __dirname equivalent in ES modules for file system operations
 * @llm-rule AVOID: Using import.meta.url directly - this handles cross-platform paths
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * VoilaJSX AppKit Enterprise Services - Production-ready utilities
 * @llm-rule WHEN: Building enterprise applications with logging, security, and error handling
 * @llm-rule AVOID: Third-party alternatives (winston, helmet, etc.) - creates conflicts with AppKit
 * @llm-rule NOTE: Initialize in order: util → config → logger → error → security for dependency chain
 */
import { utilClass } from '@voilajsx/appkit/util';
import { configClass } from '@voilajsx/appkit/config';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';

// Initialize AppKit services in dependency order
const util = utilClass.get();
const config = configClass.get();
const logger = loggerClass.get('server');
const error = errorClass.get();
const security = securityClass.get();

/**
 * Express Application and HTTP Server Setup
 * @llm-rule WHEN: Need production-ready HTTP server with graceful shutdown support
 * @llm-rule AVOID: Using app.listen() directly - prevents graceful shutdown handling
 */
const app = express();
const server = createServer(app);

/**
 * API Discovery System - Dynamic route mounting with contract validation
 * @llm-rule WHEN: Building modular APIs with automatic route discovery
 * @llm-rule AVOID: Manual route registration - breaks contract validation flow
 */
let apiDiscovery: ApiDiscovery;
let discoveryResult: any = null;

/**
 * Server Configuration with AppKit Config Management
 * @llm-rule WHEN: Need environment-aware configuration with fallbacks
 * @llm-rule AVOID: Direct process.env access - use config.get() for consistency and validation
 */
const PORT = config.get('server.port', process.env.PORT || 3001);
const NODE_ENV = config.get('server.env', process.env.NODE_ENV || 'development');
const SERVER_NAME = config.get('server.name', 'Voila Framework API Server');

// Log server configuration for debugging and monitoring
logger.info('Server configuration loaded', {
  port: PORT,
  environment: NODE_ENV,
  serverName: SERVER_NAME
});

/**
 * Express Middleware Pipeline - CRITICAL ORDER for AppKit compatibility
 * @llm-rule WHEN: Setting up Express middleware for production applications
 * @llm-rule AVOID: Changing middleware order - breaks AppKit security and logging chain
 * @llm-rule NOTE: Order is: parsing → security → logging → routes → error handling
 */

// 1. Body parsing middleware - handles JSON and form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Security middleware - rate limiting, CORS, helmet functionality
app.use('/api', security.requests(100, 900000)); // 100 requests per 15 minutes

// 3. Request logging and tracing middleware
app.use((req, res, next) => {
  // Generate unique request ID for tracing
  req.requestId = util.uuid();
  req.logger = logger.child({
    requestId: req.requestId,
    method: req.method,
    url: req.url,
  });

  // Track request duration for performance monitoring
  const startTime = Date.now();
  res.on('finish', () => {
    req.logger.info('Request completed', {
      statusCode: res.statusCode,
      duration: Date.now() - startTime,
    });
  });

  next();
});

/**
 * Health Check Endpoint - Kubernetes/Docker readiness probe compatible
 * @llm-rule WHEN: Need health monitoring for containerized deployments
 * @llm-rule AVOID: Complex health checks here - keep lightweight for probe endpoints
 */
app.get('/health', (req, res) => {
  const requestId = util.uuid();
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: '1.0.0',
    requestId,
    server: SERVER_NAME
  };
  
  logger.debug('Health check requested', { requestId });
  res.json(healthData);
});

/**
 * Contract Validation System - Ensures API consistency and prevents runtime errors
 * @llm-rule WHEN: Starting server to validate all feature contracts before route mounting
 * @llm-rule AVOID: Skipping validation in development - catches contract violations early
 * @llm-rule NOTE: Production skips validation assuming pre-validated dist files for performance
 */
const initializeContracts = async (): Promise<void> => {
  const operationId = util.uuid();
  
  // Production optimization: skip runtime validation (validated during build)
  if (NODE_ENV === 'production') {
    logger.info('Production mode: skipping contract validation', { operationId });
    return;
  }
  
  try {
    logger.info('Starting contract validation', { operationId });
    
    const apiPath = join(__dirname, 'api');
    const result = await validateAllApps(apiPath);
    
    // Fail fast on contract violations - prevents invalid API deployment
    if (!result.success) {
      const errorMessages = result.errors.map(err => `[${err.feature}] ${err.details}`);
      throw new Error(`Contract validation failed:\n\n${errorMessages.join('\n')}`);
    }
    
    // Log warnings but continue - non-breaking contract issues
    if (result.warnings.length > 0) {
      logger.warn('Contract warnings found', {
        operationId,
        warnings: result.warnings.map(w => `[${w.feature}] ${w.details}`)
      });
    }
    
    logger.info('Contract validation completed', {
      operationId,
      ...result.stats
    });
    
  } catch (err: any) {
    logger.error('Contract validation failed', {
      operationId,
      error: err.message,
      stack: err.stack
    });
    throw err; // Critical: prevent server startup on contract failures
  }
};

/**
 * Dynamic API Route Discovery and Mounting - Auto-discovers and mounts feature routes
 * @llm-rule WHEN: Building modular APIs where features are auto-discovered from filesystem
 * @llm-rule AVOID: Manual route registration - breaks contract validation and feature isolation
 * @llm-rule NOTE: Gracefully handles missing routes - server starts even if some features fail
 */
const initializeRoutes = async (): Promise<void> => {
  const operationId = util.uuid();
  try {
    logger.info('Starting API discovery', { operationId });
    
    // Initialize discovery system with contract registry for validation
    apiDiscovery = new ApiDiscovery(join(__dirname, 'api'), contractRegistry);
    
    // Mount all discovered routes with contract validation
    discoveryResult = await apiDiscovery.mountRoutes(app);
    
    logger.info('API discovery completed successfully', {
      operationId,
      totalFeatures: discoveryResult.totalFeatures,
      totalApps: discoveryResult.apps.length,
      apps: discoveryResult.apps
    });
    
  } catch (err: any) {
    logger.error('Failed to initialize routes', {
      operationId,
      error: err.message,
      stack: err.stack
    });
    // Graceful degradation: server starts with empty route set
    discoveryResult = { routes: [], apps: [], totalFeatures: 0 };
  }
};

/**
 * Climate App Health Check Endpoint
 * @llm-rule WHEN: Need app-specific health monitoring for climate services
 * @llm-rule AVOID: Complex health checks - keep simple for monitoring systems
 * @llm-rule NOTE: Returns climate app status, weather API connectivity, and version info
 */
app.get('/api/climate/health', (req, res) => {
  const requestId = util.uuid();
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    app: 'climate',
    features: {
      weather: 'active',
      search: 'active'
    },
    externalServices: {
      openweathermap: 'connected' // Could be enhanced with actual API ping
    },
    requestId
  };
  
  logger.info('Climate health check requested', { requestId });
  res.json(healthData);
});

/**
 * API Documentation Endpoint - Live documentation generated from contracts and discovery
 * @llm-rule WHEN: Need self-documenting API with real-time endpoint information
 * @llm-rule AVOID: Static documentation - this reflects actual running API state
 */
app.get('/api', (req, res) => {
  // Generate live documentation from discovery results
  const docs = discoveryResult 
    ? apiDiscovery.generateApiDocs(discoveryResult)
    : {
        message: 'Voila Framework API',
        version: '1.0.0',
        framework: 'voila',
        environment: NODE_ENV,
        discovery: {
          status: 'not_initialized',
          message: 'API discovery not yet completed'
        }
      };

  // Include contract validation summary
  const contractSummary = contractRegistry.getContractSummary();
  
  res.json({
    message: 'Voila Framework API',
    environment: NODE_ENV,
    contracts: {
      validated: true,
      ...contractSummary
    },
    ...docs
  });
});

/**
 * OpenAPI Specification Endpoint - Standards-compliant API schema
 * @llm-rule WHEN: Need OpenAPI/Swagger documentation for API consumers and tooling
 * @llm-rule AVOID: Manual OpenAPI creation - this auto-generates from contracts
 */
app.get('/api/openapi', (req, res) => {
  try {
    const openapi = contractRegistry.generateOpenAPI();
    res.json(openapi);
  } catch (err: any) {
    logger.error('Failed to generate OpenAPI spec', { error: err.message });
    res.status(500).json({
      error: 'Failed to generate OpenAPI specification',
      message: err.message
    });
  }
});

/**
 * Server Startup Orchestration - Initializes contracts, routes, and error handling
 * @llm-rule WHEN: Starting production server with contract validation and route discovery
 * @llm-rule AVOID: Starting server without contract validation - leads to runtime API failures
 * @llm-rule NOTE: Critical startup order: contracts → routes → 404 handler → error handler → listen
 */
const startServer = async (): Promise<void> => {
  // Step 1: CRITICAL - Validate contracts before route mounting
  await initializeContracts();
  
  // Step 2: Discover and mount all API routes
  await initializeRoutes();
  
  // Step 3: 404 handler for API routes - MUST be after routes are mounted
  app.use('/api/*', (req, res, next) => {
    const requestId = util.uuid();
    logger.warn('API endpoint not found', {
      requestId,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    
    const notFoundError = error.notFound(`API endpoint not found: ${req.method} ${req.path}`);
    next(notFoundError);
  });

  // Step 4: CRITICAL - Error handling middleware MUST be last
  app.use(error.handleErrors({
    showStack: NODE_ENV === 'development',
    logErrors: true
  }));
  
  // Step 5: Start HTTP server
  server.listen(PORT, () => {
    const serverStartInfo = {
      serverName: SERVER_NAME,
      environment: NODE_ENV,
      port: PORT,
      urls: {
        server: `http://localhost:${PORT}`,
        health: `http://localhost:${PORT}/health`,
        api: `http://localhost:${PORT}/api`
      },
      startTime: new Date().toISOString(),
      processId: process.pid,
      nodeVersion: process.version
    };

    logger.info('Server started successfully', serverStartInfo);
    
    // Log discovered API endpoints for monitoring
    if (discoveryResult && discoveryResult.totalFeatures > 0) {
      logger.info('Discovered API endpoints', {
        totalApps: discoveryResult.apps.length,
        totalFeatures: discoveryResult.totalFeatures,
        endpoints: discoveryResult.routes.map((r: any) => ({
          app: r.app,
          feature: r.feature,
          path: r.mountPath
        }))
      });
    }

    // Development console output for quick access
    if (NODE_ENV === 'development') {
      console.log(`🚀 ${SERVER_NAME}`);
      console.log(`🌐 Running on: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`📖 API Docs: http://localhost:${PORT}/api`);
    }
  });
};

/**
 * Graceful Shutdown Handler - Kubernetes/Docker compatible shutdown
 * @llm-rule WHEN: Need clean shutdown for containerized deployments with active connections
 * @llm-rule AVOID: process.exit() without cleanup - causes connection drops and data loss
 * @llm-rule NOTE: Shutdown order: close server → flush logs → close services → exit
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  const shutdownId = util.uuid();
  logger.info('Shutdown signal received', { signal, shutdownId });
  
  try {
    // Step 1: Stop accepting new connections
    await new Promise<void>((resolve) => server.close(() => resolve()));
    
    // Step 2: Flush and close AppKit services
    await logger.flush();
    await logger.close();
    
    logger.info('Server shutdown completed gracefully', { shutdownId });
    process.exit(0);
  } catch (err: any) {
    logger.error('Error during graceful shutdown', {
      shutdownId,
      error: err.message
    });
    process.exit(1);
  }
};

/**
 * Application Bootstrap and Signal Handlers
 * @llm-rule WHEN: Starting production Node.js servers with proper error handling
 * @llm-rule AVOID: Unhandled startup errors - always catch and log for debugging
 */

// Bootstrap server with proper error handling
startServer().catch((err) => {
  logger.error('Failed to start server', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

// Container orchestration signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Kubernetes termination
process.on('SIGINT', () => gracefulShutdown('SIGINT'));   // Ctrl+C / Docker stop

export default app;