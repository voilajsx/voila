/**
 * Voila Web Contracts - Bloom-inspired simple contract system
 * @file src/lib/web-contracts.ts
 * 
 * Simple, reliable contracts with builder pattern - inspired by Bloom Framework
 */

// ===== SIMPLE CONTRACT TYPES =====

export type ValidationMode = 'none' | 'basic' | 'essential' | 'strict';

export interface VoilaWebFeatureContract {
  app: string;
  feature: string;
  description?: string;
  
  // What this feature provides to others (simplified)
  hooks: string[];
  
  // Component dependencies (new clean approach)
  customComponents: string[];    // Components inside this feature
  sharedComponents: string[];    // Components from /src/web/shared/
  
  // Simple route definitions
  routes: VoilaWebRoute[];
  
  // Validation and testing (new)
  validation?: ValidationMode;
  tests?: string[];              // Test descriptions for contract validation
  seo?: Record<string, {         // SEO specifications per route
    title: string;
    description: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
  }>;
  
  // Legacy support (deprecated but kept for backward compatibility)
  sharedState?: boolean;
  provides?: {
    components: string[];
    hooks: string[];
    services: string[];
  };
  consumes?: {
    components: string[];
    hooks: string[];
    apis: string[];
  };
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
    // New clean approach
    hooks: [],
    customComponents: [],
    sharedComponents: [],
    routes: [],
    
    // Legacy support (initialized for backward compatibility)
    provides: { components: [], hooks: [], services: [] },
    consumes: { components: [], hooks: [], apis: [] },
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

  // === MODERN CLEAN APPROACH (recommended) ===
  
  providesHook(hook: string): VoilaWebContractBuilder {
    // New clean approach
    this.contract.hooks!.push(hook);
    // Legacy support
    this.contract.provides!.hooks.push(hook);
    return this;
  }

  // === LEGACY METHODS (deprecated, use customComponent/sharedComponent instead) ===
  
  providesComponent(component: string): VoilaWebContractBuilder {
    this.contract.provides!.components.push(component);
    return this;
  }

  providesService(service: string): VoilaWebContractBuilder {
    this.contract.provides!.services.push(service);
    return this;
  }

  // === COMPONENT DEPENDENCIES (modern approach) ===
  
  customComponent(component: string): VoilaWebContractBuilder {
    this.contract.customComponents!.push(component);
    return this;
  }

  sharedComponent(component: string): VoilaWebContractBuilder {
    this.contract.sharedComponents!.push(component);
    return this;
  }

  // === LEGACY METHODS (deprecated, kept for backward compatibility) ===
  
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

  // === VALIDATION AND TESTING ===

  validation(mode: ValidationMode): VoilaWebContractBuilder {
    this.contract.validation = mode;
    return this;
  }

  tests(descriptions: string[]): VoilaWebContractBuilder {
    this.contract.tests = descriptions;
    return this;
  }

  seo(routePath: string, metadata: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
  }): VoilaWebContractBuilder {
    if (!this.contract.seo) {
      this.contract.seo = {};
    }
    this.contract.seo[routePath] = metadata;
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
    
    const featureDir = path.dirname(contractPath);
    const validationMode = contract.validation || 'none';
    
    // Validation based on mode (progressive validation levels):
    // - none: No validation checks
    // - basic: Routing checking (pages exist for declared routes)
    // - essential: Basic + hooks validation (hooks, custom/shared components exist)
    // - strict: Essential + comments and tests validation (per voila-comments.md standards)
    
    if (validationMode === 'none') {
      // No validation checks
      return;
    }
    
    if (validationMode === 'basic' || validationMode === 'essential' || validationMode === 'strict') {
      // Basic: routing checking
      validatePages(contract, featureDir, fs, path, errors);
    }
    
    if (validationMode === 'essential' || validationMode === 'strict') {
      // Essential: hooks validation
      validateHooks(contract, featureDir, fs, path, errors);
      validateCustomComponents(contract, featureDir, fs, path, errors);
      validateSharedComponents(contract, fs, path, errors);
    }
    
    if (validationMode === 'strict') {
      // Strict: comments and tests validation
      validateComments(contract, featureDir, fs, path, errors);
      validateTestCases(contract, featureDir, fs, path, errors);
    }
    
  } catch (err) {
    // Silently skip if Node.js modules not available
  }
}

function validatePages(contract: VoilaWebFeatureContract, featureDir: string, fs: any, path: any, errors: string[]) {
  const pagesDir = path.join(featureDir, 'pages');
  
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
}

function validateHooks(contract: VoilaWebFeatureContract, featureDir: string, fs: any, path: any, errors: string[]) {
  const hooksDir = path.join(featureDir, 'hooks');
  
  if (contract.hooks.length === 0) return; // No hooks declared
  
  if (!fs.existsSync(hooksDir)) {
    errors.push(`Hooks directory missing: ${hooksDir} (required for declared hooks)`);
    return;
  }
  
  const actualFiles = fs.readdirSync(hooksDir)
    .filter((f: string) => f.endsWith('.ts') || f.endsWith('.tsx'))
    .map((f: string) => f.replace(/\.(ts|tsx)$/, ''));
  
  // Check for missing hook files
  for (const hook of contract.hooks) {
    const expectedFile = hook;
    if (!actualFiles.includes(expectedFile)) {
      errors.push(`Hook file missing: hooks/${expectedFile}.ts (declared as '${hook}')`);
    }
  }
}

