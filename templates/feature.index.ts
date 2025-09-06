/**
 * {{FEATURE_NAME_PASCAL}} Feature Contract - Living Documentation & Configuration
 * @module {{APP_NAME}}/{{FEATURE_NAME}}
 * @file src/api/{{APP_NAME}}/features/{{FEATURE_NAME}}/{{FEATURE_NAME}}.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/api-contracts.js';
import { createFeatureContract } from '@/lib/api-contracts.js';

// ✅ CONTRACT: {{FEATURE_NAME_PASCAL}} feature with validation levels and bidirectional communication
const {{FEATURE_NAME_PASCAL}}FeatureContract: VoilaFeatureContract = createFeatureContract({
  // === IDENTITY ===
  name: '{{FEATURE_NAME}}',
  app: '{{APP_NAME}}',
  description: '{{FEATURE_NAME_PASCAL}} feature for {{APP_NAME}} application with modern API patterns',
  validation: '{{VALIDATION_LEVEL}}', // none | basic | essential | strict
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/{{APP_NAME}}/{{FEATURE_NAME}}',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: '{{FEATURE_NAME_PASCAL}}Service.getDefault',
        summary: 'Get default response from {{APP_NAME}}/{{FEATURE_NAME}}',
        requestSchema: null,
        responseSchema: '{{FEATURE_NAME_PASCAL}}Response',
        auth: { type: 'public' }
      },
      {
        method: 'GET',
        path: '/:name',
        handler: '{{FEATURE_NAME_PASCAL}}Service.getByName',
        summary: 'Get personalized response from {{APP_NAME}}/{{FEATURE_NAME}}',
        requestSchema: null,
        responseSchema: '{{FEATURE_NAME_PASCAL}}Response',
        auth: { type: 'login' }
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "{{FEATURE_NAME}}.services.ts": {
        appkit: ["util", "logger", "error", "auth"],
        external: ["express"]
      },
      "{{FEATURE_NAME}}.routes.ts": {
        appkit: ["auth"],
        external: ["express"],
        relative: ["./{{FEATURE_NAME}}.services"]
      },
      "{{FEATURE_NAME}}.types.ts": {
        external: ["zod"]
      },
      "{{FEATURE_NAME}}.models.ts": {
        external: []
      },
      "{{FEATURE_NAME}}.test.ts": {
        external: ["vitest", "supertest"],
        relative: ["./{{FEATURE_NAME}}.routes"]
      }
    }
  },

  // === BIDIRECTIONAL COMMUNICATION ===
  services: {
    provides: ['{{FEATURE_NAME_PASCAL}}Service'],
    consumes: [] // Add service dependencies from other features if needed
  },

  events: {
    emits: [], // Add events this feature emits
    listens: [] // Add events this feature listens to
  },

  // === TESTS ===
  tests: [
    'should return default response from {{APP_NAME}}/{{FEATURE_NAME}}',
    'should return personalized response from {{APP_NAME}}/{{FEATURE_NAME}}',
    'should handle authentication and authorization',
    'should validate request/response schemas'
  ]
});

// ✅ EXPORT: Contract for registration
export default {{FEATURE_NAME_PASCAL}}FeatureContract;