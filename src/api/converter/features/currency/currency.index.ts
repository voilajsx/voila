/**
 * Currency Feature Contract - Living Documentation & Configuration
 * @module converter/currency
 * @file src/api/converter/features/currency/currency.index.ts
 * 
 * @llm-rule WHEN: Defining feature contracts for Voila framework validation
 * @llm-rule AVOID: Changing contract structure without updating validation logic
 * @llm-rule NOTE: This contract enforces API consistency and enables automated validation
 */

import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

// ✅ EXPLICIT CONTRACT: Everything about this feature in one place
const CurrencyFeatureContract: VoilaFeatureContract = createFeatureContract({
  // === FEATURE IDENTITY ===
  name: 'currency',
  app: 'converter',
  description: 'Currency conversion for top 20 countries with clear error handling',
  contract_validation: 'basic', // strict | basic | none
  llm_comments: 'basic', // strict | basic | none
  
  // === API DEFINITION ===
  api: {
    basePath: '/api/converter',
    endpoints: [
      {
        method: 'POST',
        path: '/currency',
        handler: 'CurrencyService.convert',
        summary: 'Convert between currencies of top 20 countries',
        requestSchema: 'CurrencyRequest',
        responseSchema: 'CurrencyResponse'
      }
    ]
  },

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: {
      "currency.services.ts": {
        appkit: ["util", "logger", "error", "validator"],
        external: []
      },
      "currency.routes.ts": {
        external: ["express"]
      },
      "currency.types.ts": {
        external: ["zod"]
      },
      "currency.test.ts": {
        external: ["vitest", "supertest"]
      }
    }
  },

  // === PROVIDES (What this feature offers to the system) ===
  provides: {
    services: ['CurrencyService'],
    routes: ['/api/converter/currency'],
    types: ['CurrencyRequest', 'CurrencyResponse', 'CurrencyConversionData'],
    schemas: ['CurrencyRequestSchema', 'CurrencyResponseSchema']
  },

  // === CONSUMES (What this feature uses from other parts) ===
  consumes: {
    services: [], // Internal services from other features
    state: [],
    events: []
    // Exchange rates from static data or external API
  },

  // === TESTS ===
  tests: [
    'should convert USD to EUR successfully',
    'should convert EUR to JPY successfully', 
    'should return 400 for unsupported currency',
    'should return 400 for invalid amount',
    'should return 400 for missing required fields',
    'should include exchange rate and timestamp in response',
    'should handle all top 20 supported currencies'
  ]
});

// ✅ EXPORT: Contract for registration
export default CurrencyFeatureContract;