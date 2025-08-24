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

// ✅ EXPLICIT CONTRACT: Location search and validation feature
const SearchFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: 'search',
  app: 'climate',
  description: 'Location search and validation with OpenWeatherMap geocoding integration',
  contract_validation: 'basic', // strict | basic | none
  llm_comments: 'basic', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/climate/weather',
    endpoints: [
      {
        method: 'GET',
        path: '/search',
        handler: 'SearchService.searchLocations',
        summary: 'Search for locations by name with coordinates and country information',
        requestSchema: 'LocationSearchRequestSchema',
        responseSchema: 'LocationSearchResponse'
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

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['SearchService'],
    routes: ['/api/climate/weather/search'],
    types: ['LocationSearchResponse', 'LocationResult', 'LocationSearchRequest'],
    schemas: ['LocationSearchRequestSchema']
  },

  // === CONSUMES (What this feature uses from other parts) ===
  consumes: {
    services: [], // No internal services consumed
    state: [],
    events: []
    // External APIs (OpenWeatherMap Geocoding) are handled via configuration
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