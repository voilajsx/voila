/**
 * Status Feature Contract - Living Documentation & Configuration
 * @module welcome/status
 * @file src/api/welcome/features/status/status.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ EXPLICIT CONTRACT: Everything about this feature in one place
const StatusFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: 'status',
  app: 'welcome',
  description: 'Health check and status monitoring for welcome application',
  contract_validation: 'strict', // strict | basic | none
  llm_comments: 'strict', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/welcome',
    endpoints: [
      {
        method: 'GET',
        path: '/status',
        handler: 'StatusService.getHealthStatus',
        summary: 'Application health and status monitoring',
        requestSchema: null,
        responseSchema: 'StatusResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "status.services.ts": {
        appkit: ["util", "logger", "error"],
        external: ["express"]
      },
      "status.routes.ts": {
        external: ["express"]
      },
      "status.types.ts": {
        external: ["zod"]
      },
      "status.test.ts": {
        external: ["vitest", "supertest"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['StatusService'],
    routes: ['/api/welcome/status'],
    types: ['StatusResponse'],
    schemas: ['StatusSchema']
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
    'should return healthy status with uptime',
    'should return status: "healthy"',
    'should include uptime as number in response'
  ]
});

// ✅ EXPORT: Contract for registration
export default StatusFeatureContract;