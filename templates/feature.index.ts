/**
 * {{FEATURE_NAME_PASCAL}} Feature Contract - Living Documentation & Configuration
 * @module {{APP_NAME}}/{{FEATURE_NAME}}
 * @file src/api/{{APP_NAME}}/features/{{FEATURE_NAME}}/{{FEATURE_NAME}}.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ EXPLICIT CONTRACT: Everything about this feature in one place
const {{FEATURE_NAME_PASCAL}}FeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: '{{FEATURE_NAME}}',
  app: '{{APP_NAME}}',
  description: '{{FEATURE_NAME_PASCAL}} feature for {{APP_NAME}} application with modern API patterns',
  contract_validation: 'none', // strict | basic | none
  llm_comments: 'none', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/{{APP_NAME}}/{{FEATURE_NAME}}',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: '{{FEATURE_NAME_PASCAL}}Service.getDefault',
        summary: 'Get default greeting from {{APP_NAME}}/{{FEATURE_NAME}}',
        requestSchema: null,
        responseSchema: '{{FEATURE_NAME_PASCAL}}Response'
      },
      {
        method: 'GET',
        path: '/:name',
        handler: '{{FEATURE_NAME_PASCAL}}Service.greetByName',
        summary: 'Get personalized greeting from {{APP_NAME}}/{{FEATURE_NAME}}',
        requestSchema: null,
        responseSchema: '{{FEATURE_NAME_PASCAL}}Response'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "{{FEATURE_NAME}}.services.ts": {
        appkit: ["util", "logger", "error"],
        external: ["express"]
      },
      "{{FEATURE_NAME}}.routes.ts": {
        external: ["express"]
      },
      "{{FEATURE_NAME}}.types.ts": {
        external: ["zod"]
      },
      "{{FEATURE_NAME}}.test.ts": {
        external: ["vitest", "supertest"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['{{FEATURE_NAME_PASCAL}}Service'],
    routes: ['/api/{{APP_NAME}}/{{FEATURE_NAME}}', '/api/{{APP_NAME}}/{{FEATURE_NAME}}/:name'],
    types: ['{{FEATURE_NAME_PASCAL}}Response', '{{FEATURE_NAME_PASCAL}}Data', '{{FEATURE_NAME_PASCAL}}Request'],
    schemas: ['{{FEATURE_NAME_PASCAL}}Schema']
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
    'should return default greeting from {{APP_NAME}}/{{FEATURE_NAME}}',
    'should return personalized greeting from {{APP_NAME}}/{{FEATURE_NAME}}',
    'should handle names with special characters'
  ]
});

// ✅ EXPORT: Contract for registration
export default {{FEATURE_NAME_PASCAL}}FeatureContract;