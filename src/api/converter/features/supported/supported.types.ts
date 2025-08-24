/**
 * supported feature TypeScript types and validation schemas
 * @module converter/supported
 * @file src/api/converter/features/supported/supported.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for supported endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use SupportedSchema
 * @llm-rule NOTE: Matches frontend types exactly for type safety across full stack
 */

import { z } from 'zod';

// Request validation schemas
export const SupportedSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

// TypeScript interfaces for API responses
export interface SupportedData {
  message: string;
  app: string;
  feature: string;
  name: string;
  timestamp: string;
  requestId: string;
  version: string;
}

export interface SupportedResponse {
  success: boolean;
  data: SupportedData;
  requestId: string;
}

// Export schema-inferred types
export type SupportedRequest = z.infer<typeof SupportedSchema>;

// Error response types
export interface SupportedErrorResponse {
  success: false;
  error: {
    type: string;
    message: string;
    code: string;
    requestId: string;
  };
}