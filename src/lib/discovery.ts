/**
 * Voila Framework API Discovery - Automatic route discovery and mounting system
 * @module @voilajsx/voila/discovery
 * @file src/lib/discovery.ts
 *
 * @llm-rule WHEN: Building modular APIs with automatic route discovery from filesystem
 * @llm-rule AVOID: Manual route registration - breaks contract validation and auto-discovery
 * @llm-rule NOTE: Follows convention: /api/{app}/{feature} with contract validation
 */

import { Router } from 'express';
import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import type { VoilaContractRegistry } from './contracts.js';

/**
 * Discovered Route Metadata - Information about a discovered feature route
 * @llm-rule WHEN: Tracking discovered routes for mounting and documentation
 * @llm-rule AVOID: Manual route tracking - use discovery system for consistency
 */
interface DiscoveredRoute {
  app: string;
  feature: string;
  path: string;
  routeFile: string;
  mountPath: string;
}

/**
 * Discovery Result Summary - Complete discovery results with statistics
 * @llm-rule WHEN: Reporting discovery results for monitoring and debugging
 * @llm-rule AVOID: Incomplete statistics - breaks monitoring and validation
 */
interface DiscoveryResult {
  routes: DiscoveredRoute[];
  apps: string[];
  totalFeatures: number;
}

/**
 * API Discovery Engine - Scans filesystem and mounts routes with contract validation
 * @llm-rule WHEN: Need automatic API route discovery with contract-driven validation
 * @llm-rule AVOID: Manual route mounting - breaks contract validation and consistency
 * @llm-rule NOTE: Integrates with contract registry for validation during mounting
 */
export class ApiDiscovery {
  private apiBasePath: string;
  private contractRegistry?: VoilaContractRegistry;

  constructor(apiBasePath: string, contractRegistry?: VoilaContractRegistry) {
    this.apiBasePath = resolve(apiBasePath);
    this.contractRegistry = contractRegistry;
  }

  /**
   * Filesystem Discovery - Scans API directory structure for features
   * @llm-rule WHEN: Need to discover all available features from filesystem
   * @llm-rule AVOID: Hardcoded route lists - use filesystem as source of truth
   * @llm-rule NOTE: Follows convention: api/{app}/features/{feature}/{feature}.routes.ts
   */
  discover(): DiscoveryResult {
    const routes: DiscoveredRoute[] = [];
    const apps: string[] = [];

    try {
      // Step 1: Validate API directory exists
      if (!statSync(this.apiBasePath).isDirectory()) {
        console.warn(`API base path does not exist: ${this.apiBasePath}`);
        return { routes, apps, totalFeatures: 0 };
      }

      // Step 2: Scan for app directories
      const appDirs = readdirSync(this.apiBasePath).filter(dir => {
        const appPath = join(this.apiBasePath, dir);
        return statSync(appPath).isDirectory();
      });

      // Step 3: Discover features in each app
      for (const appName of appDirs) {
        const appPath = join(this.apiBasePath, appName);
        apps.push(appName);

        // Discover features within current app
        const appRoutes = this.discoverAppFeatures(appName, appPath);
        routes.push(...appRoutes);
      }

      console.log(`🔍 API Discovery completed:`);
      console.log(`   Apps found: ${apps.length}`);
      console.log(`   Features found: ${routes.length}`);
      
      return {
        routes,
        apps,
        totalFeatures: routes.length
      };

    } catch (error) {
      console.error('❌ Error during API discovery:', error);
      return { routes, apps, totalFeatures: 0 };
    }
  }

