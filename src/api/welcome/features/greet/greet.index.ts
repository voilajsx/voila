/**
 * Greet Feature Contract - Living Documentation & Configuration
 * @module welcome/greet
 * @file src/api/welcome/features/greet/greet.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ EXPLICIT CONTRACT: Everything about this feature in one place
const GreetFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: 'greet',
  app: 'welcome',
  description: 'Greet feature for welcome application with modern API patterns',
  contract_validation: 'none', // strict | basic | none
  llm_comments: 'none', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/welcome/greet',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'GreetService.getDefault',
        summary: 'Get default greeting from welcome/greet',
        requestSchema: null,
        responseSchema: 'GreetResponse'
      },
      {
        method: 'GET',
        path: '/:name',
        handler: 'GreetService.greetByName',
        summary: 'Get personalized greeting from welcome/greet',
        requestSchema: null,
        responseSchema: 'GreetResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "greet.services.ts": {
        appkit: ["util", "logger", "error"],
        external: ["express"]
      },
      "greet.routes.ts": {
        external: ["express"]
      },
      "greet.types.ts": {
        external: ["zod"]
      },
      "greet.models.ts": {
        appkit: ["database"],
        external: []
      },
      "greet.test.ts": {
        external: ["vitest", "supertest"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['GreetService'],
    routes: ['/api/welcome/greet', '/api/welcome/greet/:name'],
    types: ['GreetResponse', 'GreetData', 'GreetRequest'],
    schemas: ['GreetSchema']
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
    'should return default greeting from welcome/greet',
    'should return personalized greeting from welcome/greet',
    'should handle names with special characters'
  ]
});

// ✅ EXPORT: Contract for registration
export default GreetFeatureContract;