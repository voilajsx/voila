/**
 * Hello Feature Contract - Living Documentation & Configuration
 * @module demo/hello
 * @file src/api/demo/features/hello/hello.index.ts
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
  app: 'demo',
  description: 'Hello feature for demo application with modern API patterns',
  contract_validation: 'none', // strict | basic | none
  llm_comments: 'none', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/demo/hello',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'HelloService.getHello',
        summary: 'Get hello world greeting from demo/hello',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "hello.services.ts": {
        appkit: ["util", "logger", "error"],
        external: ["express"]
      },
      "hello.routes.ts": {
        external: ["express"]
      },
      "hello.types.ts": {
        external: ["zod"]
      },
      "hello.test.ts": {
        external: ["vitest", "supertest"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['HelloService'],
    routes: ['/api/demo/hello'],
    types: ['HelloResponse'],
    schemas: []
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
    'should return hello world greeting from demo/hello'
  ]
});

// ✅ EXPORT: Contract for registration
export default HelloFeatureContract;
