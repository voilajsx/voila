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
  description: 'Multi-language greeting service with authentication, role-based access control, and AppKit integration',
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
        summary: 'Get default greeting in 3 languages (PUBLIC - no auth required)',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      },
      {
        method: 'GET', 
        path: '/:name',
        handler: 'HelloService.greetByName',
        summary: 'Get personalized greeting for specific name (ADMIN ONLY - requires login + admin.tenant role)',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      },
      {
        method: 'GET',
        path: '/goodday',
        handler: 'HelloService.greetGoodDay',
        summary: 'Get "good day" greeting in 3 languages (API KEY - requires valid API token)',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      },
      {
        method: 'GET',
        path: '/thankyou',
        handler: 'HelloService.greetThankYou',
        summary: 'Get "thank you" greeting in 3 languages (LOGIN - requires valid login token)',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "hello.services.ts": {
        appkit: ["util", "logger", "error", "security", "auth"]
      },
      "hello.routes.ts": {
        appkit: ["auth"],
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
    routes: ['/api/greeting/hello', '/api/greeting/hello/:name', '/api/greeting/hello/goodday'],
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
    'should return personalized greeting',
    'should return good day greeting'
  ]
});

// ✅ EXPORT: Contract for registration
export default HelloFeatureContract;