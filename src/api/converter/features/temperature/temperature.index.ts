/**
 * Temperature Feature Contract - Living Documentation & Configuration
 * @module converter/temperature
 * @file src/api/converter/features/temperature/temperature.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ EXPLICIT CONTRACT: Everything about this feature in one place
const TemperatureFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: 'temperature',
  app: 'converter',
  description: 'Temperature feature for converter application with modern API patterns',
  contract_validation: 'none', // strict | basic | none
  llm_comments: 'none', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/converter/temperature',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'TemperatureService.getDefault',
        summary: 'Get default greeting from converter/temperature',
        requestSchema: null,
        responseSchema: 'TemperatureResponse'
      },
      {
        method: 'GET',
        path: '/:name',
        handler: 'TemperatureService.greetByName',
        summary: 'Get personalized greeting from converter/temperature',
        requestSchema: null,
        responseSchema: 'TemperatureResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "temperature.services.ts": {
        appkit: ["util", "logger", "error"],
        external: ["express"]
      },
      "temperature.routes.ts": {
        external: ["express"]
      },
      "temperature.types.ts": {
        external: ["zod"]
      },
      "temperature.test.ts": {
        external: ["vitest", "supertest"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['TemperatureService'],
    routes: ['/api/converter/temperature', '/api/converter/temperature/:name'],
    types: ['TemperatureResponse', 'TemperatureData', 'TemperatureRequest'],
    schemas: ['TemperatureSchema']
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
    'should return default greeting from converter/temperature',
    'should return personalized greeting from converter/temperature',
    'should handle names with special characters'
  ]
});

// ✅ EXPORT: Contract for registration
export default TemperatureFeatureContract;