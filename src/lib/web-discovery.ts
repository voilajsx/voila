// Web Discovery System for Voila Framework
// Auto-discovers frontend features and generates routing

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VoilaWebFeatureContract, validateWebContract, webContractRegistry } from './web-contracts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface WebDiscoveryResult {
  apps: string[];
  features: WebFeatureInfo[];
  routes: WebRouteInfo[];
  totalFeatures: number;
  totalRoutes: number;
}

export interface WebFeatureInfo {
  app: string;
  feature: string;
  contractPath: string;
  componentPath?: string;
  contract: VoilaWebFeatureContract;
}

export interface WebRouteInfo {
  app: string;
  feature: string;
  path: string;
  component: string;
  componentPath: string;
  protected: boolean;
  exact: boolean;
  layout?: string;
}

export class WebDiscovery {
  constructor(private webPath: string) {}

  /**
   * Discover all web features and their routes
   */
  async discover(): Promise<WebDiscoveryResult> {
    const webApps = this.findWebApps();
    const features: WebFeatureInfo[] = [];
    const routes: WebRouteInfo[] = [];

    console.log('🔍 Web Discovery: Scanning apps:', webApps);

    for (const app of webApps) {
      const appFeatures = await this.discoverAppFeatures(app);
      features.push(...appFeatures);
      
      for (const feature of appFeatures) {
        const featureRoutes = await this.extractRoutes(feature);
        routes.push(...featureRoutes);
      }
    }

    console.log(`✅ Web Discovery completed: ${webApps.length} apps, ${features.length} features, ${routes.length} routes`);

    return {
      apps: webApps,
      features,
      routes,
      totalFeatures: features.length,
      totalRoutes: routes.length
    };
  }

  /**
   * Find all web apps (directories with features/)
   */
  private findWebApps(): string[] {
    const webPath = this.webPath;
    if (!fs.existsSync(webPath)) {
      console.warn(`Web path does not exist: ${webPath}`);
      return [];
    }

    return fs.readdirSync(webPath)
      .filter(item => {
        const itemPath = path.join(webPath, item);
        const isDir = fs.statSync(itemPath).isDirectory();
        const hasFeatures = fs.existsSync(path.join(itemPath, 'features'));
        
        // Skip common non-app directories
        const isApp = !['shared', 'common', 'utils', 'lib', 'assets'].includes(item);
        
        return isDir && hasFeatures && isApp;
      });
  }

  /**
   * Discover all features for a specific app
   */
  private async discoverAppFeatures(app: string): Promise<WebFeatureInfo[]> {
    const featuresPath = path.join(this.webPath, app, 'features');
    if (!fs.existsSync(featuresPath)) return [];

    const features: WebFeatureInfo[] = [];
    const featureDirs = fs.readdirSync(featuresPath)
      .filter(item => fs.statSync(path.join(featuresPath, item)).isDirectory());

    console.log(`  📂 App '${app}' features:`, featureDirs);

    for (const featureDir of featureDirs) {
      const contractPath = path.join(featuresPath, featureDir, `${featureDir}.index.ts`);
      const componentPath = path.join(featuresPath, featureDir, `${featureDir}.components.tsx`);
      
      if (fs.existsSync(contractPath)) {
        try {
          // Dynamic import of the contract - use pathToFileURL for proper URL conversion
          const { pathToFileURL } = await import('url');
          const contractUrl = pathToFileURL(contractPath).href;
          const contractModule = await import(/* @vite-ignore */ contractUrl);
          const contract = contractModule.default || 
                          contractModule[`${this.capitalizeFirst(featureDir)}WebContract`] ||
                          contractModule[`${featureDir}WebContract`];
          
          if (contract) {
            // Validate contract
            const validation = validateWebContract(contract);
            if (!validation.valid) {
              console.error(`❌ Invalid contract ${app}/${featureDir}:`, validation.errors);
              continue;
            }

            // Register in global registry
            webContractRegistry.register(contract);

            features.push({
              app,
              feature: featureDir,
              contractPath,
              componentPath: fs.existsSync(componentPath) ? componentPath : undefined,
              contract
            });

            console.log(`    ✅ Contract: ${app}/${featureDir}`);
          } else {
            console.warn(`    ⚠️  Contract not found in: ${contractPath}`);
          }
        } catch (error) {
          console.error(`    ❌ Failed to load contract: ${contractPath}`, error);
        }
      } else {
        console.warn(`    ⚠️  Contract file missing: ${contractPath}`);
      }
    }

    return features;
  }