function validateCustomComponents(contract: VoilaWebFeatureContract, featureDir: string, fs: any, path: any, errors: string[]) {
  const componentsDir = path.join(featureDir, 'components');
  
  if (contract.customComponents.length === 0) return; // No custom components declared
  
  if (!fs.existsSync(componentsDir)) {
    errors.push(`Components directory missing: ${componentsDir} (required for declared custom components)`);
    return;
  }
  
  const actualFiles = fs.readdirSync(componentsDir)
    .filter((f: string) => f.endsWith('.tsx') || f.endsWith('.ts'))
    .map((f: string) => f.replace(/\.(ts|tsx)$/, ''));
  
  // Check for missing custom component files
  for (const component of contract.customComponents) {
    if (!actualFiles.includes(component)) {
      errors.push(`Custom component missing: components/${component}.tsx (declared as customComponent)`);
    }
  }
}

function validateSharedComponents(contract: VoilaWebFeatureContract, fs: any, path: any, errors: string[]) {
  if (contract.sharedComponents.length === 0) return; // No shared components declared
  
  // Find the web/shared directory from the current working directory
  const sharedDir = path.join(process.cwd(), 'src', 'web', 'shared', 'components');
  
  if (!fs.existsSync(sharedDir)) {
    errors.push(`Shared components directory missing: ${sharedDir} (required for declared shared components)`);
    return;
  }
  
  const actualFiles = fs.readdirSync(sharedDir)
    .filter((f: string) => f.endsWith('.tsx') || f.endsWith('.ts'))
    .map((f: string) => f.replace(/\.(ts|tsx)$/, ''));
  
  // Check for missing shared component files
  for (const component of contract.sharedComponents) {
    if (!actualFiles.includes(component)) {
      errors.push(`Shared component missing: src/web/shared/components/${component}.tsx (declared as sharedComponent)`);
    }
  }
}

function validateComments(contract: VoilaWebFeatureContract, featureDir: string, fs: any, path: any, errors: string[]) {
  // Validation mode: strict - comments and tests validation
  // Per docs/lib/voila-comments.md:
  // - Frontend TSX Components (pages): Only need /** description + @file */ (minimal)
  // - Frontend Hooks & Complex Components: Need /** + @llm-rule WHEN/AVOID/PATTERN */ (full guidance)
  
  // Check for @llm-rule comments in hooks and components only (not TSX pages per voila-comments.md)
  const dirsToCheck = ['hooks', 'components'];
  
  for (const dirName of dirsToCheck) {
    const dirPath = path.join(featureDir, dirName);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath)
      .filter((f: string) => f.endsWith('.tsx') || f.endsWith('.ts'));
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for @llm-rule comments (required for hooks and complex components)
        if (!content.includes('@llm-rule')) {
          errors.push(`Missing @llm-rule comments in ${dirName}/${file} (required in strict mode)`);
        }
        
        // Check for proper JSDoc header comments
        if (!content.includes('/**')) {
          errors.push(`Missing JSDoc comments in ${dirName}/${file} (required in strict mode)`);
        }
      } catch (readErr) {
        errors.push(`Could not read file ${dirName}/${file} for comment validation`);
      }
    }
  }
  
  // For pages directory, only check for JSDoc (not @llm-rule per voila-comments.md)
  const pagesDir = path.join(featureDir, 'pages');
  if (fs.existsSync(pagesDir)) {
    const files = fs.readdirSync(pagesDir)
      .filter((f: string) => f.endsWith('.tsx') || f.endsWith('.ts'));
    
    for (const file of files) {
      const filePath = path.join(pagesDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Only check for JSDoc header comments for TSX pages
        if (!content.includes('/**')) {
          errors.push(`Missing JSDoc comments in pages/${file} (required in strict mode)`);
        }
      } catch (readErr) {
        errors.push(`Could not read file pages/${file} for comment validation`);
      }
    }
  }
}

function validateTestCases(contract: VoilaWebFeatureContract, featureDir: string, fs: any, path: any, errors: string[]) {
  if (!contract.tests || contract.tests.length === 0) return; // No test cases declared
  
  const testsDir = path.join(featureDir, 'tests');
  
  if (!fs.existsSync(testsDir)) {
    errors.push(`Tests directory missing: ${testsDir} (required for declared test cases)`);
    return;
  }
  
  const testFiles = fs.readdirSync(testsDir)
    .filter((f: string) => f.endsWith('.test.ts') || f.endsWith('.test.tsx'));
  
  if (testFiles.length === 0) {
    errors.push(`No test files found in ${testsDir} (required for declared test cases)`);
    return;
  }
  
  // Check if declared test descriptions exist in actual test files
  const declaredTests = contract.tests;
  let foundTests: string[] = [];
  
  for (const testFile of testFiles) {
    const testFilePath = path.join(testsDir, testFile);
    try {
      const content = fs.readFileSync(testFilePath, 'utf8');
      
      // Extract test descriptions from test files
      const testMatches = content.match(/(?:it|test)\s*\(\s*['"](.*?)['"]/g);
      if (testMatches) {
        const testsInFile = testMatches.map(match => {
          const result = match.match(/['"](.*?)['"]/);
          return result ? result[1] : '';
        }).filter(test => test);
        
        foundTests.push(...testsInFile);
      }
    } catch (readErr) {
      errors.push(`Could not read test file ${testFile} for test case validation`);
    }
  }
  
  // Check for missing test cases
  for (const declaredTest of declaredTests) {
    if (!foundTests.includes(declaredTest)) {
      errors.push(`Test case missing: "${declaredTest}" (declared in contract but not found in test files)`);
    }
  }
  
  // Check for extra test cases (informational)
  for (const foundTest of foundTests) {
    if (!declaredTests.includes(foundTest)) {
      errors.push(`Undeclared test case found: "${foundTest}" (exists in test files but not declared in contract)`);
    }
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