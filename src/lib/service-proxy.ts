/**
 * Voila Service Proxy - Simple microservice routing middleware
 * @file src/lib/service-proxy.ts
 * 
 * @llm-rule WHEN: Need gradual migration from monolith to microservices
 * @llm-rule AVOID: Direct microservice calls - use proxy for service discovery
 * @llm-rule PATTERN: Registry-based routing with automatic fallback to monolith
 * @llm-rule NOTE: Optional registry file - if missing, defaults to monolith mode
 * 
 * Simple proxy that:
 * - Checks registry for service
 * - If found -> proxy to microservice
 * - If not found -> continue to local monolith
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface ServiceRegistry {
  registry: Record<string, {
    endpoints: {
      [key: string]: {
        baseUrl: string;
        port: number;
      };
    };
  }>;
  environments: Record<string, {
    default_mode: string;
  }>;
}

class ServiceProxyManager {
  private registry: ServiceRegistry | null = null;
  private proxies: Map<string, RequestHandler> = new Map();

  constructor() {
    this.loadRegistry();
  }

  private loadRegistry(): void {
    const registryPath = join(process.cwd(), 'registry', 'services.registry.json');
    
    if (existsSync(registryPath)) {
      try {
        const content = readFileSync(registryPath, 'utf-8');
        this.registry = JSON.parse(content);
        console.log('🔍 [ServiceProxy] Registry loaded - microservice routing enabled');
      } catch (error) {
        console.warn('⚠️ [ServiceProxy] Failed to load registry, using monolith mode');
        this.registry = null;
      }
    }
  }

  /**
   * Get proxy middleware for a service
   */
  getProxy(serviceName: string): RequestHandler | null {
    if (!this.registry) return null;

    const serviceConfig = this.registry.registry[serviceName];
    if (!serviceConfig) return null;

    // Get environment and endpoint
    const env = process.env.NODE_ENV || 'development';
    const envConfig = this.registry.environments[env];
    const mode = envConfig?.default_mode || 'development';
    
    const endpoint = serviceConfig.endpoints[mode];
    if (!endpoint) return null;

    // Create proxy if not cached
    const cacheKey = `${serviceName}-${mode}`;
    if (!this.proxies.has(cacheKey)) {
      const proxy = createProxyMiddleware({
        target: endpoint.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          [`^/api/${serviceName}`]: `/api/${serviceName}`
        },
        on: {
          error: (err: any, _req: any, res: any) => {
            console.error(`❌ [ServiceProxy] Error proxying to ${serviceName}:`, err.message);
            if (!res.headersSent) {
              res.status(503).json({ error: 'Service unavailable', service: serviceName });
            }
          },
          proxyReq: (_proxyReq: any, req: any, _res: any) => {
            console.log(`🔄 [ServiceProxy] Proxying ${req.method} ${req.url} -> ${endpoint.baseUrl}`);
          }
        }
      });
      
      this.proxies.set(cacheKey, proxy);
    }

    return this.proxies.get(cacheKey) || null;
  }

  /**
   * Express middleware factory
   */
  createMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Only handle /api/* routes
      if (!req.path.startsWith('/api/')) {
        return next();
      }

      // Extract service name from path: /api/greeting/hello -> greeting
      const pathParts = req.path.split('/');
      if (pathParts.length < 3) {
        return next();
      }

      const serviceName = pathParts[2];
      const proxy = this.getProxy(serviceName);

      if (proxy) {
        // Service found in registry - proxy to microservice
        return proxy(req, res, next);
      } else {
        // Service not in registry - continue to local monolith
        console.log(`📦 [ServiceProxy] Service '${serviceName}' not in registry - routing to monolith`);
        return next();
      }
    };
  }

  /**
   * Reload registry (for hot reloading)
   */
  reload() {
    this.loadRegistry();
    this.proxies.clear();
    console.log('🔄 [ServiceProxy] Registry reloaded');
  }
}

// Export singleton
export const serviceProxy = new ServiceProxyManager();

/**
 * Express middleware for service routing
 * Usage: app.use(createServiceProxyMiddleware());
 */
export function createServiceProxyMiddleware() {
  return serviceProxy.createMiddleware();
}

export default serviceProxy;