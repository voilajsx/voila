/**
 * Voila Framework Contract System - Type-safe feature contracts with validation
 * @module @voilajsx/voila/contracts
 * @file src/lib/contracts.ts
 *
 * @llm-rule WHEN: Building modular APIs with contract-driven development and validation
 * @llm-rule AVOID: Manual API documentation - contracts auto-generate OpenAPI specs
 * @llm-rule NOTE: Supports strict/basic/none validation levels for different development phases
 */

import fs from 'fs';
import * as path from 'path';
import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

// ===== CONTRACT TYPE DEFINITIONS =====

/**
 * API Endpoint Definition - Contract for single API endpoint with AppKit auth integration
 * @llm-rule WHEN: Defining REST API endpoints with type-safe contracts and auth requirements
 * @llm-rule AVOID: Undefined responseSchema - breaks OpenAPI generation and validation
 */
export interface VoilaFeatureEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: string;
  summary: string;
  requestSchema?: any;
  responseSchema: any;
  // AppKit Authentication
  auth: {
    type: 'public' | 'api_key' | 'login' | 'admin';
    roles?: string[];        // AppKit roles: ['admin.tenant', 'admin.system']
    permissions?: string[];  // Optional AppKit permissions
  };
  // Enterprise features (optional)
  rateLimit?: { requests: number; window: string };
  validation?: {
    params?: Record<string, string>;
    sanitization?: string[];
  };
  tags?: string[];
}

export interface VoilaFeatureAPI {
  basePath: string;
  endpoints: VoilaFeatureEndpoint[];
}

export interface VoilaFeatureFileDependencies {
  appkit?: string[];
  external?: string[];
  internal?: string[];
  relative?: string[];
}

/**
 * Feature Dependencies - Declares file-level imports and dependencies
 * @llm-rule WHEN: Need strict validation of imports and file dependencies
 * @llm-rule AVOID: Undeclared dependencies - breaks contract validation
 */
export interface VoilaFeatureDependencies {
  files: Record<string, VoilaFeatureFileDependencies>;
}

/**
 * Bidirectional Service Communication - Tracks service imports/exports between features
 * @llm-rule WHEN: Need to track service dependencies for microservice boundaries
 * @llm-rule AVOID: Circular service dependencies - breaks modular architecture
 */
export interface ServiceConsumption {
  app: string;           // 'greeting'
  feature: string;       // 'logs'  
  service: string;       // 'GreetingLogModel'
  methods: string[];     // ['create', 'findMany']
}

export interface ServiceCommunication {
  provides: string[];              // Services this feature exports
  consumes: ServiceConsumption[];  // Services this feature imports from other features
}

/**
 * Bidirectional Event Communication - Tracks event emissions/subscriptions between features
 * @llm-rule WHEN: Need to track cross-app event flows for microservice communication
 * @llm-rule AVOID: Event subscriptions without emitters - creates broken event flows
 */
export interface EventEmission {
  namespace: string;     // 'climate_weather'
  event: string;         // 'weather.data.fetched'
  payload: string;       // 'WeatherEventData'
  description: string;   // 'Weather data successfully fetched from API'
}

export interface EventSubscription {
  namespace: string;     // 'climate_weather'
  event: string;         // 'weather.data.fetched'
  handler: string;       // 'createWeatherLog'
  description: string;   // 'Creates log entry when weather data is fetched'
}

export interface EventCommunication {
  emits: EventEmission[];         // Events this feature emits
  listens: EventSubscription[];   // Events this feature listens to
}

// Legacy interfaces - kept for backward compatibility but simplified
export interface VoilaFeatureProvides {
  services: string[];  // Only services, removed routes/types/schemas
}

export interface VoilaFeatureConsumes {
  services: string[];  // Legacy - will be replaced by ServiceCommunication
  state: string[];     // Legacy - not used in stateless microservices
  events: string[];    // Legacy - will be replaced by EventCommunication
}

export interface VoilaFeatureQuality {
  testCoverage: number;
  typeStrictness: number;
  securityLevel: 'low' | 'medium' | 'high';
  performance?: {
    maxResponseTime: string;
    maxMemoryUsage: string;
  };
  reliability?: {
    errorRate: string;
    uptime: string;
  };
}

export interface VoilaFeatureConfig {
  enabled: boolean;
  environments: string[];
  features: Record<string, boolean>;
}

export interface VoilaAppFeatureConfig {
  enabled: boolean;
  environments: string[];
  description?: string;
}

export interface VoilaAppConfig {
  app: string;
  enabled: boolean;
  environments: string[];
  features: Record<string, VoilaAppFeatureConfig>;
  metadata: {
    owner: string;
    created: string;
  };
}

export interface VoilaFeatureObservability {
  metrics: string[];
  logs: string[];
  traces: string[];
}

export interface VoilaFeatureSecurity {
  inputValidation: boolean;
  outputSanitization: boolean;
  rateLimiting: boolean;
  authRequired: boolean;
  permissions: string[];
}

// Just a simple array of test descriptions

export interface VoilaFeatureDocumentation {
  readme: string;
  examples: Array<{
    title: string;
    request: string;
    response: any;
  }>;
  openapi: boolean;
}

export interface VoilaFeatureDeployment {
  strategy: string;
  healthCheck: string;
  dependencies: string[];
  resources: Record<string, string>;
}

/**
 * Feature Contract - Focused contract with bidirectional communication tracking
 * @llm-rule WHEN: Creating new features with clear service boundaries and communication patterns
 * @llm-rule AVOID: Missing api.endpoints - breaks route mounting and OpenAPI generation
 * @llm-rule NOTE: validation='none' (prototyping), 'basic' (startups), 'strict' (enterprise)
 */
export interface VoilaFeatureContract {
  // === IDENTITY ===
  name: string;
  app: string;
  description: string;
  validation: 'none' | 'basic' | 'essential' | 'strict';  // 4-level validation system
  
  // === API DEFINITION === (Enhanced with auth)
  api: VoilaFeatureAPI;
  
  // === DEPENDENCIES === (Keep for AI constraints)
  dependencies: VoilaFeatureDependencies;
  
  // === BIDIRECTIONAL COMMUNICATION ===
  services: ServiceCommunication;
  events: EventCommunication;
  
  // === TESTS === (Keep as requested)
  tests: string[];
}


export interface ContractValidationError {
  type: 'missing_handler' | 'missing_import' | 'missing_test' | 'schema_mismatch' | 'dependency_unresolved' | 'missing_file' | 'invalid_endpoint';
  severity: 'error' | 'warning';
  feature: string;
  details: string;
  suggestions?: string[];
}

export interface ContractValidationResult {
  valid: boolean;
  errors: ContractValidationError[];
  warnings: ContractValidationError[];
  featureName?: string;
}

