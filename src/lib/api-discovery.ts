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
import { readdirSync, statSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import type { VoilaContractRegistry } from './api-contracts.js';

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
 * Discovered Event Listener - Information about discovered event listeners
 * @llm-rule WHEN: Tracking discovered event listeners for initialization
 * @llm-rule AVOID: Manual event listener tracking - use discovery system for consistency
 */
interface DiscoveredEventListener {
  app: string;
  feature: string;
  path: string;
  serviceFile: string;
  initFunction: string;
}

/**
 * Discovery Result Summary - Complete discovery results with statistics
 * @llm-rule WHEN: Reporting discovery results for monitoring and debugging
 * @llm-rule AVOID: Incomplete statistics - breaks monitoring and validation
 */
interface DiscoveryResult {
  routes: DiscoveredRoute[];
  eventListeners: DiscoveredEventListener[];
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
    const eventListeners: DiscoveredEventListener[] = [];
    const apps: string[] = [];

    try {
      // Step 1: Validate API directory exists
      if (!statSync(this.apiBasePath).isDirectory()) {
        console.warn(`API base path does not exist: ${this.apiBasePath}`);
        return { routes, eventListeners, apps, totalFeatures: 0 };
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

        // Discover event listeners within current app
        const appEventListeners = this.discoverAppEventListeners(appName, appPath);
        eventListeners.push(...appEventListeners);
      }

      console.log(`🔍 API Discovery completed:`);
      console.log(`   Apps found: ${apps.length}`);
      console.log(`   Features found: ${routes.length}`);
      console.log(`   Event listeners found: ${eventListeners.length}`);
      
      return {
        routes,
        eventListeners,
        apps,
        totalFeatures: routes.length
      };

    } catch (error) {
      console.error('❌ Error during API discovery:', error);
      return { routes, eventListeners, apps, totalFeatures: 0 };
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
        
        // Look for convention: {feature}.routes.ts or {feature}.routes.js file
        const routeExtensions = ['ts', 'js'];
        let routeFound = false;
        
        for (const ext of routeExtensions) {
          const routeFileName = `${featureName}.routes.${ext}`;
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
              routeFound = true;
              break; // Stop looking once we find a route file
            }
          } catch (error) {
            // Continue to next extension
          }
        }
        
        if (!routeFound) {
          // Route file doesn't exist - feature may be incomplete
          console.log(`   ⚠ No route file found for ${appName}/${featureName} (expected: ${featureName}.routes.ts or ${featureName}.routes.js)`);
        }
      }

    } catch (error) {
      console.error(`❌ Error discovering features in app '${appName}':`, error);
    }

    return routes;
  }

  /**
   * App Event Listener Discovery - Discovers event listeners within a specific app directory
   * @llm-rule WHEN: Scanning app directories for event listener implementations
   * @llm-rule AVOID: Manual event listener registration - use discovery for consistency
   */
  private discoverAppEventListeners(appName: string, appPath: string): DiscoveredEventListener[] {
    const eventListeners: DiscoveredEventListener[] = [];

    try {
      // Step 1: Look for features folder within app
      const featuresPath = join(appPath, 'features');
      
      // Step 2: Validate features directory exists
      try {
        if (!statSync(featuresPath).isDirectory()) {
          return eventListeners;
        }
      } catch (error) {
        return eventListeners;
      }

      // Step 3: Scan feature directories
      const featureDirs = readdirSync(featuresPath).filter(dir => {
        const featurePath = join(featuresPath, dir);
        return statSync(featurePath).isDirectory();
      });

      // Step 4: Process each feature for event listeners
      for (const featureName of featureDirs) {
        const featurePath = join(featuresPath, featureName);
        
        // Look for convention: {feature}.services.ts or {feature}.services.js file with event listeners
        const serviceExtensions = ['ts', 'js'];
        
        for (const ext of serviceExtensions) {
          const serviceFileName = `${featureName}.services.${ext}`;
          const serviceFilePath = join(featurePath, serviceFileName);

          try {
            // Validate service file exists and contains event listener initialization
            if (statSync(serviceFilePath).isFile()) {
              const fileContent = readFileSync(serviceFilePath, 'utf-8');
              
              // Check if file contains initializeEventListeners function
              if (fileContent.includes('initializeEventListeners') && 
                  fileContent.includes('export function initializeEventListeners')) {
                
                const eventListener: DiscoveredEventListener = {
                  app: appName,
                  feature: featureName,
                  path: serviceFilePath,
                  serviceFile: serviceFileName,
                  initFunction: 'initializeEventListeners'
                };

                eventListeners.push(eventListener);
                console.log(`   📥 Found event listeners: ${appName}/${featureName} -> ${serviceFileName}`);
                break; // Stop looking once we find a service file
              }
            }
          } catch (error) {
            // Service file doesn't exist or can't be read
          }
        }
      }

    } catch (error) {
      console.error(`❌ Error discovering event listeners in app '${appName}':`, error);
    }

    return eventListeners;
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
        // Step 2a: Contract validation (if registry provided and not production)
        const contractKey = `${route.app}.${route.feature}`;
        const isProduction = process.env.NODE_ENV === 'production';
        
        if (this.contractRegistry && !isProduction) {
          const contract = this.contractRegistry.getContract(contractKey);
          if (!contract) {
            console.error(`❌ Feature ${route.app}/${route.feature} has no registered contract - skipping mount`);
            console.error(`   Expected contract key: ${contractKey}`);
            console.error(`   Route file: ${route.path}`);
            continue;
          }
          console.log(`✅ Contract validated for ${contractKey}`);
        } else if (isProduction) {
          console.log(`🚀 Production mode: Skipping contract validation for ${contractKey}`);
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
   * Event Listener Initialization Engine - Dynamically imports and initializes discovered event listeners
   * @llm-rule WHEN: Initializing discovered event listeners for cross-app communication
   * @llm-rule AVOID: Manual event listener initialization - breaks discovery pattern
   * @llm-rule NOTE: Uses dynamic imports for ESM compatibility and automatic initialization
   */
  async initializeEventListeners(discovery?: DiscoveryResult): Promise<void> {
    // Step 1: Use provided discovery or perform fresh discovery
    const eventDiscovery = discovery || this.discover();

    // Step 2: Initialize each discovered event listener
    for (const eventListener of eventDiscovery.eventListeners) {
      try {
        console.log(`🔍 Attempting to initialize event listeners: ${eventListener.path}`);
        
        // Step 2a: Dynamic import for ESM modules
        const serviceModule = await import(`file://${eventListener.path}`);
        
        // Step 2b: Extract initialization function from module
        const initFunction = serviceModule[eventListener.initFunction];
        
        // Step 2c: Validate and call initialization function
        if (initFunction && typeof initFunction === 'function') {
          await initFunction();
          console.log(`📥 Initialized event listeners: ${eventListener.app}/${eventListener.feature}`);
        } else {
          console.warn(`⚠ Invalid event listener initialization function in ${eventListener.path}`);
          console.log(`   Expected function: ${eventListener.initFunction}`);
        }

      } catch (error) {
        console.error(`❌ Failed to initialize event listeners ${eventListener.path}:`);
        console.error(`   Error:`, error);
      }
    }

    console.log(`📥 Event listener initialization completed: ${eventDiscovery.eventListeners.length} listeners initialized`);
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