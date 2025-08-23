/**
 * Hello Feature Contract - Living Documentation & Configuration
 * @module greeting/hello
 * @file src/api/greeting/features/hello/hello.index.ts
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
  app: 'greeting',
  description: 'Multi-language greeting service with AppKit integration, security, and structured logging',
  contract_validation: 'none', // strict | basic | none
  llm_comments: 'none', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/greeting/hello',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'HelloService.greetDefault',
        summary: 'Get default greeting in 3 languages (English, Spanish, French)',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      },
      {
        method: 'GET', 
        path: '/:name',
        handler: 'HelloService.greetByName',
        summary: 'Get personalized greeting for specific name in 3 languages',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "hello.services.ts": {
        appkit: ["util", "logger", "error", "security"]
      },
      "hello.routes.ts": {
        external: ["express"]
      },
      "hello.models.ts": {
        external: ["zod"]
      },
      "hello.test.ts": {
        external: ["vitest"]
      },
      "hello.helper.ts": {
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['HelloService'],
    routes: ['/api/greeting/hello', '/api/greeting/hello/:name'],
    types: ['HelloResponse', 'HelloData', 'HelloRequest'],
    schemas: ['HelloSchema']
  },

  // === CONSUMES (What this feature uses from other parts) ===
  consumes: {
    services: [],
    state: [],
    events: []
  },

  // === TESTS ===
  tests: [
    'should return default greeting',
    'should return personalized greeting'
  ]
});

// ✅ EXPORT: Contract for registration
export default HelloFeatureContract;