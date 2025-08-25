/**
 * Hello Feature Contract - Living Documentation & Configuration
 * @module helloworld/hello
 * @file src/api/helloworld/features/hello/hello.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ EXPLICIT CONTRACT: Everything about this feature in one place
const HelloFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: 'hello',
  app: 'helloworld',
  description: 'Simple Hello World endpoint that returns "Hello World" message',
  contract_validation: 'strict', // strict | basic | none
  llm_comments: 'strict', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/helloworld',
    endpoints: [
      {
        method: 'GET',
        path: '/hello',
        handler: 'HelloService.getHello',
        summary: 'Returns simple Hello World message',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "hello.services.ts": {
        appkit: [],
        external: []
      },
      "hello.routes.ts": {
        external: ["express"]
      },
      "hello.types.ts": {
        external: ["zod"]
      },
      "hello.test.ts": {
        external: ["vitest", "supertest"]
      },
      "hello.models.ts": {
        external: []
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['HelloService'],
    routes: ['/api/helloworld/hello'],
    types: ['HelloResponse'],
    schemas: ['HelloResponseSchema']
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
    'should return Hello World message',
    'should return JSON response with success true',
    'should respond with status 200'
  ]
});

// ✅ EXPORT: Contract for registration
export default HelloFeatureContract;