  /**
   * App Feature Discovery - Discovers features within a specific app directory
   * @llm-rule WHEN: Scanning app directories for feature implementations
   * @llm-rule AVOID: Assuming features exist - gracefully handle missing features folder
   */
  private discoverAppFeatures(appName: string, appPath: string): DiscoveredRoute[] {
    const routes: DiscoveredRoute[] = [];

    try {
      // Step 1: Look for features folder within app
      const featuresPath = join(appPath, 'features');
      
      // Step 2: Validate features directory exists
      try {
        if (!statSync(featuresPath).isDirectory()) {
          console.log(`   ⚠ No features folder found for app '${appName}'`);
          return routes;
        }
      } catch (error) {
        console.log(`   ⚠ No features folder found for app '${appName}'`);
        return routes;
      }

      // Step 3: Scan feature directories
      const featureDirs = readdirSync(featuresPath).filter(dir => {
        const featurePath = join(featuresPath, dir);
        return statSync(featurePath).isDirectory();
      });

      // Step 4: Process each feature
      for (const featureName of featureDirs) {
        const featurePath = join(featuresPath, featureName);
        
        // Look for convention: {feature}.routes.ts file
        const routeFileName = `${featureName}.routes.ts`;
        const routeFilePath = join(featurePath, routeFileName);

        try {
          // Validate route file exists
          if (statSync(routeFilePath).isFile()) {
            const route: DiscoveredRoute = {
              app: appName,
              feature: featureName,
              path: routeFilePath,
              routeFile: routeFileName,
              mountPath: `/api/${appName}/${featureName}`  // RESTful convention
            };

            routes.push(route);
            console.log(`   ✓ Found feature: ${appName}/${featureName} -> ${route.mountPath}`);
          }
        } catch (error) {
          // Route file doesn't exist - feature may be incomplete
          console.log(`   ⚠ No route file found for ${appName}/${featureName} (expected: ${routeFileName})`);
        }
      }

    } catch (error) {
      console.error(`❌ Error discovering features in app '${appName}':`, error);
    }

    return routes;
  }

  /**
   * Route Mounting Engine - Dynamically imports and mounts discovered routes
   * @llm-rule WHEN: Mounting discovered routes with contract validation
   * @llm-rule AVOID: Mounting routes without contract validation - breaks API consistency
   * @llm-rule NOTE: Uses dynamic imports for ESM compatibility and contract validation
   */
  async mountRoutes(router: Router): Promise<DiscoveryResult> {
    // Step 1: Discover all routes from filesystem
    const discovery = this.discover();

    // Step 2: Mount each discovered route with validation
    for (const route of discovery.routes) {
      try {
        // Step 2a: Contract validation (if registry provided)
        const contractKey = `${route.app}.${route.feature}`;
        if (this.contractRegistry) {
          const contract = this.contractRegistry.getContract(contractKey);
          if (!contract) {
            console.error(`❌ Feature ${route.app}/${route.feature} has no registered contract - skipping mount`);
            console.error(`   Expected contract key: ${contractKey}`);
            console.error(`   Route file: ${route.path}`);
            continue;
          }
          console.log(`✅ Contract validated for ${contractKey}`);
        }

        console.log(`🔍 Attempting to import: ${route.path}`);
        
        // Step 2b: Dynamic import for ESM modules
        const routeModule = await import(`file://${route.path}`);
        
        // Step 2c: Extract Express Router from module
        const featureRouter = routeModule.default || routeModule;
        
        // Step 2d: Validate and mount router
        if (featureRouter && typeof featureRouter === 'function') {
          router.use(route.mountPath, featureRouter);
          console.log(`🚀 Mounted: ${route.mountPath} -> ${route.routeFile}`);
        } else {
          console.warn(`⚠ Invalid route export in ${route.path} - expected Express Router`);
          console.log(`   Received:`, typeof featureRouter, featureRouter);
        }

      } catch (error) {
        console.error(`❌ Failed to import/mount route ${route.path}:`);
        console.error(`   Error:`, error);
      }
    }

    return discovery;
  }

  /**
   * API Documentation Generator - Creates live API documentation from discovery
   * @llm-rule WHEN: Need real-time API documentation reflecting actual mounted routes
   * @llm-rule AVOID: Static documentation - this reflects actual running API state
   */
  generateApiDocs(discovery: DiscoveryResult): any {
    // Create live documentation structure
    const docs = {
      framework: 'voila',
      version: '1.0.0',
      discovery: {
        apps: discovery.apps.length,
        features: discovery.totalFeatures,
        timestamp: new Date().toISOString()
      },
      endpoints: {} as any
    };

    // Group discovered routes by app for organized documentation
    for (const route of discovery.routes) {
      if (!docs.endpoints[route.app]) {
        docs.endpoints[route.app] = {};
      }
      docs.endpoints[route.app][route.feature] = route.mountPath;
    }

    return docs;
  }
}

/**
 * Default Export - ApiDiscovery class for modular imports
 * @llm-rule WHEN: Importing discovery system in server setup
 * @llm-rule AVOID: Creating multiple discovery instances - use single instance per server
 */
export default ApiDiscovery;