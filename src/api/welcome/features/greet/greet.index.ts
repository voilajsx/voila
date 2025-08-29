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

// ✅ CONTRACT: Greet feature with validation levels and bidirectional communication
const GreetFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === IDENTITY ===
  name: 'greet',
  app: 'welcome',
  description: 'Greet feature for welcome application with modern API patterns',
  validation: 'none', // none | basic | essential | strict
  
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
        responseSchema: 'GreetResponse',
        auth: { type: 'public' }
      },
      {
        method: 'GET',
        path: '/:name',
        handler: 'GreetService.greetByName',
        summary: 'Get personalized greeting from welcome/greet',
        requestSchema: null,
        responseSchema: 'GreetResponse',
        auth: { type: 'public' }
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
        external: ["express"],
        relative: ["./greet.services"]
      },
      "greet.types.ts": {
        external: ["zod"]
      },
      "greet.models.ts": {
        appkit: ["database"],
        external: []
      },
      "greet.test.ts": {
        external: ["vitest", "supertest"],
        relative: ["./greet.routes"]
      }
    }
  },

  // === BIDIRECTIONAL COMMUNICATION ===
  services: {
    provides: ['GreetService'],
    consumes: [] // No service dependencies
  },

  events: {
    emits: [], // No events emitted
    listens: [] // No event subscriptions
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