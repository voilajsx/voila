/**
 * Client Configuration Management - Frontend-only settings
 * @file src/lib/client-config.ts
 * 
 * Manages frontend client configuration separate from backend config
 */

export interface ClientApiConfig {
  timeout: number;
  retries: number;
  cache: {
    enabled: boolean;
    duration: number;
    strategy: 'memory' | 'localStorage' | 'sessionStorage';
  };
  headers: Record<string, string>;
}

export interface ClientConfig {
  app: string;
  client: {
    api: Record<string, ClientApiConfig>;
    ui: {
      theme: string;
      language: string;
      autoRefresh: boolean;
      debounceMs: number;
    };
  };
  metadata: any;
}

// In-memory cache for client configs
const clientConfigCache = new Map<string, ClientConfig>();

/**
 * Get client configuration for an app
 */
export async function getClientConfig(appName: string): Promise<ClientConfig | null> {
  const cacheKey = appName;
  
  // Return cached config if available
  if (clientConfigCache.has(cacheKey)) {
    return clientConfigCache.get(cacheKey)!;
  }
  
  try {
    // Try to load client config file
    const configPath = `./../../web/${appName}/${appName}.client.config.json`;
    const configModule = await import(/* @vite-ignore */ configPath);
    const config = configModule.default || configModule;
    
    // Cache the config
    clientConfigCache.set(cacheKey, config);
    return config;
    
  } catch (error) {
    console.warn(`[ClientConfig] No client config found for app '${appName}', using defaults`);
    return null;
  }
}

/**
 * Get combined API configuration (server base URL + client settings)
 */
export async function getCombinedApiConfig(appName: string, environment?: string): Promise<{
  baseUrl: string;
  timeout: number;
  retries: number;
  cache: ClientApiConfig['cache'];
  headers: Record<string, string>;
}> {
  const env = environment || process.env.NODE_ENV || 'development';
  
  // Get client config
  const clientConfig = await getClientConfig(appName);
  const clientApiConfig = clientConfig?.client.api[env] || {
    timeout: 10000,
    retries: 2,
    cache: { enabled: true, duration: 300000, strategy: 'memory' as const },
    headers: {}
  };
  
  // Get server base URL (browser uses proxy, server uses actual URL)
  let baseUrl: string;
  if (typeof window !== 'undefined') {
    // Browser - use proxy
    baseUrl = `/api/${appName}`;
  } else {
    // Server - would load from backend config
    baseUrl = `http://localhost:8000/api/${appName}`;
  }
  
  return {
    baseUrl,
    timeout: clientApiConfig.timeout,
    retries: clientApiConfig.retries,
    cache: clientApiConfig.cache,
    headers: clientApiConfig.headers
  };
}

/**
 * Get client UI config
 */
export async function getClientUIConfig(appName: string): Promise<ClientConfig['client']['ui']> {
  const clientConfig = await getClientConfig(appName);
  return clientConfig?.client.ui || {
    theme: 'default',
    language: 'en',
    autoRefresh: true,
    debounceMs: 300
  };
}

/**
 * Update client config at runtime
 */
export function updateClientConfig(appName: string, updates: Partial<ClientConfig>): void {
  const existing = clientConfigCache.get(appName);
  if (existing) {
    const updated = { ...existing, ...updates };
    clientConfigCache.set(appName, updated);
  }
}

/**
 * Clear client config cache
 */
export function clearClientConfigCache(): void {
  clientConfigCache.clear();
}