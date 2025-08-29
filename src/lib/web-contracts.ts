// Web Contract System for Voila Framework
// Auto-discovery and validation for frontend features

export interface VoilaWebFeatureContract {
  name: string;
  app: string;
  description: string;
  validation: 'none' | 'basic' | 'essential' | 'strict';
  
  // Component system
  components: {
    provides: string[];        // Components this feature exports
    consumes: string[];        // Components this feature imports
  };
  
  // Routing
  routes: {
    handles: WebRoute[];       // Routes this feature handles
    redirects?: WebRedirect[]; // Redirects this feature defines
  };
  
  // API integration (Enhanced)
  api: {
    service?: string;          // Service name for config lookup
    endpoints: string[];       // Relative endpoint paths
    realtime?: string[];       // WebSocket events this feature handles
    cache?: {
      enabled: boolean;
      duration: number;        // Cache duration in ms
      strategy: 'memory' | 'localStorage' | 'sessionStorage';
    };
    retries?: number;          // Number of retry attempts
    timeout?: number;          // Request timeout in ms
  };
  
  // SSG/ISR Configuration (New)
  ssg?: {
    enabled: boolean;
    revalidate?: number;       // ISR revalidation time in seconds
    prerender?: string[];      // Routes to prerender at build time
    dynamic?: {
      [routePattern: string]: () => Promise<any[]>; // Dynamic route generation
    };
    fallback?: boolean | 'blocking'; // Fallback strategy for dynamic routes
  };
  
  // State management
  state?: {
    manages: string[];         // State this feature owns
    subscribes: string[];      // External state this feature uses
  };
  
  // Dependencies
  dependencies?: {
    files: Record<string, string>;  // File dependencies
    services: string[];             // Service dependencies
    external: string[];             // External libraries
  };
  
  // Testing
  tests?: WebTestCase[];
}

export interface WebRoute {
  path: string;
  component: string;
  protected?: boolean;
  exact?: boolean;
  layout?: string;
  // SSG specific properties
  ssg?: {
    enabled?: boolean;
    revalidate?: number;
    generateStaticParams?: () => Promise<any[]>;
  };
  // Data fetching strategy
  dataFetching?: 'static' | 'server' | 'client' | 'hybrid';
}

export interface WebRedirect {
  from: string;
  to: string;
  condition?: string;
}

export interface WebTestCase {
  type: 'component' | 'integration' | 'e2e';
  description: string;
  coverage: number;
}

/**
 * Create a new web feature contract with enhanced defaults
 */
export function createWebFeatureContract(contract: Partial<VoilaWebFeatureContract> & {
  name: string;
  app: string;
  description: string;
}): VoilaWebFeatureContract {
  return {
    validation: 'basic',
    components: { provides: [], consumes: [] },
    routes: { handles: [] },
    api: { 
      service: contract.app, // Default service name to app name
      endpoints: [],
      cache: {
        enabled: true,
        duration: 300000, // 5 minutes default
        strategy: 'memory'
      },
      retries: 2,
      timeout: 10000
    },
    ssg: {
      enabled: false,
      revalidate: 3600, // 1 hour default
      prerender: [],
      dynamic: {},
      fallback: false
    },
    state: { manages: [], subscribes: [] },
    dependencies: { files: {}, services: [], external: [] },
    tests: [],
    ...contract
  };
}

/**
 * Validate a web feature contract (Enhanced)
 */
export function validateWebContract(contract: VoilaWebFeatureContract): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!contract.name) errors.push('Missing required field: name');
  if (!contract.app) errors.push('Missing required field: app');
  if (!contract.description) errors.push('Missing required field: description');
  if (!contract.validation) errors.push('Missing required field: validation');

  // Validation levels
  const validLevels = ['none', 'basic', 'essential', 'strict'];
  if (!validLevels.includes(contract.validation)) {
    errors.push(`Invalid validation level: ${contract.validation}. Use: ${validLevels.join(', ')}`);
  }

  // Route validation
  if (contract.routes?.handles) {
    for (const route of contract.routes.handles) {
      if (!route.path) errors.push('Route missing path');
      if (!route.component) errors.push('Route missing component');
      if (!route.path.startsWith('/')) errors.push(`Route path must start with '/': ${route.path}`);
      
      // SSG validation
      if (route.ssg?.enabled && !contract.ssg?.enabled) {
        warnings.push(`Route ${route.path} has SSG enabled but contract SSG is disabled`);
      }
    }
  }

  // API endpoint validation (Updated for relative paths)
  if (contract.api?.endpoints) {
    for (const endpoint of contract.api.endpoints) {
      if (!endpoint.startsWith('/')) {
        errors.push(`API endpoint must start with '/': ${endpoint}`);
      }
      // Warn if endpoint looks like full URL instead of relative path
      if (endpoint.startsWith('/api/')) {
        warnings.push(`Endpoint '${endpoint}' should be relative path (remove '/api/${contract.app}' prefix)`);
      }
    }
  }

  // SSG validation
  if (contract.ssg?.enabled) {
    if (contract.ssg.revalidate && contract.ssg.revalidate < 60) {
      warnings.push('SSG revalidate time less than 60 seconds may cause excessive rebuilds');
    }
    
    // Validate dynamic route patterns
    if (contract.ssg.dynamic) {
      Object.keys(contract.ssg.dynamic).forEach(pattern => {
        if (!pattern.includes(':')) {
          warnings.push(`Dynamic SSG pattern '${pattern}' should contain route parameters`);
        }
      });
    }
  }

  // Component validation for strict mode
  if (contract.validation === 'strict') {
    if (contract.components.provides.length === 0) {
      errors.push('Strict validation requires at least one provided component');
    }
    if (contract.tests && contract.tests.length === 0) {
      errors.push('Strict validation requires test cases');
    }
    if (contract.api.endpoints.length > 0 && !contract.api.service) {
      errors.push('Strict validation requires service name when using API endpoints');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Web contract registry for runtime access
class WebContractRegistry {
  private contracts = new Map<string, VoilaWebFeatureContract>();

  register(contract: VoilaWebFeatureContract): void {
    const key = `${contract.app}.${contract.name}`;
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

  generateSummary(): any {
    const contracts = this.getAll();
    return {
      totalContracts: contracts.length,
      totalApps: new Set(contracts.map(c => c.app)).size,
      totalRoutes: contracts.reduce((sum, c) => sum + c.routes.handles.length, 0),
      validationLevels: contracts.reduce((acc, c) => {
        acc[c.validation] = (acc[c.validation] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const webContractRegistry = new WebContractRegistry();