// ===== CONTRACT REGISTRY & VALIDATION ENGINE =====

/**
 * Contract Registry - Central registry for feature contracts with validation engine
 * @llm-rule WHEN: Managing feature contracts with validation and dependency resolution
 * @llm-rule AVOID: Direct map manipulation - use register() method for proper validation
 * @llm-rule NOTE: Supports circular dependency detection and cross-feature validation
 */
export class VoilaContractRegistry {
  private contracts = new Map<string, VoilaFeatureContract>();
  private dependencyGraph = new Map<string, string[]>();

  /**
   * Register Feature Contract - Validates and registers contract with dependency tracking
   * @llm-rule WHEN: Registering feature contracts during server startup
   * @llm-rule AVOID: Registering invalid contracts - throws errors to prevent server startup
   */
  async register(featureName: string, contract: VoilaFeatureContract): Promise<void> {
    // Skip validation if level is 'none'
    if (contract.validation === 'none') {
      this.contracts.set(featureName, contract);
      this.updateDependencyGraph();
      console.log(`📋 Contract registered: ${featureName} (validation: none)`);
      return;
    }

    const validation = validateContract(contract);
    if (!validation.valid) {
      const errorMessages = validation.errors.map(err => `[${err.type}] ${err.details}`);
      throw new Error(`Contract validation failed for ${featureName}: ${errorMessages.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn(`⚠️  Contract warnings for ${featureName}:`, validation.warnings);
    }

    this.contracts.set(featureName, contract);
    this.updateDependencyGraph();
    console.log(`📋 Contract registered: ${featureName} (validation: ${contract.validation})`);
  }


  /**
   * Get contract by feature name
   */
  getContract(featureName: string): VoilaFeatureContract | undefined {
    return this.contracts.get(featureName);
  }

  /**
   * Get all registered contracts
   */
  getAllContracts(): Map<string, VoilaFeatureContract> {
    return new Map(this.contracts);
  }

  /**
   * Contract Validation Engine - Comprehensive validation with file system checks
   * @llm-rule WHEN: Validating contracts against actual implementation files
   * @llm-rule AVOID: Skipping validation in development - catches contract violations early
   * @llm-rule NOTE: Strict mode validates files, imports, handlers, routes, and tests
   */
  async validateContract(contract: VoilaFeatureContract, featureName?: string, basePath?: string): Promise<ContractValidationResult> {
    const errors: ContractValidationError[] = [];
    const warnings: ContractValidationError[] = [];
    const feature = featureName || contract.name;
    const validationLevel = contract.validation || 'essential';

    // Skip validation completely for 'none' level
    if (validationLevel === 'none') {
      return {
        valid: true,
        errors: [],
        warnings: []
      };
    }

    // BASIC LEVEL: Required fields + API endpoints only
    // Basic required fields
    if (!contract.name) {
      errors.push({
        type: 'schema_mismatch',
        severity: 'error',
        feature,
        details: 'Contract must have a name'
      });
    }
    if (!contract.app) {
      errors.push({
        type: 'schema_mismatch',
        severity: 'error',
        feature,
        details: 'Contract must specify an app'
      });
    }

    // API validation
    if (!contract.api?.endpoints?.length) {
      errors.push({
        type: 'invalid_endpoint',
        severity: 'error',
        feature,
        details: 'Feature must define at least one API endpoint'
      });
    } else {
      contract.api.endpoints.forEach((endpoint, index) => {
        if (!endpoint.method) {
          errors.push({
            type: 'invalid_endpoint',
            severity: 'error',
            feature,
            details: `Endpoint ${index}: method is required`
          });
        }
        if (!endpoint.path) {
          errors.push({
            type: 'invalid_endpoint',
            severity: 'error',
            feature,
            details: `Endpoint ${index}: path is required`
          });
        }
        if (!endpoint.handler) {
          errors.push({
            type: 'missing_handler',
            severity: 'error',
            feature,
            details: `Endpoint ${index}: handler is required`
          });
        }
        if (!endpoint.responseSchema) {
          errors.push({
            type: 'schema_mismatch',
            severity: 'error',
            feature,
            details: `Endpoint ${index}: responseSchema is required`
          });
        }
      });

      // Validate basePath matches feature folder structure
      if (contract.api?.basePath) {
        const expectedBasePath = `/api/${contract.app}/${contract.name}`;
        if (contract.api.basePath !== expectedBasePath) {
          errors.push({
            type: 'invalid_endpoint',
            severity: 'error',
            feature,
            details: `BasePath mismatch: expected '${expectedBasePath}' but got '${contract.api.basePath}'. BasePath must match /api/{app}/{feature} pattern.`,
            suggestions: [`Change basePath to '${expectedBasePath}' in contract`, `Ensure basePath follows /api/{app}/{feature} pattern for consistency`]
          });
        }
      }
    }

    // Early return for basic level - only required fields and API endpoints
    if (validationLevel === 'basic') {
      return {
        valid: errors.length === 0,
        errors,
        warnings
      };
    }

    // ESSENTIAL LEVEL: Basic + services/events/tests validation
    validateServiceCommunication(contract, [], errors, warnings);  
    validateEventCommunication(contract, [], errors, warnings);
    validateTests(contract, errors, warnings);

    // Early return for essential level
    if (validationLevel === 'essential') {
      return {
        valid: errors.length === 0,
        errors,
        warnings
      };
    }

    // STRICT LEVEL: Essential + file imports + LLM comments validation
    // File existence validation (strict only)
    if (basePath && contract.dependencies?.files && validationLevel === 'strict') {
      await this.validateFileExistence(contract, basePath, errors, warnings);
    }

    // File-specific import validation (strict only)
    if (basePath && contract.dependencies?.files && validationLevel === 'strict') {
      await this.validateFileImports(contract, basePath, errors, warnings);
    }

    // LLM comments validation (strict mode only)
    if (basePath && validationLevel === 'strict') {
      await this.validateLLMComments(contract, basePath, errors, warnings);
    }

    // Quality requirements validation (commented out - quality property not in current contract interface)
    // TODO: Re-enable if quality property is added back to VoilaFeatureContract
    // if (contract.quality?.testCoverage && contract.quality.testCoverage < 80) {
    //   warnings.push({
    //     type: 'missing_test',
    //     severity: 'warning',
    //     feature,
    //     details: `Test coverage ${contract.quality.testCoverage}% below recommended 80%`,
    //     suggestions: ['Increase test coverage to meet quality standards']
    //   });
    // }
    // if (contract.quality?.typeStrictness && contract.quality.typeStrictness < 100) {
    //   warnings.push({
    //     type: 'schema_mismatch',
    //     severity: 'warning',
    //     feature,
    //     details: `Type strictness ${contract.quality.typeStrictness}% below recommended 100%`,
    //     suggestions: ['Enable strict TypeScript configuration']
    //   });
    // }


    return {
      valid: errors.length === 0,
      errors,
      warnings,
      featureName
    };
  }

  /**
   * File Existence Validation - Ensures declared files exist and no undeclared files present
   * @llm-rule WHEN: Strict validation mode to prevent missing files and maintain clean structure
   * @llm-rule AVOID: Undeclared files in feature directories - breaks contract consistency
   */
  private async validateFileExistence(
    contract: VoilaFeatureContract,
    basePath: string,
    errors: ContractValidationError[],
    warnings: ContractValidationError[]
  ): Promise<void> {
    const feature = contract.name;
    const featurePath = path.join(basePath, contract.app, 'features', contract.name);
    
    try {
      // Get all TypeScript files in the feature directory (excluding contract files)
      const actualFiles = fs.readdirSync(featurePath)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.endsWith('.index.ts'))
        .sort();
      
      // Get files declared in contract dependencies
      const declaredFiles = Object.keys(contract.dependencies.files).sort();
      
      // Check for missing files (declared but don't exist)
      for (const declaredFile of declaredFiles) {
        if (!actualFiles.includes(declaredFile)) {
          errors.push({
            type: 'missing_file',
            severity: 'error',
            feature,
            details: `File ${declaredFile} declared in dependencies but not found in ${featurePath}`,
            suggestions: [`Create file ${declaredFile} or remove from dependencies`]
          });
        }
      }
      
      // Check for extra files (exist but not declared)
      for (const actualFile of actualFiles) {
        if (!declaredFiles.includes(actualFile)) {
          errors.push({
            type: 'missing_file', 
            severity: 'error',
            feature,
            details: `File ${actualFile} exists but not declared in dependencies block`,
            suggestions: [`Add ${actualFile} to dependencies block or remove the file`]
          });
        }
      }
      
    } catch (error: any) {
      errors.push({
        type: 'missing_file',
        severity: 'error',
        feature,
        details: `Error validating file existence in ${featurePath}: ${error.message}`
      });
    }
  }

  /**
   * Import Validation - Verifies actual imports match contract dependency declarations
   * @llm-rule WHEN: Ensuring declared dependencies are actually imported in files
   * @llm-rule AVOID: Undeclared imports - breaks dependency tracking and security auditing
   */
  private async validateFileImports(
    contract: VoilaFeatureContract,
    basePath: string,
    errors: ContractValidationError[],
    warnings: ContractValidationError[]
  ): Promise<void> {
    const feature = contract.name;
    
    for (const [fileName, fileDeps] of Object.entries(contract.dependencies.files)) {
      const filePath = path.join(basePath, contract.app, 'features', contract.name, fileName);
      
      try {
        if (!fs.existsSync(filePath)) {
          warnings.push({
            type: 'missing_file',
            severity: 'warning',
            feature,
            details: `File ${fileName} declared in dependencies but not found`
          });
          continue;
        }

        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        
        // Check AppKit imports (excluding commented lines)
        if (fileDeps.appkit) {
          const lines = fileContent.split('\n');
          for (const appkitModule of fileDeps.appkit) {
            let importFound = false;
            for (const line of lines) {
              const trimmedLine = line.trim();
              // Skip commented lines
              if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
                continue;
              }
              
              if (line.includes(`from '@voilajsx/appkit/${appkitModule}'`)) {
                importFound = true;
                break;
              }
            }
            
            if (!importFound) {
              errors.push({
                type: 'missing_import',
                severity: 'error',
                feature,
                details: `File ${fileName} missing AppKit import: @voilajsx/appkit/${appkitModule}`,
                suggestions: [`Add import: import { ... } from '@voilajsx/appkit/${appkitModule}';`]
              });
            }
          }
        }

        // Check external imports
        if (fileDeps.external) {
          for (const externalModule of fileDeps.external) {
            const externalImportPattern = new RegExp(`from\\s+['"]${externalModule}['"]`);
            if (!externalImportPattern.test(fileContent)) {
              errors.push({
                type: 'missing_import',
                severity: 'error',
                feature,
                details: `File ${fileName} missing external import: ${externalModule}`,
                suggestions: [`Add import: import ... from '${externalModule}';`]
              });
            }
          }
        }

        // Check relative imports
        if (fileDeps.relative) {
          for (const relativeModule of fileDeps.relative) {
            const relativeImportPattern = new RegExp(`from\\s+['"]${relativeModule.replace('.', '\\.')}['"]`);
            if (!relativeImportPattern.test(fileContent)) {
              errors.push({
                type: 'missing_import',
                severity: 'error',
                feature,
                details: `File ${fileName} missing relative import: ${relativeModule}`,
                suggestions: [`Add import: import ... from '${relativeModule}';`]
              });
            }
          }
        }

      } catch (error: any) {
        warnings.push({
          type: 'missing_file',
          severity: 'warning',
          feature,
          details: `Error validating imports in ${fileName}: ${error.message}`
        });
      }
    }
  }

  /**
   * LLM Comment Validation - Ensures VoilaJSX comment standards compliance
   * @llm-rule WHEN: Enforcing documentation standards for AI-ready codebases
   * @llm-rule AVOID: Missing @llm-rule comments in strict mode - breaks AI code generation
   */
  private async validateLLMComments(
    contract: VoilaFeatureContract,
    basePath: string,
    errors: ContractValidationError[],
    warnings: ContractValidationError[]
  ): Promise<void> {
    const feature = contract.name;
    const commentLevel = 'strict'; // Always strict since this method only runs in strict mode
    const featurePath = path.join(basePath, contract.app, 'features', contract.name);
    
    try {
      // Get all TypeScript files in the feature directory
      const files = fs.readdirSync(featurePath)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
        .map(file => path.join(featurePath, file));
      
      for (const filePath of files) {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const filename = path.basename(filePath);
        
        // Check file-level header comment
        if (!this.hasFileHeaderComment(content)) {
          const severity = commentLevel === 'strict' ? 'error' : 'warning';
          (severity === 'error' ? errors : warnings).push({
            type: 'missing_file',
            severity,
            feature,
            details: `File ${filename} missing file-level header comment with @llm-rule annotations`,
            suggestions: ['Add file-level header comment with @module, @file, and @llm-rule tags']
          });
        }
        
        // For strict mode, check method-level comments
        if (commentLevel === 'strict') {
          const methods = this.extractMethods(content);
          const missingComments = methods.filter(method => !this.hasMethodComment(content, method));
          
          for (const method of missingComments) {
            errors.push({
              type: 'missing_file',
              severity: 'error',
              feature,
              details: `Method '${method}' in ${filename} missing @llm-rule comment`,
              suggestions: [`Add @llm-rule WHEN/AVOID comments to ${method} method`]
            });
          }
        }
      }
      
    } catch (error: any) {
      warnings.push({
        type: 'missing_file',
        severity: 'warning',
        feature,
        details: `Error validating LLM comments: ${error.message}`
      });
    }
  }

  /**
   * Check if file has proper header comment with @llm-rule
   */
  private hasFileHeaderComment(content: string): boolean {
    const lines = content.split('\n').slice(0, 20); // Check first 20 lines
    const headerComment = lines.join('\n');
    
    return headerComment.includes('@llm-rule') && 
           (headerComment.includes('@module') || headerComment.includes('@file'));
  }

  /**
   * Extract method names from TypeScript content (only top-level and class methods)
   */
  private extractMethods(content: string): string[] {
    const methods: string[] = [];
    
    // Match only top-level functions and class methods (not method calls)
    const patterns = [
      // Export functions: export function name(), export async function name()
      /^export\s+(?:async\s+)?function\s+(\w+)\s*\(/gm,
      // Class static methods: static methodName(), static async methodName()
      /^\s*(?:public|private|protected)?\s*static\s+(?:async\s+)?(\w+)\s*\(/gm,
      // Class methods: methodName(), async methodName()
      /^\s*(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*[:{}]/gm
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const methodName = match[1];
        if (methodName && !methods.includes(methodName)) {
          methods.push(methodName);
        }
      }
    }
    
    return methods.filter(method => 
      !method.startsWith('_') && // Skip private methods
      method !== 'constructor' && // Skip constructors
      method.length > 2 && // Skip very short names
      !['get', 'set'].includes(method) // Skip getters/setters
    );
  }

  /**
   * Check if method has @llm-rule comment
   */
  private hasMethodComment(content: string, methodName: string): boolean {
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(methodName)) {
        // Look backwards for comment block
        for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
          if (lines[j].includes('@llm-rule')) {
            return true;
          }
          // Stop at non-comment line
          if (!lines[j].trim().startsWith('*') && 
              !lines[j].trim().startsWith('//') && 
              !lines[j].trim().startsWith('/**')) {
            break;
          }
        }
        break;
      }
    }
    
    return false;
  }

  /**
   * Validate implementation files against contract specifications
   */
  private async validateImplementationFiles(
    contract: VoilaFeatureContract, 
    basePath: string, 
    errors: ContractValidationError[], 
    warnings: ContractValidationError[]
  ): Promise<void> {
    const feature = contract.name;
    
    // Validate handler functions exist
    await this.validateHandlerImplementations(contract, basePath, errors, warnings);
    
    // Validate test implementations
    await this.validateTestImplementations(contract, basePath, errors, warnings);
    
    // Validate route implementations
    await this.validateRouteImplementations(contract, basePath, errors, warnings);
  }

  /**
   * Handler Implementation Validation - Ensures API handlers exist in service files
   * @llm-rule WHEN: Validating that contract endpoints have corresponding handler functions
   * @llm-rule AVOID: Missing handler implementations - causes runtime API failures
   */
  private async validateHandlerImplementations(
    contract: VoilaFeatureContract,
    basePath: string,
    errors: ContractValidationError[],
    warnings: ContractValidationError[]
  ): Promise<void> {
    const feature = contract.name;
    const featurePath = path.join(basePath, contract.app, 'features', contract.name);
    
    try {
      // Look for service files
      const serviceFiles = this.findFiles(featurePath, /\.services\.(ts|js)$/);
      
      if (serviceFiles.length === 0) {
        errors.push({
          type: 'missing_file',
          severity: 'error',
          feature,
          details: 'No service files found for handler implementations'
        });
        return;
      }

      for (const endpoint of contract.api.endpoints) {
        const [serviceName, methodName] = endpoint.handler.split('.');
        let handlerFound = false;

        for (const serviceFile of serviceFiles) {
          const content = await fs.promises.readFile(serviceFile, 'utf-8');
          
          // Check for various export patterns including static class methods
          const patterns = [
            new RegExp(`export\\s+(?:async\\s+)?function\\s+${methodName}\\s*\\(`),
            new RegExp(`${methodName}\\s*:\\s*(?:async\\s+)?function`),
            new RegExp(`${methodName}\\s*=\\s*(?:async\\s+)?\\(`),
            new RegExp(`export\\s+const\\s+${methodName}\\s*=`),
            new RegExp(`static\\s+(?:async\\s+)?${methodName}\\s*\\(`)
          ];

          if (patterns.some(pattern => pattern.test(content))) {
            handlerFound = true;
            break;
          }
        }

        if (!handlerFound) {
          errors.push({
            type: 'missing_handler',
            severity: 'error',
            feature,
            details: `Handler function '${endpoint.handler}' not found in service files`,
            suggestions: [`Implement ${endpoint.handler} in service file`]
          });
        }
      }
    } catch (error: any) {
      errors.push({
        type: 'missing_file',
        severity: 'error',
        feature,
        details: `Error validating handler implementations: ${error.message}`
      });
    }
  }

  /**
   * Validate that test implementations match contract test declarations
   */
  private async validateTestImplementations(
    contract: VoilaFeatureContract,
    basePath: string,
    errors: ContractValidationError[],
    warnings: ContractValidationError[]
  ): Promise<void> {
    const feature = contract.name;
    const featurePath = path.join(basePath, contract.app, 'features', contract.name);
    
    try {
      const testFiles = this.findFiles(featurePath, /\.test\.(ts|js)$/);
      
      if (testFiles.length === 0) {
        warnings.push({
          type: 'missing_file',
          severity: 'warning',
          feature,
          details: 'No test files found'
        });
        return;
      }

      const contractTests = contract.tests || [];
      if (contractTests.length === 0) return;

      for (const testFile of testFiles) {
        const content = await fs.promises.readFile(testFile, 'utf-8');
        const implementedTests = this.extractTestDescriptions(content);

        for (const contractTest of contractTests) {
          const testFound = implementedTests.some(
            implTest => this.normalizeTestDescription(implTest) === this.normalizeTestDescription(contractTest)
          );

          if (!testFound) {
            errors.push({
              type: 'missing_test',
              severity: 'error',
              feature,
              details: `Contract test not implemented: "${contractTest}"`,
              suggestions: [`Add test case for: ${contractTest}`]
            });
          }
        }
      }
    } catch (error: any) {
      warnings.push({
        type: 'missing_file',
        severity: 'warning',
        feature,
        details: `Error validating test implementations: ${error.message}`
      });
    }
  }

  /**
   * Validate that route implementations match contract endpoint declarations
   */
  private async validateRouteImplementations(
    contract: VoilaFeatureContract,
    basePath: string,
    errors: ContractValidationError[],
    warnings: ContractValidationError[]
  ): Promise<void> {
    const feature = contract.name;
    
    try {
      // Look for the specific feature's route file: {app}/features/{feature}/{feature}.routes.ts
      const expectedRouteFile = path.join(basePath, contract.app, 'features', contract.name, `${contract.name}.routes.ts`);
      
      if (!fs.existsSync(expectedRouteFile)) {
        errors.push({
          type: 'missing_file',
          severity: 'error',
          feature,
          details: `Route file not found: ${expectedRouteFile}`
        });
        return;
      }

      const content = await fs.promises.readFile(expectedRouteFile, 'utf-8');

      for (const endpoint of contract.api.endpoints) {
        const methodLower = endpoint.method.toLowerCase();
        const routePath = endpoint.path;
        
        // Check for route definition patterns (excluding commented lines)
        const lines = content.split('\n');
        let routeFound = false;
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          // Skip commented lines
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
            continue;
          }
          
          // Look for router.{method}('{path}', pattern
          const routePattern = `router.${methodLower}('${routePath}'`;
          if (line.includes(routePattern)) {
            routeFound = true;
            break;
          }
        }

        if (!routeFound) {
          errors.push({
            type: 'invalid_endpoint',
            severity: 'error',
            feature,
            details: `Route ${endpoint.method} ${endpoint.path} not found in route file: ${expectedRouteFile}`,
            suggestions: [`Add route definition: router.${methodLower}('${routePath}')`]
          });
        }
      }
    } catch (error: any) {
      errors.push({
        type: 'missing_file',
        severity: 'error',
        feature,
        details: `Error validating route implementations: ${error.message}`
      });
    }
  }

  /**
   * Find files matching pattern in directory
   */
  private findFiles(basePath: string, pattern: RegExp): string[] {
    const files: string[] = [];
    
    try {
      const entries = fs.readdirSync(basePath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(basePath, entry.name);
        
        if (entry.isFile() && pattern.test(entry.name)) {
          files.push(fullPath);
        } else if (entry.isDirectory()) {
          files.push(...this.findFiles(fullPath, pattern));
        }
      }
    } catch (error: any) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
  }

  /**
   * Extract test descriptions from test file content
   */
  private extractTestDescriptions(testContent: string): string[] {
    const descriptions: string[] = [];
    const testRegex = /(?:test|it)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let match;

    while ((match = testRegex.exec(testContent)) !== null) {
      descriptions.push(match[1]);
    }

    return descriptions;
  }

  /**
   * Normalize test description for comparison
   */
  private normalizeTestDescription(description: string): string {
    return description.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  /**
   * Validate all contracts for cross-feature dependencies
   */
  async validateAllContracts(basePath?: string): Promise<Record<string, ContractValidationResult>> {
    const results: Record<string, ContractValidationResult> = {};

    // Validate individual contracts using validation system
    for (const [featureName, contract] of this.contracts) {
      results[featureName] = validateContract(contract, Array.from(this.contracts.values()));
    }

    // Check for circular dependencies
    const cycles = this.checkCircularDependencies();
    if (cycles.length > 0) {
      cycles.forEach(cycle => {
        const features = cycle.split(' -> ');
        features.forEach(feature => {
          if (results[feature]) {
            results[feature].errors.push({
              type: 'dependency_unresolved',
              severity: 'error',
              feature,
              details: `Circular dependency detected: ${cycle}`,
              suggestions: ['Refactor to remove circular dependency']
            });
            results[feature].valid = false;
          }
        });
      });
    }

    return results;
  }

  /**
   * Check for circular dependencies
   */
  checkCircularDependencies(): string[] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[] = [];

    const dfs = (node: string, path: string[]): void => {
      if (recursionStack.has(node)) {
        const cycleStart = path.indexOf(node);
        cycles.push(path.slice(cycleStart).concat(node).join(' -> '));
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      recursionStack.add(node);

      const dependencies = this.dependencyGraph.get(node) || [];
      dependencies.forEach(dep => {
        dfs(dep, [...path, node]);
      });

      recursionStack.delete(node);
    };

    for (const feature of this.contracts.keys()) {
      if (!visited.has(feature)) {
        dfs(feature, []);
      }
    }

    return cycles;
  }

  /**
   * OpenAPI Generator - Creates OpenAPI 3.0 spec from feature contracts
   * @llm-rule WHEN: Need standards-compliant API documentation for tools and consumers
   * @llm-rule AVOID: Manual OpenAPI creation - contracts provide single source of truth
   */
  generateOpenAPI(): object {
    const openapi = {
      openapi: '3.0.0',
      info: {
        title: 'Voila Framework API',
        version: '1.0.0',
        description: 'Auto-generated API documentation from feature contracts'
      },
      paths: {} as any,
      components: {
        schemas: {} as any
      }
    };

    for (const [featureName, contract] of this.contracts) {
      contract.api.endpoints.forEach(endpoint => {
        const fullPath = `${contract.api.basePath}${endpoint.path}`.replace(/\/$/, '') || '/';
        
        if (!openapi.paths[fullPath]) {
          openapi.paths[fullPath] = {};
        }

        openapi.paths[fullPath][endpoint.method.toLowerCase()] = {
          summary: endpoint.summary,
          tags: endpoint.tags,
          parameters: endpoint.path.includes(':') ? [
            {
              name: endpoint.path.split(':')[1],
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ] : undefined,
          responses: {
            200: {
              description: 'Success',
              content: {
                'application/json': {
                  schema: endpoint.responseSchema
                }
              }
            },
            400: { description: 'Bad Request' },
            500: { description: 'Internal Server Error' }
          }
        };
      });
    }

    return openapi;
  }

  /**
   * Get contract summary for debugging
   */
  getContractSummary(): {
    totalContracts: number;
    totalEndpoints: number;
    features: string[];
    apps: string[];
  } {
    const features = Array.from(this.contracts.keys());
    const apps = [...new Set(Array.from(this.contracts.values()).map(c => c.app))];
    const totalEndpoints = Array.from(this.contracts.values())
      .reduce((sum, contract) => sum + contract.api.endpoints.length, 0);

    return {
      totalContracts: features.length,
      totalEndpoints,
      features,
      apps
    };
  }

  private findServiceProvider(serviceName: string): string | null {
    for (const [featureName, contract] of this.contracts) {
      const services = this.getContractServices(contract);
      if (services.includes(serviceName)) {
        return featureName;
      }
    }
    return null;
  }

  // Helper to handle both legacy and refined contract formats
  private getContractServices(contract: any): string[] {
    // Refined contract format
    if (contract.services?.provides) {
      return contract.services.provides;
    }
    // Legacy contract format
    if (contract.provides?.services) {
      return contract.provides.services;
    }
    return [];
  }

  // Helper to get service consumptions from contract
  private getContractServiceConsumptions(contract: VoilaFeatureContract): string[] {
    if (contract.services?.consumes && Array.isArray(contract.services.consumes)) {
      return contract.services.consumes.map((c: any) => typeof c === 'string' ? c : c.service);
    }
    return [];
  }

  private updateDependencyGraph(): void {
    this.dependencyGraph.clear();
    
    for (const [featureName, contract] of this.contracts) {
      const dependencies: string[] = [];
      
      // Add internal feature dependencies from file dependencies
      if (contract.dependencies?.files) {
        Object.values(contract.dependencies.files).forEach(fileDeps => {
          if (fileDeps.internal) {
            fileDeps.internal.forEach(dep => {
              if (this.contracts.has(dep)) {
                dependencies.push(dep);
              }
            });
          }
        });
      }

      // Add service dependencies
      const serviceConsumptions = this.getContractServiceConsumptions(contract);
      serviceConsumptions.forEach(service => {
        const provider = this.findServiceProvider(service);
        if (provider && provider !== featureName) {
          dependencies.push(provider);
        }
      });

      this.dependencyGraph.set(featureName, [...new Set(dependencies)]);
    }
  }
}

// ===== GLOBAL REGISTRY INSTANCE =====

/**
 * Global Contract Registry - Singleton instance for application-wide contract management
 * @llm-rule WHEN: Need centralized contract registry across the application
 * @llm-rule AVOID: Creating multiple registry instances - breaks contract consistency
 */
export const contractRegistry = new VoilaContractRegistry();

// ===== HELPER FUNCTIONS =====


/**
 * Contract Validation with Fail-Fast - Validates all contracts and throws on errors
 * @llm-rule WHEN: Server startup validation to prevent running with invalid contracts
 * @llm-rule AVOID: Ignoring validation errors - leads to runtime API failures
 */
export async function validateAllContractsOrThrow(basePath?: string): Promise<void> {
  const results = await contractRegistry.validateAllContracts(basePath);
  const failures = Object.entries(results).filter(([, result]) => !result.valid);
  
  if (failures.length > 0) {
    const errorMessages = failures.map(([feature, result]) => {
      const errors = result.errors.map(err => 
        `[${err.type}] ${err.details}${err.suggestions && err.suggestions.length > 0 ? ` (Suggestions: ${err.suggestions.join(', ')})` : ''}`
      );
      return `${feature}:\n  - ${errors.join('\n  - ')}`;
    });
    throw new Error(`Contract validation failed:\n\n${errorMessages.join('\n\n')}`);
  }

  // Show warnings if any
  const warnings = Object.entries(results).flatMap(([feature, result]) => 
    result.warnings.map(warn => `${feature}: [${warn.type}] ${warn.details}`)
  );
  
  if (warnings.length > 0) {
    console.warn(`⚠️  Contract warnings:\n  - ${warnings.join('\n  - ')}`);
  }

  const summary = contractRegistry.getContractSummary();
  console.log(`✅ Contract validation passed: ${summary.totalContracts} features, ${summary.totalEndpoints} endpoints`);
}

// ===== CONTRACT DISCOVERY & VALIDATION MODULE =====
// Auto-discovery and validation of contracts from filesystem

interface ValidationStats {
  apps: number;
  features: number;
  endpoints: number;
  totalContracts: number;
  validContracts: number;
  invalidContracts: number;
}

interface ValidationResult {
  success: boolean;
  errors: any[];
  warnings: any[];
  stats: ValidationStats;
  results: any;
}

interface DiscoveredContract {
  app: string;
  feature: string;
  contract: VoilaFeatureContract;
}

interface DiscoveryResult {
  contracts: DiscoveredContract[];
  stats: ValidationStats;
}

/**
 * Main Validation Entry Point - Discovers and validates contracts from filesystem
 * @llm-rule WHEN: Running validation scripts or server startup validation
 * @llm-rule AVOID: Direct file system access - use this function for proper discovery
 * @llm-rule NOTE: Supports single app validation or full API validation
 */
export async function validateContracts(apiPath: string, targetApp: string | null = null, targetFeature: string | null = null): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: false,
    errors: [],
    warnings: [],
    stats: {
      apps: 0,
      features: 0,
      endpoints: 0,
      totalContracts: 0,
      validContracts: 0,
      invalidContracts: 0
    },
    results: {}
  };

  try {
    // Discover and register contracts
    const discovered = await discoverAndRegisterContracts(apiPath, targetApp, targetFeature);
    result.stats = discovered.stats;

    if (discovered.contracts.length === 0) {
      if (targetApp && targetFeature) {
        throw new Error(`No contracts found for app: ${targetApp}/${targetFeature}`);
      } else if (targetApp) {
        throw new Error(`No contracts found for app: ${targetApp}`);
      } else {
        console.log('⚠️  No contracts found to validate');
        result.success = true;
        return result;
      }
    }

    // Validate all registered contracts
    const validationResults = await contractRegistry.validateAllContracts(apiPath);
    
    // Collect errors and warnings
    for (const [featureName, validation] of Object.entries(validationResults)) {
      result.errors.push(...validation.errors);
      result.warnings.push(...validation.warnings);
    }

    result.success = result.errors.length === 0;
    return result;

  } catch (error: any) {
    result.errors.push({
      feature: 'system',
      type: 'validation_error' as any,
      severity: 'error',
      details: error.message
    });
    return result;
  }
}

