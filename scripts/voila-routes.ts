#!/usr/bin/env tsx

/**
 * Voila Routes Script - Route discovery and listing for API and Web
 * Usage: npm run routes [command] [target]
 * 
 * Examples:
 *   npm run routes                    # List all routes (API + Web)
 *   npm run routes app:api            # List all API routes
 *   npm run routes app:web            # List all web routes
 *   npm run routes app:api climate    # List API routes for climate app
 *   npm run routes app:api climate/weather # List routes for climate/weather feature
 *   npm run routes app:web greeting   # List web routes for greeting app
 */

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, existsSync, statSync } from 'fs';
import { VoilaFeatureContract } from '../src/lib/api-contracts.js';
import { WebDiscovery } from '../src/lib/web-discovery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface RouteInfo {
  method: string;
  path: string;
  handler: string;
  app: string;
  feature: string;
  summary?: string;
  type: 'api' | 'web';
  auth?: string;
  component?: string;
}

async function main() {
  const args = process.argv.slice(2);
  
  console.log('🛣️  Voila Route Discovery');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    if (args.length === 0) {
      // Show both API and Web routes
      await listAllRoutes();
      return;
    }

    const command = args[0];
    const target = args[1];

    if (command === 'app:api') {
      console.log('🎯 Target: API Routes');
      if (!target) {
        await listApiRoutes();
      } else if (target.includes('/')) {
        const [appName, featureName] = target.split('/');
        await listApiFeatureRoutes(appName, featureName);
      } else {
        await listApiAppRoutes(target);
      }
    } else if (command === 'app:web') {
      console.log('🎯 Target: Web Routes');
      if (!target) {
        await listWebRoutes();
      } else {
        await listWebAppRoutes(target);
      }
    } else {
      // Legacy support: npm run routes climate
      console.log('🎯 Target: API Routes (legacy)');
      const appName = command;
      const featureName = target;
      
      if (featureName) {
        await listApiFeatureRoutes(appName, featureName);
      } else {
        await listApiAppRoutes(appName);
      }
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
  console.log('📋 Discovering all routes (API + Web)...\n');
  
  // Get API routes
  const apiRoutes = await getApiRoutes();
  
  // Get Web routes
  const webRoutes = await getWebRoutes();
  
  // Combine and display
  const allRoutes = [...apiRoutes, ...webRoutes];
  displayRoutes(allRoutes);
}

async function listApiRoutes(): Promise<void> {
  console.log('📋 Discovering all API routes...\n');
  const routes = await getApiRoutes();
  displayRoutes(routes);
}

async function listWebRoutes(): Promise<void> {
  console.log('📋 Discovering all web routes...\n');
  const routes = await getWebRoutes();
  displayRoutes(routes);
}

async function listApiAppRoutes(appName: string): Promise<void> {
  console.log(`Discovering API routes for app: ${appName}...\n`);
  const routes = await getApiRoutes(appName);
  displayRoutes(routes);
}

async function listWebAppRoutes(appName: string): Promise<void> {
  console.log(`Discovering web routes for app: ${appName}...\n`);
  const routes = await getWebRoutes(appName);
  displayRoutes(routes);
}

async function listApiFeatureRoutes(appName: string, featureName: string): Promise<void> {
  console.log(`📋 Discovering API routes for feature: ${appName}/${featureName}...\n`);
  const routes = await getApiRoutes(appName, featureName);
  displayRoutes(routes);
}

async function getApiRoutes(appName?: string, featureName?: string): Promise<RouteInfo[]> {
  const apiPath = join(__dirname, '..', 'src', 'api');
  
  if (!existsSync(apiPath)) {
    return [];
  }

  const routes: RouteInfo[] = [];
  const contracts = await discoverContracts(apiPath, appName);
  
  for (const contract of contracts) {
    if (featureName && contract.name !== featureName) continue;
    if (appName && contract.app !== appName) continue;
    
    if (contract.api && contract.api.endpoints) {
      for (const endpoint of contract.api.endpoints) {
        routes.push({
          method: endpoint.method,
          path: `${contract.api.basePath}${endpoint.path}`,
          handler: endpoint.handler || 'Unknown',
          app: contract.app,
          feature: contract.name,
          summary: endpoint.summary,
          type: 'api'
        });
      }
    }
  }

  return routes;
}

async function getWebRoutes(appName?: string): Promise<RouteInfo[]> {
  const webPath = join(__dirname, '..', 'src', 'web');
  const discovery = new WebDiscovery(webPath);
  
  try {
    const result = await discovery.discover();
    const routes: RouteInfo[] = [];
    
    for (const routeInfo of result.routes) {
      if (appName && routeInfo.app !== appName) continue;
      
      routes.push({
        method: 'GET',
        path: routeInfo.path,
        handler: routeInfo.component,
        app: routeInfo.app,
        feature: routeInfo.feature,
        summary: `${routeInfo.app}/${routeInfo.feature} page`,
        type: 'web',
        auth: routeInfo.auth,
        component: routeInfo.component
      });
    }
    
    return routes;
  } catch (error) {
    console.warn('⚠️  Could not discover web routes:', error);
    return [];
  }
}

function showHelp(): void {
  console.log(`
\ud83d\udee3\ufe0f  Voila Route Discovery - List API and Web routes

USAGE:
  npm run routes [command] [target]

COMMANDS:
  app:api [target]       List API routes
  app:web [app-name]     List web routes
  
TARGETS (for app:api):
  <app>                  List routes for specific API app
  <app>/<feature>        List routes for specific API feature

EXAMPLES:
  npm run routes                    # List all routes (API + Web)
  npm run routes app:api            # List all API routes
  npm run routes app:web            # List all web routes
  npm run routes app:api climate    # List API routes for climate app
  npm run routes app:api climate/weather # List routes for climate/weather feature
  npm run routes app:web greeting   # List web routes for greeting app

LEGACY SUPPORT:
  npm run routes <app>              # List API routes for app (same as app:api <app>)
  npm run routes <app> <feature>    # List API routes for feature (same as app:api <app>/<feature>)
`);
}

function displayRoutesTable(routes: RouteInfo[]): void {
  if (routes.length === 0) return;

  // Calculate column widths
  const widths = {
    type: Math.max(4, ...routes.map(r => r.type.length)),
    method: Math.max(6, ...routes.map(r => r.method.length)),
    path: Math.max(20, ...routes.map(r => r.path.length)),
    app: Math.max(3, ...routes.map(r => r.app.length)),
    feature: Math.max(7, ...routes.map(r => r.feature.length)),
    summary: Math.max(7, ...routes.map(r => (r.summary || '').length))
  };

  // Header
  console.log(`${'TYPE'.padEnd(widths.type)} | ${'METHOD'.padEnd(widths.method)} | ${'PATH'.padEnd(widths.path)} | ${'APP'.padEnd(widths.app)} | ${'FEATURE'.padEnd(widths.feature)} | ${'SUMMARY'.padEnd(widths.summary)}`);
  console.log(`${'-'.repeat(widths.type)}-+-${'-'.repeat(widths.method)}-+-${'-'.repeat(widths.path)}-+-${'-'.repeat(widths.app)}-+-${'-'.repeat(widths.feature)}-+-${'-'.repeat(widths.summary)}`);

  // Routes
  routes.forEach(route => {
    const typeIcon = route.type === 'api' ? '\ud83d\udccb' : '\ud83c\udf10';
    const type = `${typeIcon} ${route.type}`.padEnd(widths.type + 2);
    const method = getMethodWithColor(route.method).padEnd(widths.method + 10); // Extra space for color codes
    const path = route.path.padEnd(widths.path);
    const app = route.app.padEnd(widths.app);
    const feature = route.feature.padEnd(widths.feature);
    const summary = (route.summary || '').padEnd(widths.summary);
    
    console.log(`${type} | ${method} | ${path} | ${app} | ${feature} | ${summary}`);
  });
}

function displayRoutes(routes: RouteInfo[]): void {
  if (routes.length === 0) {
    console.log('\u2139\ufe0f  No routes discovered');
    return;
  }

  // Sort routes by type, app, feature, then path
  routes.sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    if (a.app !== b.app) return a.app.localeCompare(b.app);
    if (a.feature !== b.feature) return a.feature.localeCompare(b.feature);
    return a.path.localeCompare(b.path);
  });

  console.log('\ud83d\udcca Route Summary:');
  displayRoutesTable(routes);
  
  const appCount = new Set(routes.map(r => r.app)).size;
  const featureCount = new Set(routes.map(r => r.feature)).size;
  const apiCount = routes.filter(r => r.type === 'api').length;
  const webCount = routes.filter(r => r.type === 'web').length;
  
  console.log(`\n\u2705 Found ${routes.length} routes across ${appCount} apps and ${featureCount} features`);
  if (apiCount > 0 && webCount > 0) {
    console.log(`   \ud83d\udccb API: ${apiCount} routes | \ud83c\udf10 Web: ${webCount} routes`);
  }
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


main();