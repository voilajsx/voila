#!/usr/bin/env tsx

/**
 * Voila Routes Script - Route discovery and listing
 * Usage: npm run routes [app-name] [feature-name]
 * 
 * Examples:
 *   npm run routes                    # List all routes across all apps
 *   npm run routes climate            # List routes for climate app
 *   npm run routes climate weather    # List routes for climate/weather feature
 */

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, existsSync, statSync } from 'fs';
import { VoilaFeatureContract } from '../src/lib/contracts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface RouteInfo {
  method: string;
  path: string;
  handler: string;
  app: string;
  feature: string;
  summary?: string;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    await listAllRoutes();
    return;
  }

  const command = args[0];
  const target = args[1];
  
  console.log('🛣️  Voila Route Discovery');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    if (command === 'app:api') {
      if (!target) {
        await listAllRoutes();
      } else if (target.includes('/')) {
        // Feature-specific routes: app:api climate/weather
        const [appName, featureName] = target.split('/');
        await listFeatureRoutes(appName, featureName);
      } else {
        // App-specific routes: app:api climate
        await listAppRoutes(target);
      }
    } else {
      console.log(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
    }
  } catch (error: any) {
    console.error('💥 Route discovery error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function listAllRoutes(): Promise<void> {
  console.log('📋 Discovering all API routes...\n');
  
  const apiPath = join(__dirname, '..', 'src', 'api');
  
  if (!existsSync(apiPath)) {
    console.log('❌ No API directory found');
    return;
  }

  const routes: RouteInfo[] = [];
  
  // Manually discover and load contracts to get route information
  const contracts = await discoverContracts(apiPath);
  
  // Extract routes from discovered contracts
  for (const contract of contracts) {
    if (contract.api && contract.api.endpoints) {
      for (const endpoint of contract.api.endpoints) {
        routes.push({
          method: endpoint.method,
          path: `${contract.api.basePath}${endpoint.path}`,
          handler: endpoint.handler || 'Unknown',
          app: contract.app,
          feature: contract.name,
          summary: endpoint.summary
        });
      }
    }
  }

  if (routes.length === 0) {
    console.log('ℹ️  No routes discovered');
    return;
  }

  // Sort routes by app, then feature, then path
  routes.sort((a, b) => {
    if (a.app !== b.app) return a.app.localeCompare(b.app);
    if (a.feature !== b.feature) return a.feature.localeCompare(b.feature);
    return a.path.localeCompare(b.path);
  });

  console.log('📊 Route Summary:');
  displayRoutesTable(routes);
  
  const appCount = new Set(routes.map(r => r.app)).size;
  const featureCount = new Set(routes.map(r => r.feature)).size;
  console.log(`\n✅ Found ${routes.length} routes across ${appCount} apps and ${featureCount} features`);
}

async function listAppRoutes(appName: string): Promise<void> {
  console.log(`📋 Discovering routes for app: ${appName}\n`);
  
  const apiPath = join(__dirname, '..', 'src', 'api');
  const contracts = await discoverContracts(apiPath, appName);
  
  const routes: RouteInfo[] = [];

  // Extract routes for specific app
  for (const contract of contracts) {
    if (contract.app === appName && contract.api && contract.api.endpoints) {
      for (const endpoint of contract.api.endpoints) {
        routes.push({
          method: endpoint.method,
          path: `${contract.api.basePath}${endpoint.path}`,
          handler: endpoint.handler || 'Unknown',
          app: contract.app,
          feature: contract.name,
          summary: endpoint.summary
        });
      }
    }
  }

  if (routes.length === 0) {
    console.log(`❌ No routes found for app: ${appName}`);
    return;
  }

  // Sort by feature, then path
  routes.sort((a, b) => {
    if (a.feature !== b.feature) return a.feature.localeCompare(b.feature);
    return a.path.localeCompare(b.path);
  });

  console.log(`📊 Routes for ${appName}:`);
  displayRoutesTable(routes);
  
  const featureCount = new Set(routes.map(r => r.feature)).size;
  console.log(`\n✅ Found ${routes.length} routes across ${featureCount} features`);
}

async function listFeatureRoutes(appName: string, featureName: string): Promise<void> {
  console.log(`📋 Discovering routes for feature: ${appName}/${featureName}\n`);
  
  const apiPath = join(__dirname, '..', 'src', 'api');
  const contracts = await discoverContracts(apiPath, appName);
  
  const routes: RouteInfo[] = [];

  // Extract routes for specific feature
  for (const contract of contracts) {
    if (contract.app === appName && contract.name === featureName && contract.api && contract.api.endpoints) {
      for (const endpoint of contract.api.endpoints) {
        routes.push({
          method: endpoint.method,
          path: `${contract.api.basePath}${endpoint.path}`,
          handler: endpoint.handler || 'Unknown',
          app: contract.app,
          feature: contract.name,
          summary: endpoint.summary
        });
      }
    }
  }

  if (routes.length === 0) {
    console.log(`❌ No routes found for feature: ${appName}/${featureName}`);
    return;
  }

  // Sort by path
  routes.sort((a, b) => a.path.localeCompare(b.path));

  console.log(`📊 Routes for ${appName}/${featureName}:`);
  displayRoutesTable(routes);
  
  console.log(`\n✅ Found ${routes.length} routes for this feature`);
}

function displayRoutesTable(routes: RouteInfo[]): void {
  if (routes.length === 0) return;

  // Calculate column widths
  const widths = {
    method: Math.max(6, ...routes.map(r => r.method.length)),
    path: Math.max(20, ...routes.map(r => r.path.length)),
    app: Math.max(3, ...routes.map(r => r.app.length)),
    feature: Math.max(7, ...routes.map(r => r.feature.length)),
    summary: Math.max(7, ...routes.map(r => (r.summary || '').length))
  };

  // Header
  console.log(`${'METHOD'.padEnd(widths.method)} | ${'PATH'.padEnd(widths.path)} | ${'APP'.padEnd(widths.app)} | ${'FEATURE'.padEnd(widths.feature)} | ${'SUMMARY'.padEnd(widths.summary)}`);
  console.log(`${'-'.repeat(widths.method)}-+-${'-'.repeat(widths.path)}-+-${'-'.repeat(widths.app)}-+-${'-'.repeat(widths.feature)}-+-${'-'.repeat(widths.summary)}`);

  // Routes
  routes.forEach(route => {
    const method = getMethodWithColor(route.method).padEnd(widths.method + 10); // Extra space for color codes
    const path = route.path.padEnd(widths.path);
    const app = route.app.padEnd(widths.app);
    const feature = route.feature.padEnd(widths.feature);
    const summary = (route.summary || '').padEnd(widths.summary);
    
    console.log(`${method} | ${path} | ${app} | ${feature} | ${summary}`);
  });
}

function getMethodWithColor(method: string): string {
  const colors: Record<string, string> = {
    'GET': '\x1b[32m',    // Green
    'POST': '\x1b[34m',   // Blue
    'PUT': '\x1b[33m',    // Yellow
    'DELETE': '\x1b[31m', // Red
    'PATCH': '\x1b[35m'   // Magenta
  };
  
  const reset = '\x1b[0m';
  const color = colors[method.toUpperCase()] || '';
  
  return `${color}${method}${reset}`;
}

async function discoverContracts(apiPath: string, targetApp?: string): Promise<VoilaFeatureContract[]> {
  const contracts: VoilaFeatureContract[] = [];
  
  if (!existsSync(apiPath)) {
    return contracts;
  }

  // Get all app directories
  const appDirs = readdirSync(apiPath).filter(dir => {
    const appPath = join(apiPath, dir);
    return statSync(appPath).isDirectory();
  });

  for (const appDir of appDirs) {
    // Skip if target app specified and this isn't it
    if (targetApp && appDir !== targetApp) continue;
    
    const appPath = join(apiPath, appDir);
    const featuresPath = join(appPath, 'features');
    
    if (!existsSync(featuresPath)) continue;
    
    // Get all feature directories
    const featureDirs = readdirSync(featuresPath).filter(dir => {
      const featurePath = join(featuresPath, dir);
      return statSync(featurePath).isDirectory();
    });

    for (const featureDir of featureDirs) {
      const contractPath = join(featuresPath, featureDir, `${featureDir}.index.ts`);
      
      if (!existsSync(contractPath)) continue;
      
      try {
        // Dynamically import the contract
        const contractModule = await import(contractPath);
        const contract: VoilaFeatureContract = contractModule.default;
        
        if (contract && contract.api) {
          contracts.push(contract);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to load contract: ${contractPath}`);
      }
    }
  }
  
  return contracts;
}

function showHelp() {
  console.log(`
🛣️  Voila Route Discovery - API Route Listing

USAGE:
  npm run routes [app:api] [target]

COMMANDS:
  routes                    List all routes across all apps (default)
  routes app:api            List all routes across all apps
  routes app:api <app>      List routes for specific app
  routes app:api <app>/<feature>  List routes for specific feature

EXAMPLES:
  npm run routes                       # All routes (default)
  npm run routes app:api               # All routes (explicit)
  npm run routes app:api climate       # Climate app routes only
  npm run routes app:api climate/weather  # Climate weather feature routes only

OUTPUT:
  - Method (GET, POST, PUT, DELETE, PATCH) with color coding
  - Full API path with base path
  - App and feature names
  - Route summary/description
  - Total route count and statistics

FEATURES:
  🎨 Color-coded HTTP methods
  📊 Organized by app and feature
  📋 Contract-based route discovery
  ⚡ Fast route enumeration
`);
}

main();