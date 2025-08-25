/**
 * Hello Feature Contract - Living Documentation & Configuration
 * @module welcome/hello
 * @file src/api/welcome/features/hello/hello.index.ts
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
  app: 'welcome',
  description: 'Hello feature for welcome application with modern API patterns',
  contract_validation: 'none', // strict | basic | none
  llm_comments: 'none', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/welcome/hello',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'HelloService.getHelloWorld',
        summary: 'Get hello world greeting message',
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
      "hello.models.ts": {
        appkit: ["database"],
        external: []
      },
      "hello.test.ts": {
        external: ["vitest", "supertest"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['HelloService'],
    routes: ['/api/welcome/hello'],
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
    'should return hello world greeting message',
    'should include timestamp in response',
    'should return proper JSON format'
  ]
});

// ✅ EXPORT: Contract for registration
export default HelloFeatureContract;