/**
 * Contract Discovery Engine - Auto-discovers contracts from API directory structure
 * @llm-rule WHEN: Scanning filesystem for feature contracts during validation
 * @llm-rule AVOID: Manual contract registration - breaks auto-discovery benefits
 */
async function discoverAndRegisterContracts(apiPath: string, targetApp: string | null, targetFeature: string | null = null): Promise<DiscoveryResult> {
  const stats = { apps: 0, features: 0, endpoints: 0, totalContracts: 0, validContracts: 0, invalidContracts: 0 };
  const contracts: DiscoveredContract[] = [];

  // Get all app directories
  const appDirs = readdirSync(apiPath).filter(dir => {
    const appPath = join(apiPath, dir);
    return statSync(appPath).isDirectory() && 
           (!targetApp || dir === targetApp);
  });

  for (const appName of appDirs) {
    stats.apps++;
    const appPath = join(apiPath, appName);
    const featuresPath = join(appPath, 'features');

    // Check if features directory exists
    try {
      if (!statSync(featuresPath).isDirectory()) {
        continue;
      }
    } catch (error) {
      continue; // No features folder
    }

    // Get all feature directories
    const featureDirs = readdirSync(featuresPath).filter(dir => {
      const featurePath = join(featuresPath, dir);
      return statSync(featurePath).isDirectory() && 
             (!targetFeature || dir === targetFeature);
    });

    for (const featureName of featureDirs) {
      // Check if feature is enabled before processing
      const environment = process.env.NODE_ENV || 'development';
      if (!isFeatureEnabled(apiPath, appName, featureName, environment)) {
        continue;
      }

      const featurePath = join(featuresPath, featureName);
      
      // Try both .js (compiled) and .ts (source) files
      const contractPaths = [
        join(featurePath, `${featureName}.index.js`),   // Compiled JavaScript
        join(featurePath, `${featureName}.index.ts`)    // TypeScript source
      ];

      let contractFound = false;
      
      for (const contractPath of contractPaths) {
        try {
          // Check if file exists using fs from imports
          if (!fs.existsSync(contractPath)) {
            continue;
          }

          console.log(`🔍 Trying to load contract: ${contractPath}`);
          
          // Try to import the contract
          const contractModule = await import(`file://${contractPath}`);
          const contract = contractModule.default;

          if (contract) {
            const contractKey = `${appName}.${featureName}`;
            await contractRegistry.register(contractKey, contract);
            
            contracts.push({ app: appName, feature: featureName, contract });
            stats.features++;
            stats.endpoints += contract.api?.endpoints?.length || 0;
            
            console.log(`📋 Registered: ${contractKey}`);
            contractFound = true;
            break;
          }
        } catch (error: any) {
          console.log(`⚠️  Failed to load ${contractPath}: ${error.message}`);
          if (process.env.DEBUG) {
            console.log(`   Stack: ${error.stack}`);
          }
        }
      }
      
      if (!contractFound) {
        console.log(`⚠️  No contract found for ${appName}/${featureName}`);
        console.log(`   Tried paths: ${contractPaths.join(', ')}`);
      }
    }
  }

  return { contracts, stats };
}

