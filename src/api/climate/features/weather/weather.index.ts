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

// ✅ CONTRACT: Weather API with cross-app event emission and AppKit auth
const WeatherFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === IDENTITY ===
  name: 'weather',
  app: 'climate', 
  description: 'Weather API with cross-app event emission and OpenWeatherMap integration',
  validation: 'basic', // none | basic | essential | strict
  
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
        responseSchema: 'WeatherResponse',
        auth: { type: 'public' }
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

  // === BIDIRECTIONAL COMMUNICATION ===
  services: {
    provides: ['WeatherService'],
    consumes: [] // No service dependencies
  },

  events: {
    emits: [{
      namespace: 'climate_weather',
      event: 'weather.data.fetched',
      payload: 'WeatherEventData', 
      description: 'Emitted when weather data is successfully fetched from OpenWeatherMap'
    }],
    listens: [] // No event subscriptions
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