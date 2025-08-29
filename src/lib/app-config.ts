/**
 * App Configuration Utility - Enhanced API config management
 * @file src/lib/app-config.ts
 * 
 * Manages app-level configuration for microservice-ready architecture
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface AppApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  cache?: boolean;
  cacheTime?: number;
  headers?: Record<string, string>;
}

export interface AppConfig {
  app: string;
  enabled: boolean;
  environments: string[];
  api: Record<string, AppApiConfig>;
  features: Record<string, any>;
  metadata: any;
}

// Cache for loaded configs
const configCache = new Map<string, AppConfig>();

/**
 * Get app configuration for current environment
 */
export function getAppConfig(appName: string, environment?: string): {
  app: string;
  api: AppApiConfig;
  features: any;
} {
  const env = environment || process.env.NODE_ENV || 'development';
  const cacheKey = `${appName}:${env}`;
  
  // Return cached config if available
  if (configCache.has(cacheKey)) {
    const config = configCache.get(cacheKey)!;
    return {
      app: config.app,
      api: config.api[env] || config.api.development,
      features: config.features
    };
  }
  
  try {
    // Load config file
    const configPath = path.join(__dirname, '..', 'api', appName, `${appName}.config.json`);
    const configData = fs.readFileSync(configPath, 'utf8');
    const config: AppConfig = JSON.parse(configData);
    
    // Enhance config with API defaults if missing
    if (!config.api) {
      config.api = {
        development: {
          baseUrl: `http://localhost:8000/api/${appName}`,
          timeout: 10000,
          retries: 2,
          cache: true,
          cacheTime: 300000
        }
      };
    }
    
    // Validate environment exists
    if (!config.api[env]) {
      console.warn(`[AppConfig] Environment '${env}' not found for app '${appName}', using development`);
    }
    
    // Cache the config
    configCache.set(cacheKey, config);
    
    return {
      app: config.app,
      api: config.api[env] || config.api.development,
      features: config.features
    };
    
  } catch (error) {
    console.error(`[AppConfig] Failed to load config for app '${appName}':`, error);
    
    // Fallback to local development config
    return {
      app: appName,
      api: {
        baseUrl: `http://localhost:8000/api/${appName}`,
        timeout: 10000,
        retries: 2,
        cache: true,
        cacheTime: 300000
      },
      features: {}
    };
  }
}

/**
 * Get API base URL for specific app and environment
 */
export function getApiBaseUrl(appName: string, environment?: string): string {
  const config = getAppConfig(appName, environment);
  return config.api.baseUrl;
}

/**
 * Build full API URL from app service and relative endpoint
 */
export function buildApiUrl(appName: string, endpoint: string, environment?: string): string {
  const baseUrl = getApiBaseUrl(appName, environment);
  
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Remove trailing slash from baseUrl
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}${cleanEndpoint}`;
}

/**
 * List all available environments for an app
 */
export function getAppEnvironments(appName: string): string[] {
  try {
    const configPath = path.join(__dirname, '..', 'api', appName, `${appName}.config.json`);
    const configData = fs.readFileSync(configPath, 'utf8');
    const config: AppConfig = JSON.parse(configData);
    return Object.keys(config.api || {});
  } catch {
    return ['development', 'staging', 'production'];
  }
}

/**
 * Update API config for specific environment (hot reload)
 */
export function updateApiConfig(appName: string, environment: string, apiConfig: Partial<AppApiConfig>): void {
  const cacheKey = `${appName}:${environment}`;
  
  if (configCache.has(cacheKey)) {
    const config = configCache.get(cacheKey)!;
    config.api[environment] = { ...config.api[environment], ...apiConfig };
    console.log(`[AppConfig] Updated ${appName}:${environment} API config`);
  }
}

/**
 * Clear config cache (for testing)
 */
export function clearConfigCache(): void {
  configCache.clear();
}

/**
 * Validate app config structure
 */
export function validateAppConfig(appName: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const configPath = path.join(__dirname, '..', 'api', appName, `${appName}.config.json`);
    const configData = fs.readFileSync(configPath, 'utf8');
    const config: AppConfig = JSON.parse(configData);
    
    // Required fields
    if (!config.app) errors.push('Missing required field: app');
    if (!config.enabled === undefined) errors.push('Missing required field: enabled');
    
    // API configuration validation
    if (config.api) {
      Object.entries(config.api).forEach(([env, apiConfig]) => {
        if (!apiConfig.baseUrl) errors.push(`Missing baseUrl for environment: ${env}`);
        if (!apiConfig.timeout) warnings.push(`Missing timeout for environment: ${env}, using default`);
        if (!apiConfig.retries) warnings.push(`Missing retries for environment: ${env}, using default`);
        
        // Validate URL format
        if (apiConfig.baseUrl && !apiConfig.baseUrl.match(/^https?:\/\/.+/)) {
          errors.push(`Invalid baseUrl format for environment: ${env}`);
        }
      });
    } else {
      warnings.push('No API configuration found, will use defaults');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
    
  } catch (error: any) {
    errors.push(`Failed to load config: ${error?.message || error}`);
    return {
      valid: false,
      errors,
      warnings
    };
  }
}