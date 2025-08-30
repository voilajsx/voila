/**
 * Admin App Web Configuration
 * @file src/web/admin/admin.web.config.ts
 * 
 * App-level configuration for admin frontend
 * Admin team controls their own API URLs and settings
 */

import { createAppApiClient, type AppApiConfig } from '../../../lib/web-api.js';

/**
 * Admin App API Configuration
 * Different from greeting - admin might be a separate microservice
 */
export const adminApiConfig: AppApiConfig = {
  baseUrl: process.env.ADMIN_API_URL || '/api/admin',
  retries: 5,        // Admin needs more retries for critical operations
  timeout: 10000,    // Admin needs longer timeouts  
  headers: {
    'X-App': 'admin',
    'X-Admin-Version': '1.0'
  }
};

/**
 * Admin App API Client
 * All admin features should use this shared client
 */
export const AdminApi = createAppApiClient(adminApiConfig);

/**
 * Environment-specific configurations for admin deployment scenarios
 */
export const adminEnvironments = {
  monolith: {
    ...adminApiConfig,
    baseUrl: '/api/admin'
  },
  microservice: {
    ...adminApiConfig,
    baseUrl: process.env.ADMIN_SERVICE_URL || 'https://admin-service.company.com',
    headers: {
      ...adminApiConfig.headers,
      'Authorization': `Bearer ${process.env.ADMIN_SERVICE_TOKEN}`
    }
  },
  development: {
    ...adminApiConfig,
    baseUrl: 'http://localhost:8000/api/admin'
  }
} as const;

/**
 * Switch environment for testing different deployment scenarios
 */
export function switchAdminEnvironment(env: keyof typeof adminEnvironments) {
  const config = adminEnvironments[env];
  console.log(`[AdminApp] Switching to ${env} environment: ${config.baseUrl}`);
  return createAppApiClient(config);
}