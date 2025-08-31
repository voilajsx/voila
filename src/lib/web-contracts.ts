/**
 * Voila Web Contracts - Bloom-inspired simple contract system
 * @file src/lib/web-contracts.ts
 * 
 * Simple, reliable contracts with builder pattern - inspired by Bloom Framework
 */

// ===== SIMPLE CONTRACT TYPES =====

export interface VoilaWebFeatureContract {
  app: string;
  feature: string;
  description?: string;
  
  // Simple binary choices
  sharedState: boolean;
  
  // What this feature provides to others
  provides: {
    components: string[];
    hooks: string[];
    services: string[];
  };
  
  // What this feature consumes from others
  consumes: {
    components: string[];
    hooks: string[];
    apis: string[];
  };
  
  // Simple route definitions
  routes: VoilaWebRoute[];
}

export interface VoilaWebRoute {
  path: string;
  component: string;
  layout?: string;
  auth?: 'public' | 'login' | 'admin';
}

// ===== BLOOM-STYLE BUILDER PATTERN =====

export class VoilaWebContractBuilder {
  private contract: Partial<VoilaWebFeatureContract> = {
    provides: { components: [], hooks: [], services: [] },
    consumes: { components: [], hooks: [], apis: [] },
    routes: [],
    sharedState: false
  };

  app(name: string): VoilaWebContractBuilder {
    this.contract.app = name;
    return this;
  }

  feature(name: string): VoilaWebContractBuilder {
    this.contract.feature = name;
    return this;
  }

  description(desc: string): VoilaWebContractBuilder {
    this.contract.description = desc;
    return this;
  }

  // === WHAT THIS FEATURE PROVIDES ===
  
  providesComponent(component: string): VoilaWebContractBuilder {
    this.contract.provides!.components.push(component);
    return this;
  }

  providesHook(hook: string): VoilaWebContractBuilder {
    this.contract.provides!.hooks.push(hook);
    return this;
  }

  providesService(service: string): VoilaWebContractBuilder {
    this.contract.provides!.services.push(service);
    return this;
  }

  // === WHAT THIS FEATURE CONSUMES ===
  
  consumesComponent(component: string): VoilaWebContractBuilder {
    this.contract.consumes!.components.push(component);
    return this;
  }

  consumesHook(hook: string): VoilaWebContractBuilder {
    this.contract.consumes!.hooks.push(hook);
    return this;
  }

  consumesAPI(api: string): VoilaWebContractBuilder {
    this.contract.consumes!.apis.push(api);
    return this;
  }

  // === SIMPLE STATE CHOICE ===
  
  sharedState(enabled: boolean): VoilaWebContractBuilder {
    this.contract.sharedState = enabled;
    return this;
  }

  // === ROUTE DEFINITIONS ===
  
  route(path: string, component: string, options?: { layout?: string; auth?: 'public' | 'login' | 'admin' }): VoilaWebContractBuilder {
    this.contract.routes!.push({
      path,
      component,
      layout: options?.layout,
      auth: options?.auth || 'public'
    });
    return this;
  }

  // === BUILD FINAL CONTRACT ===
  
  build(): VoilaWebFeatureContract {
    // Simple validation
    if (!this.contract.app) throw new Error('Contract missing app name');
    if (!this.contract.feature) throw new Error('Contract missing feature name');
    
    return this.contract as VoilaWebFeatureContract;
  }
}

// ===== SIMPLE FACTORY FUNCTION =====

export function createWebFeatureContract(): VoilaWebContractBuilder {
  return new VoilaWebContractBuilder();
}

// ===== SIMPLE VALIDATION =====

export function validateWebContract(contract: VoilaWebFeatureContract, contractPath?: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!contract.app) errors.push('Missing app name');
  if (!contract.feature) errors.push('Missing feature name');
  
  // Route validation
  for (const route of contract.routes) {
    if (!route.path) errors.push('Route missing path');
    if (!route.component) errors.push('Route missing component');
    if (!route.path.startsWith('/')) errors.push(`Route path must start with '/': ${route.path}`);
  }

  // Implementation validation (dev mode only)
  if (contractPath && import.meta.env?.DEV !== false) {
    validateImplementation(contract, contractPath, errors);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate that declared routes have corresponding page components
 * and detect orphaned page files (Node.js only)
 */
function validateImplementation(contract: VoilaWebFeatureContract, contractPath: string, errors: string[]) {
  // Skip in browser environment
  if (typeof window !== 'undefined') return;
  
  try {
    // Use dynamic import for Node.js modules
    const fs = eval('require("fs")');
    const path = eval('require("path")');
    
    const pagesDir = path.join(path.dirname(contractPath), 'pages');
    
    if (!fs.existsSync(pagesDir)) {
      if (contract.routes.length > 0) {
        errors.push(`Pages directory missing: ${pagesDir}`);
      }
      return;
    }
    
    const actualFiles = fs.readdirSync(pagesDir)
      .filter((f: string) => f.endsWith('.tsx') || f.endsWith('.ts'))
      .map((f: string) => f);
    
    const declaredComponents = contract.routes.map(r => r.component);
    
    // Check for missing components
    for (const component of declaredComponents) {
      if (!actualFiles.includes(component)) {
        errors.push(`Component missing: pages/${component} (declared in route)`);
      }
    }
    
    // Check for orphaned files (warn only)
    for (const file of actualFiles) {
      if (!declaredComponents.includes(file) && file !== 'index.tsx') {
        errors.push(`Orphaned component: pages/${file} (not declared in any route)`);
      }
    }
    
  } catch (err) {
    // Silently skip if Node.js modules not available
  }
}

// ===== SIMPLE CONTRACT REGISTRY =====

class VoilaWebContractRegistry {
  private contracts = new Map<string, VoilaWebFeatureContract>();

  register(contract: VoilaWebFeatureContract): void {
    const key = `${contract.app}.${contract.feature}`;
    this.contracts.set(key, contract);
  }

  get(app: string, feature: string): VoilaWebFeatureContract | undefined {
    return this.contracts.get(`${app}.${feature}`);
  }

  getAll(): VoilaWebFeatureContract[] {
    return Array.from(this.contracts.values());
  }

  getByApp(app: string): VoilaWebFeatureContract[] {
    return Array.from(this.contracts.values()).filter(c => c.app === app);
  }

  clear(): void {
    this.contracts.clear();
  }

  // Simple summary
  summary(): { totalContracts: number; totalApps: number; totalRoutes: number } {
    const contracts = this.getAll();
    return {
      totalContracts: contracts.length,
      totalApps: new Set(contracts.map(c => c.app)).size,
      totalRoutes: contracts.reduce((sum, c) => sum + c.routes.length, 0)
    };
  }
}

export const webContractRegistry = new VoilaWebContractRegistry();

// ===== HELPER FUNCTIONS =====

/**
 * Check if a contract exists for the given app/feature
 */
export function hasContract(app: string, feature: string): boolean {
  return webContractRegistry.get(app, feature) !== undefined;
}

/**
 * Get all routes from all contracts
 */
export function getAllContractRoutes(): Array<{ app: string; feature: string; route: VoilaWebRoute }> {
  const allRoutes: Array<{ app: string; feature: string; route: VoilaWebRoute }> = [];
  
  for (const contract of webContractRegistry.getAll()) {
    for (const route of contract.routes) {
      allRoutes.push({
        app: contract.app,
        feature: contract.feature,
        route
      });
    }
  }
  
  return allRoutes;
}