/**
 * Supported Feature Contract - Living Documentation & Configuration
 * @module converter/supported
 * @file src/api/converter/features/supported/supported.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ EXPLICIT CONTRACT: Everything about this feature in one place
const SupportedFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: 'supported',
  app: 'converter',
  description: 'Supported feature for converter application with modern API patterns',
  contract_validation: 'none', // strict | basic | none
  llm_comments: 'none', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/converter/supported',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'SupportedService.getDefault',
        summary: 'Get default greeting from converter/supported',
        requestSchema: null,
        responseSchema: 'SupportedResponse'
      },
      {
        method: 'GET',
        path: '/:name',
        handler: 'SupportedService.greetByName',
        summary: 'Get personalized greeting from converter/supported',
        requestSchema: null,
        responseSchema: 'SupportedResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "supported.services.ts": {
        appkit: ["util", "logger", "error"],
        external: ["express"]
      },
      "supported.routes.ts": {
        external: ["express"]
      },
      "supported.types.ts": {
        external: ["zod"]
      },
      "supported.test.ts": {
        external: ["vitest", "supertest"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['SupportedService'],
    routes: ['/api/converter/supported', '/api/converter/supported/:name'],
    types: ['SupportedResponse', 'SupportedData', 'SupportedRequest'],
    schemas: ['SupportedSchema']
  },

  // === CONSUMES (What this feature uses from other parts) ===
  consumes: {
    services: [], // Internal services from other features
    state: [],
    events: []
    // External APIs are handled via configuration, not contract dependencies
  },

  // === TESTS ===
  tests: [
    'should return default greeting from converter/supported',
    'should return personalized greeting from converter/supported',
    'should handle names with special characters'
  ]
});

// ✅ EXPORT: Contract for registration
export default SupportedFeatureContract;