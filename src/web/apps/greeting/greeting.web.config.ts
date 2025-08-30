/**
 * Greeting App Web Configuration
 * @file src/web/greeting/greeting.web.config.ts
 * 
 * App-level configuration for greeting frontend
 * Teams control their own API URLs and settings
 */

import { createAppApiClient, type AppApiConfig } from '../../../lib/web-api.js';

/**
 * Greeting App API Configuration
 * Configure URL based on deployment architecture:
 * - Monolith: /api/greeting (same server)
 * - Microservice: https://greeting-service.company.com
 */
export const greetingApiConfig: AppApiConfig = {
  baseUrl: process.env.GREETING_API_URL || '/api/greeting',
  retries: 3,
  timeout: 5000,
  headers: {
    'X-App': 'greeting'
  }
};

/**
 * Greeting App API Client
 * All greeting features should use this shared client
 */
export const GreetingApi = createAppApiClient(greetingApiConfig);

/**
 * Environment-specific configurations for different deployment scenarios
 */
export const greetingEnvironments = {
  monolith: {
    ...greetingApiConfig,
    baseUrl: '/api/greeting'
  },
  microservice: {
    ...greetingApiConfig,
    baseUrl: process.env.GREETING_SERVICE_URL || 'https://greeting-service.company.com'
  },
  development: {
    ...greetingApiConfig,
    baseUrl: 'http://localhost:8000/api/greeting'
  }
} as const;

/**
 * Switch environment for testing different deployment scenarios
 */
export function switchGreetingEnvironment(env: keyof typeof greetingEnvironments) {
  const config = greetingEnvironments[env];
  console.log(`[GreetingApp] Switching to ${env} environment: ${config.baseUrl}`);
  return createAppApiClient(config);
}