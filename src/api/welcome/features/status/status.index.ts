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

// ✅ CONTRACT: Status feature with validation levels and bidirectional communication
const StatusFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === IDENTITY ===
  name: 'status',
  app: 'welcome',
  description: 'Status feature for welcome application with modern API patterns',
  validation: 'basic', // none | basic | essential | strict
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/welcome/status',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'StatusService.getDefault',
        summary: 'Get system status information',
        requestSchema: null,
        responseSchema: 'StatusResponse',
        auth: { type: 'public' }
      },
      {
        method: 'GET',
        path: '/health',
        handler: 'StatusService.getHealth',
        summary: 'Get detailed health check information',
        requestSchema: null,
        responseSchema: 'HealthResponse',
        auth: { type: 'login' }
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
        external: ["express"],
        relative: ["./status.services"]
      },
      "status.types.ts": {
        external: ["zod"]
      },
      "status.models.ts": {
        appkit: ["database"],
        external: []
      },
      "status.test.ts": {
        external: ["vitest", "supertest"],
        relative: ["./status.routes"]
      }
    }
  },

  // === BIDIRECTIONAL COMMUNICATION ===
  services: {
    provides: ['StatusService'],
    consumes: [] // No service dependencies
  },

  events: {
    emits: [], // No events emitted
    listens: [] // No event subscriptions
  },

  // === TESTS ===
  tests: [
    'should return system status information',
    'should return health check with authentication',
    'should handle system monitoring data',
    'should validate response schemas'
  ]
});

// ✅ EXPORT: Contract for registration
export default StatusFeatureContract;