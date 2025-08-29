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

// ✅ CONTRACT: Hello feature with validation levels and bidirectional communication
const HelloFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === IDENTITY ===
  name: 'hello',
  app: 'welcome',
  description: 'Hello feature for welcome application with modern API patterns',
  validation: 'none', // none | basic | essential | strict
  
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
        responseSchema: 'HelloResponse',
        auth: { type: 'public' }
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
        external: ["express"],
        relative: ["./hello.services"]
      },
      "hello.types.ts": {
        external: ["zod"]
      },
      "hello.models.ts": {
        appkit: ["database"],
        external: []
      },
      "hello.test.ts": {
        external: ["vitest", "supertest"],
        relative: ["./hello.routes"]
      }
    }
  },

  // === BIDIRECTIONAL COMMUNICATION ===
  services: {
    provides: ['HelloService'],
    consumes: [] // No service dependencies
  },

  events: {
    emits: [], // No events emitted
    listens: [] // No event subscriptions
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