export async function validateApp(apiPath: string, appName: string): Promise<ValidationResult> {
  return await validateContracts(apiPath, appName);
}

export async function validateAllApps(apiPath: string): Promise<ValidationResult> {
  return await validateContracts(apiPath);
}

/**
 * Feature Toggle System - Determines if feature is enabled for environment
 * @llm-rule WHEN: Checking feature flags and environment-based feature enablement
 * @llm-rule AVOID: Hardcoded feature states - use config files for environment control
 * @llm-rule NOTE: Defaults to enabled if no config found for rapid prototyping
 */
export function isFeatureEnabled(apiPath: string, appName: string, featureName: string, environment: string = 'development'): boolean {
  try {
    const configPath = join(apiPath, appName, `${appName}.api.config.json`);
    const configContent = readFileSync(configPath, 'utf-8');
    const config: VoilaAppConfig = JSON.parse(configContent);
    
    // Check app level
    if (!config.enabled || !config.environments.includes(environment)) {
      console.log(`⏭️  App ${appName} disabled for ${environment}`);
      return false;
    }
    
    // Check feature level
    const feature = config.features[featureName];
    if (!feature) {
      console.log(`⚠️  Feature ${featureName} not found in ${appName} config, defaulting to enabled`);
      return true; // Default to enabled if feature not in config
    }
    
    if (!feature.enabled || !feature.environments.includes(environment)) {
      console.log(`⏭️  Feature ${appName}/${featureName} disabled for ${environment}`);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.log(`⚠️  No config found for ${appName}, defaulting features to enabled`);
    return true; // Default to enabled if no config file
  }
}

// ===== REFINED CONTRACT VALIDATION SYSTEM =====

/**
 * Validate Refined Feature Contract - Enhanced validation with validation levels and bidirectional checks
 * @llm-rule WHEN: Validating refined contracts with service/event communication and auth requirements
 * @llm-rule AVOID: Skipping validation levels - breaks consistency across development phases
 * @llm-rule NOTE: none=no validation, basic=endpoints only, strict=full validation
 */
export function validateContract(contract: VoilaFeatureContract, allContracts?: VoilaFeatureContract[]): ContractValidationResult {
  const errors: ContractValidationError[] = [];
  const warnings: ContractValidationError[] = [];
  const feature = `${contract.app}.${contract.name}`;

  // Skip validation if level is 'none'
  if (contract.validation === 'none') {
    return { valid: true, errors: [], warnings: [], featureName: feature };
  }

  // === BASIC VALIDATION (Critical for startups) ===
  // Always validate API endpoints (critical for API consumers)
  validateRefinedEndpoints(contract, errors, warnings);

  // === STRICT VALIDATION (Enterprise requirements) ===
  if (contract.validation === 'strict') {
    validateDependencies(contract, errors, warnings);
    validateServiceCommunication(contract, allContracts || [], errors, warnings);  
    validateEventCommunication(contract, allContracts || [], errors, warnings);
    validateTests(contract, errors, warnings);
  }

  const valid = errors.length === 0;
  return { valid, errors, warnings, featureName: feature };
}

/**
 * Validate Refined API Endpoints - Validates endpoints with AppKit auth requirements
 */
function validateRefinedEndpoints(contract: VoilaFeatureContract, errors: ContractValidationError[], warnings: ContractValidationError[]) {
  const feature = `${contract.app}.${contract.name}`;

  if (!contract.api?.endpoints?.length) {
    errors.push({
      type: 'invalid_endpoint',
      severity: 'error',
      feature,
      details: 'Feature must define at least one API endpoint'
    });
    return;
  }

  contract.api.endpoints.forEach((endpoint, index) => {
    // Basic endpoint validation
    if (!endpoint.method) {
      errors.push({
        type: 'invalid_endpoint',
        severity: 'error', 
        feature,
        details: `Endpoint ${index}: method is required`
      });
    }

    if (!endpoint.path) {
      errors.push({
        type: 'invalid_endpoint',
        severity: 'error',
        feature,
        details: `Endpoint ${index}: path is required`
      });
    }

    if (!endpoint.responseSchema) {
      errors.push({
        type: 'invalid_endpoint',
        severity: 'error',
        feature,
        details: `Endpoint ${index}: responseSchema is required`
      });
    }

    // Auth validation
    if (!endpoint.auth) {
      errors.push({
        type: 'invalid_endpoint',
        severity: 'error',
        feature,
        details: `Endpoint ${index}: auth configuration is required`
      });
    } else {
      validateEndpointAuth(endpoint, index, feature, errors, warnings);
    }
  });
}

/**
 * Validate Endpoint Auth - Validates AppKit auth configuration
 */
function validateEndpointAuth(endpoint: VoilaFeatureEndpoint, index: number, feature: string, errors: ContractValidationError[], warnings: ContractValidationError[]) {
  const validAuthTypes = ['public', 'api_key', 'login', 'admin'];
  const validRoles = ['admin.tenant', 'admin.system'];

  if (!validAuthTypes.includes(endpoint.auth.type)) {
    errors.push({
      type: 'invalid_endpoint',
      severity: 'error',
      feature,
      details: `Endpoint ${index}: invalid auth type '${endpoint.auth.type}'. Must be one of: ${validAuthTypes.join(', ')}`
    });
  }

  // Admin type must have roles
  if (endpoint.auth.type === 'admin') {
    if (!endpoint.auth.roles || endpoint.auth.roles.length === 0) {
      errors.push({
        type: 'invalid_endpoint',
        severity: 'error',
        feature,
        details: `Endpoint ${index}: admin auth type requires roles array`
      });
    } else {
      // Check for unknown roles
      const unknownRoles = endpoint.auth.roles.filter(role => !validRoles.includes(role));
      if (unknownRoles.length > 0) {
        warnings.push({
          type: 'invalid_endpoint',
          severity: 'warning',
          feature,
          details: `Endpoint ${index}: unknown AppKit roles: ${unknownRoles.join(', ')}. Known roles: ${validRoles.join(', ')}`
        });
      }
    }
  }

  // Warn about unnecessary roles for non-admin types
  if (endpoint.auth.type !== 'admin' && endpoint.auth.roles && endpoint.auth.roles.length > 0) {
    warnings.push({
      type: 'invalid_endpoint',
      severity: 'warning',
      feature,
      details: `Endpoint ${index}: roles specified for non-admin auth type '${endpoint.auth.type}'`
    });
  }
}

/**
 * Validate Service Communication - Bidirectional service dependency validation
 */
function validateServiceCommunication(contract: VoilaFeatureContract, allContracts: VoilaFeatureContract[], errors: ContractValidationError[], warnings: ContractValidationError[]) {
  const feature = `${contract.app}.${contract.name}`;

  // Defensive check for services structure
  if (!contract.services) {
    errors.push({
      type: 'schema_mismatch',
      severity: 'error',
      feature,
      details: 'Refined contract must have services section'
    });
    return;
  }

  // Validate service consumptions exist
  if (contract.services.consumes) {
    contract.services.consumes.forEach(consumption => {
      const providerContract = allContracts.find(c => c.app === consumption.app && c.name === consumption.feature);
      
      if (!providerContract) {
        errors.push({
          type: 'dependency_unresolved',
          severity: 'error',
          feature,
          details: `Service dependency broken: consumes ${consumption.app}/${consumption.feature}.${consumption.service} but provider feature not found`
        });
        return;
      }

      if (!providerContract.services?.provides?.includes(consumption.service)) {
        errors.push({
          type: 'dependency_unresolved',
          severity: 'error',
          feature,
          details: `Service not provided: ${consumption.app}/${consumption.feature} does not provide service '${consumption.service}'`
        });
      }
    });
  }
}

/**
 * Validate Event Communication - Bidirectional event flow validation  
 */
function validateEventCommunication(contract: VoilaFeatureContract, allContracts: VoilaFeatureContract[], errors: ContractValidationError[], warnings: ContractValidationError[]) {
  const feature = `${contract.app}.${contract.name}`;

  // Defensive check for events structure
  if (!contract.events) {
    errors.push({
      type: 'schema_mismatch',
      severity: 'error',
      feature,
      details: 'Refined contract must have events section'
    });
    return;
  }

  // Validate event subscriptions have emitters
  if (contract.events.listens) {
    contract.events.listens.forEach(subscription => {
      const hasEmitter = allContracts.some(c => 
        c.events?.emits?.some(emission => 
          emission.namespace === subscription.namespace && 
          emission.event === subscription.event
        )
      );
      
      if (!hasEmitter) {
        warnings.push({
          type: 'dependency_unresolved',
          severity: 'warning',
          feature,
          details: `Event subscription orphaned: listens to ${subscription.namespace}:${subscription.event} but no emitter found`
        });
      }
    });
  }

  // Warn about unused event emissions (nice to have)  
  if (contract.events.emits) {
    contract.events.emits.forEach(emission => {
      const hasListener = allContracts.some(c =>
        c.events?.listens?.some(subscription =>
          subscription.namespace === emission.namespace &&
          subscription.event === emission.event
        )
      );

      if (!hasListener) {
        warnings.push({
          type: 'dependency_unresolved', 
          severity: 'warning',
          feature,
          details: `Event emission unused: emits ${emission.namespace}:${emission.event} but no listener found`
        });
      }
    });
  }
}

/**
 * Validate Dependencies - File-level dependency validation (for AI constraints)
 */
function validateDependencies(contract: VoilaFeatureContract, errors: ContractValidationError[], warnings: ContractValidationError[]) {
  const feature = `${contract.app}.${contract.name}`;

  if (!contract.dependencies?.files || Object.keys(contract.dependencies.files).length === 0) {
    warnings.push({
      type: 'dependency_unresolved',
      severity: 'warning',
      feature,
      details: 'No file dependencies declared - AI code generation may be inconsistent'
    });
  }
}

/**
 * Validate Tests - Test coverage validation
 */
function validateTests(contract: VoilaFeatureContract, errors: ContractValidationError[], warnings: ContractValidationError[]) {
  const feature = `${contract.app}.${contract.name}`;

  if (!contract.tests || contract.tests.length === 0) {
    warnings.push({
      type: 'missing_test',
      severity: 'warning',
      feature,
      details: 'No tests defined - feature may be untested'
    });
  }

  // Suggest minimum test coverage based on endpoints
  const endpointCount = contract.api.endpoints.length;
  if (contract.tests.length < endpointCount) {
    warnings.push({
      type: 'missing_test',
      severity: 'warning',
      feature,
      details: `Low test coverage: ${contract.tests.length} tests for ${endpointCount} endpoints. Consider adding more tests.`
    });
  }
}

/**
 * Validate All Refined Contracts - Batch validation with cross-contract checks
 */
export function validateAllRefinedContracts(contracts: VoilaFeatureContract[]): ValidationResult {
  let success = true;
  const errors: ContractValidationError[] = [];
  const warnings: ContractValidationError[] = [];
  const results: Record<string, ContractValidationResult> = {};

  contracts.forEach(contract => {
    const result = validateContract(contract, contracts);
    const featureName = `${contract.app}.${contract.name}`;
    
    results[featureName] = result;
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    
    if (!result.valid) {
      success = false;
    }
  });

  return {
    success,
    errors,
    warnings,
    stats: {
      apps: 0,
      features: 0,
      endpoints: 0,
      totalContracts: contracts.length,
      validContracts: Object.values(results).filter(r => r.valid).length,
      invalidContracts: Object.values(results).filter(r => !r.valid).length
    },
    results
  };
}

/**
 * Create Refined Feature Contract - Helper function with validation
 */
export function createFeatureContract(contract: VoilaFeatureContract): VoilaFeatureContract {
  const validation = validateContract(contract);
  
  if (!validation.valid && contract.validation !== 'none') {
    console.warn(`Contract validation warnings for ${validation.featureName}:`, validation.warnings);
    if (validation.errors.length > 0) {
      console.error(`Contract validation errors for ${validation.featureName}:`, validation.errors);
    }
  }

  return contract;
}

