/**
 * Weather Feature Contract - Living Documentation & Configuration
 * @module climate/weather
 * @file src/api/climate/features/weather/weather.index.ts
 * 
 * @llm-rule WHEN: Defining weather API contract for external API integration
 * @llm-rule AVOID: Changing contract endpoints without updating API specification
 * @llm-rule NOTE: Contract enforces weather API consistency with OpenWeatherMap integration
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ EXPLICIT CONTRACT: Weather API with external service integration
const WeatherFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: 'weather',
  app: 'climate',
  description: 'Weather feature providing current conditions via OpenWeatherMap API with caching and proper error handling',
  contract_validation: 'basic', // strict | basic | none
  llm_comments: 'basic', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/climate/weather',
    endpoints: [
      {
        method: 'GET',
        path: '/current',
        handler: 'WeatherService.getCurrentWeather',
        summary: 'Get current weather by city name or coordinates',
        requestSchema: 'WeatherRequestSchema',
        responseSchema: 'WeatherResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "weather.services.ts": {
        appkit: ["util", "logger", "error", "security", "cache", "config"],
        external: ["express", "node-fetch"],
        relative: ["./weather.types"]
      },
      "weather.routes.ts": {
        external: ["express"],
        relative: ["./weather.services"]
      },
      "weather.types.ts": {
        external: ["zod"]
      },
      "weather.models.ts": {
        external: []
      },
      "weather.test.ts": {
        external: ["vitest", "supertest"],
        relative: ["./weather.routes"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['WeatherService'],
    routes: ['/api/climate/weather/current'],
    types: ['WeatherResponse', 'WeatherData', 'WeatherRequest', 'WeatherErrorResponse'],
    schemas: ['WeatherRequestSchema']
  },

  // === CONSUMES (What this feature uses from other parts) ===
  consumes: {
    services: [], // No internal services consumed
    state: [],
    events: []
    // External APIs (OpenWeatherMapAPI, WeatherAPI.com) are handled via configuration
  },

  // === TESTS ===
  tests: [
    'should return weather for valid city name',
    'should return weather for valid coordinates', 
    'should handle invalid city names with 404 error',
    'should handle invalid coordinates with 400 error',
    'should cache weather responses for 5 minutes',
    'should handle external API failures gracefully'
  ]
});

// ✅ EXPORT: Contract for registration
export default WeatherFeatureContract;