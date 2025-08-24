/**
 * Time Feature Contract - Living Documentation & Configuration
 * @module converter/time
 * @file src/api/converter/features/time/time.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ EXPLICIT CONTRACT: Everything about this feature in one place
const TimeFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: 'time',
  app: 'converter',
  description: 'Time feature for converter application with modern API patterns',
  contract_validation: 'none', // strict | basic | none
  llm_comments: 'none', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/converter/time',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'TimeService.getDefault',
        summary: 'Get default greeting from converter/time',
        requestSchema: null,
        responseSchema: 'TimeResponse'
      },
      {
        method: 'GET',
        path: '/:name',
        handler: 'TimeService.greetByName',
        summary: 'Get personalized greeting from converter/time',
        requestSchema: null,
        responseSchema: 'TimeResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "time.services.ts": {
        appkit: ["util", "logger", "error"],
        external: ["express"]
      },
      "time.routes.ts": {
        external: ["express"]
      },
      "time.types.ts": {
        external: ["zod"]
      },
      "time.test.ts": {
        external: ["vitest", "supertest"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['TimeService'],
    routes: ['/api/converter/time', '/api/converter/time/:name'],
    types: ['TimeResponse', 'TimeData', 'TimeRequest'],
    schemas: ['TimeSchema']
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
    'should return default greeting from converter/time',
    'should return personalized greeting from converter/time',
    'should handle names with special characters'
  ]
});

// ✅ EXPORT: Contract for registration
export default TimeFeatureContract;