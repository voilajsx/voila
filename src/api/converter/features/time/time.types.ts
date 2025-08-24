/**
 * time feature TypeScript types and validation schemas
 * @module converter/time
 * @file src/api/converter/features/time/time.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for time endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use TimeSchema
 * @llm-rule NOTE: Matches frontend types exactly for type safety across full stack
 */

import { z } from 'zod';

// Request validation schemas
export const TimeSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

// TypeScript interfaces for API responses
export interface TimeData {
  message: string;
  app: string;
  feature: string;
  name: string;
  timestamp: string;
  requestId: string;
  version: string;
}

export interface TimeResponse {
  success: boolean;
  data: TimeData;
  requestId: string;
}

// Export schema-inferred types
export type TimeRequest = z.infer<typeof TimeSchema>;

// Error response types
export interface TimeErrorResponse {
  success: false;
  error: {
    type: string;
    message: string;
    code: string;
    requestId: string;
  };
}