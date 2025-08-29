/**
 * Search Feature Contract - Living Documentation & Configuration
 * @module climate/search
 * @file src/api/climate/features/search/search.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ CONTRACT: Location search with validation levels and bidirectional communication
const SearchFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === IDENTITY ===
  name: 'search',
  app: 'climate',
  description: 'Location search and validation with OpenWeatherMap geocoding integration',
  validation: 'basic', // none | basic | essential | strict
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/climate/search',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'SearchService.searchLocations',
        summary: 'Search for locations by name with coordinates and country information',
        requestSchema: 'LocationSearchRequestSchema',
        responseSchema: 'LocationSearchResponse',
        auth: { type: 'public' }
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "search.services.ts": {
        appkit: ["util", "logger", "error", "security", "cache", "config"],
        external: ["express", "node-fetch"],
        relative: ["./search.types"]
      },
      "search.routes.ts": {
        external: ["express"],
        relative: ["./search.services"]
      },
      "search.types.ts": {
        external: ["zod"]
      },
      "search.models.ts": {
        external: []
      },
      "search.test.ts": {
        external: ["vitest", "supertest"],
        relative: ["./search.routes"]
      }
    }
  },

  // === BIDIRECTIONAL COMMUNICATION ===
  services: {
    provides: ['SearchService'],
    consumes: [] // No service dependencies
  },

  events: {
    emits: [], // No events emitted
    listens: [] // No event subscriptions
  },

  // === TESTS ===
  tests: [
    'should return locations for valid query string',
    'should respect limit parameter (1-10 max)',
    'should handle empty query with 400 error',
    'should handle query too long with 400 error',
    'should cache search results for 1 hour',
    'should handle external API failures gracefully'
  ]
});

// ✅ EXPORT: Contract for registration
export default SearchFeatureContract;