/**
 * Voila Web Discovery - Simple contract-based discovery system
 * @file src/lib/web-discovery.ts
 * 
 * Bloom-inspired simple discovery with contract validation
 */

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
  contract: VoilaWebFeatureContract;
}

export interface WebRouteInfo {
  app: string;
  feature: string;
  path: string;
  component: string;
  componentPath: string;
  layout?: string;
  auth: 'public' | 'login' | 'admin';
}

export class WebDiscovery {
  constructor(private webPath: string) {}

  /**
   * Simple discovery - find all feature contracts
   */
  async discover(): Promise<WebDiscoveryResult> {
    const webApps = this.findWebApps();
    const features: WebFeatureInfo[] = [];
    const routes: WebRouteInfo[] = [];

    console.log('🌸 Simple Web Discovery: Scanning apps:', webApps);

    for (const app of webApps) {
      const appFeatures = await this.discoverAppFeatures(app);
      features.push(...appFeatures);
      
      for (const feature of appFeatures) {
        const featureRoutes = this.extractRoutes(feature);
        routes.push(...featureRoutes);
      }
    }

    console.log(`✅ Discovery completed: ${webApps.length} apps, ${features.length} features, ${routes.length} routes`);

    return {
      apps: webApps,
      features,
      routes,
      totalFeatures: features.length,
      totalRoutes: routes.length
    };
  }

  /**
   * Find web apps (same as before)
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
   * Simple feature discovery - look for {feature}.index.ts contracts
   */
  private async discoverAppFeatures(app: string): Promise<WebFeatureInfo[]> {
    const featuresPath = path.join(this.webPath, app, 'features');
    if (!fs.existsSync(featuresPath)) return [];

    const features: WebFeatureInfo[] = [];
    const featureDirs = fs.readdirSync(featuresPath)
      .filter(item => fs.statSync(path.join(featuresPath, item)).isDirectory());

    console.log(`  📂 App '${app}' features:`, featureDirs);

    for (const featureDir of featureDirs) {
      // Look for simple contract file: {feature}.index.ts
      const contractPath = path.join(featuresPath, featureDir, `${featureDir}.index.ts`);
      
      if (fs.existsSync(contractPath)) {
        try {
          // Dynamic import of the contract
          const { pathToFileURL } = await import('url');
          const contractUrl = pathToFileURL(contractPath).href;
          const contractModule = await import(/* @vite-ignore */ contractUrl);
          const contract = contractModule.default;
          
          if (contract) {
            // Simple validation
            const validation = validateWebContract(contract, contractPath);
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
              contract
            });

            console.log(`    ✅ Contract: ${app}/${featureDir} (${contract.routes.length} routes)`);
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
   * Extract routes directly from contract (simple!)
   */
  private extractRoutes(feature: WebFeatureInfo): WebRouteInfo[] {
    const routes: WebRouteInfo[] = [];

    for (const route of feature.contract.routes) {
      // Build component path from route component name
      const componentPath = path.join(
        path.dirname(feature.contractPath),
        'pages',
        route.component
      );

      routes.push({
        app: feature.app,
        feature: feature.feature,
        path: route.path,
        component: route.component,
        componentPath,
        layout: route.layout,
        auth: route.auth || 'public'
      });
    }

    return routes;
  }

  /**
   * Simple route manifest
   */
  generateRouteManifest(discovery: WebDiscoveryResult): any {
    return {
      framework: 'voila-web-bloom',
      version: '2.0.0',
      generated: new Date().toISOString(),
      discovery: {
        apps: discovery.apps.length,
        features: discovery.totalFeatures,
        routes: discovery.totalRoutes
      },
      routes: discovery.routes.map(r => ({
        path: r.path,
        component: r.component,
        app: r.app,
        feature: r.feature,
        auth: r.auth,
        layout: r.layout
      }))
    };
  }
}

/**
 * Simple validation for all web apps
 */
export async function validateAllWebApps(webPath: string): Promise<{ success: boolean; errors: string[] }> {
  console.log('🌸 Validating all web apps with simple contracts...');
  
  const discovery = new WebDiscovery(webPath);
  const result = await discovery.discover();
  const errors: string[] = [];

  // Simple validation - each contract validates itself
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
    console.log(`✅ Simple validation passed: ${result.totalFeatures} features, ${result.totalRoutes} routes`);
    console.log('📊 Contract summary:', webContractRegistry.summary());
  } else {
    console.error(`❌ Validation failed with ${errors.length} errors`);
    errors.forEach(error => console.error(`  - ${error}`));
  }

  return { success, errors };
}

/**
 * Get web discovery instance
 */
export function getWebDiscovery(): WebDiscovery {
  const webPath = path.join(__dirname, '..', 'web', 'apps');
  return new WebDiscovery(webPath);
}