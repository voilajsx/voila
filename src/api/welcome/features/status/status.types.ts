/**
 * status feature TypeScript types and validation schemas
 * @module welcome/status
 * @file src/api/welcome/features/status/status.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for status endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use StatusSchema
 * @llm-rule NOTE: Matches frontend types exactly for type safety across full stack
 */

import { z } from 'zod';

// Request validation schemas
export const StatusSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

// TypeScript interfaces for API responses
export interface StatusData {
  message: string;
  app: string;
  feature: string;
  name: string;
  timestamp: string;
  requestId: string;
  version: string;
}

export interface StatusResponse {
  success: boolean;
  data: StatusData;
}

// Export schema-inferred types
export type StatusRequest = z.infer<typeof StatusSchema>;

// Error response types
export interface StatusErrorResponse {
  success: false;
  error: {
    type: string;
    message: string;
    code: string;
    requestId: string;
  };
}