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

// ✅ CONTRACT: Multi-language greeting service with AppKit auth and service integration
const HelloFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === IDENTITY ===
  name: 'hello',
  app: 'greeting',
  description: 'Multi-language greeting service with AppKit auth and service integration',
  validation: 'none', // none | basic | essential | strict
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/greeting/hello',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'HelloService.greetDefault',
        summary: 'Get default greeting in 3 languages',
        requestSchema: null,
        responseSchema: 'HelloResponse',
        auth: { type: 'public' }
      },
      {
        method: 'GET', 
        path: '/:name',
        handler: 'HelloService.greetByName',
        summary: 'Get personalized greeting for specific name',
        requestSchema: null,
        responseSchema: 'HelloResponse',
        auth: {
          type: 'admin',
          roles: ['admin.tenant']
        }
      },
      {
        method: 'GET',
        path: '/goodday',
        handler: 'HelloService.greetGoodDay',
        summary: 'Get "good day" greeting in 3 languages',
        requestSchema: null,
        responseSchema: 'HelloResponse',
        auth: { type: 'api_key' }
      },
      {
        method: 'GET',
        path: '/thankyou',
        handler: 'HelloService.greetThankYou',
        summary: 'Get "thank you" greeting in 3 languages',
        requestSchema: null,
        responseSchema: 'HelloResponse',
        auth: { type: 'login' }
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

  // === BIDIRECTIONAL COMMUNICATION ===
  services: {
    provides: ['HelloService'],
    consumes: [{
      app: 'greeting',
      feature: 'logs',
      service: 'GreetingLogModel',
      methods: ['create']
    }]
  },

  events: {
    emits: [], // No events emitted
    listens: [] // No event subscriptions
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