  /**
   * Extract route information from a feature with auto-discovery
   */
  private async extractRoutes(feature: WebFeatureInfo): Promise<WebRouteInfo[]> {
    const routes: WebRouteInfo[] = [];

    for (const route of feature.contract.routes.handles) {
      // Build component path
      const componentFileName = route.component.endsWith('.tsx') ? 
        route.component : 
        `${route.component}.tsx`;
      
      const componentPath = path.join(
        path.dirname(feature.contractPath),
        componentFileName
      );

      // Auto-generate route path based on app/feature structure
      let autoPath: string;
      
      if (feature.app === 'main' && feature.feature === 'home') {
        // Special case: main/home always maps to root
        autoPath = '/';
      } else {
        // Standard pattern: /app/feature
        // Handle dynamic segments from original path
        const basePath = `/${feature.app}/${feature.feature}`;
        if (route.path.includes('/:')) {
          // Extract dynamic segment from original path
          const dynamicPart = route.path.substring(route.path.indexOf('/:'));
          autoPath = basePath + dynamicPart;
        } else {
          autoPath = basePath;
        }
      }

      // Use auto-generated path instead of contract-defined path
      // This ensures consistency with backend /api/app/feature pattern
      routes.push({
        app: feature.app,
        feature: feature.feature,
        path: autoPath,
        component: route.component,
        componentPath,
        protected: route.protected || false,
        exact: route.exact !== false, // Default to true
        layout: route.layout
      });
    }

    return routes;
  }

  /**
   * Generate route manifest for debugging
   */
  generateRouteManifest(discovery: WebDiscoveryResult): any {
    return {
      framework: 'voila-web',
      version: '1.0.0',
      generated: new Date().toISOString(),
      discovery: {
        apps: discovery.apps.length,
        features: discovery.totalFeatures,
        routes: discovery.totalRoutes
      },
      apps: discovery.apps.reduce((acc, app) => {
        const appFeatures = discovery.features.filter(f => f.app === app);
        acc[app] = {
          features: appFeatures.map(f => f.feature),
          routes: discovery.routes
            .filter(r => r.app === app)
            .map(r => ({
              path: r.path,
              component: r.component,
              feature: r.feature,
              protected: r.protected
            }))
        };
        return acc;
      }, {} as any)
    };
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/**
 * Validate all web apps and their contracts
 */
export async function validateAllWebApps(webPath: string): Promise<{ success: boolean; errors: string[] }> {
  console.log('🔍 Validating all web apps...');
  
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

  // Check for duplicate routes
  const routePaths = new Set<string>();
  for (const route of result.routes) {
    if (routePaths.has(route.path)) {
      errors.push(`Duplicate route path: ${route.path} (${route.app}/${route.feature})`);
    }
    routePaths.add(route.path);
  }

  const success = errors.length === 0;
  if (success) {
    console.log(`✅ Web validation passed: ${result.totalFeatures} features, ${result.totalRoutes} routes`);
  } else {
    console.error(`❌ Web validation failed with ${errors.length} errors`);
    errors.forEach(error => console.error(`  - ${error}`));
  }

  return { success, errors };
}

/**
 * Get web discovery instance for server integration
 */
export function getWebDiscovery(): WebDiscovery {
  const webPath = path.join(__dirname, '..', 'web', 'apps');
  return new WebDiscovery(webPath);
}