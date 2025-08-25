/**
 * greet feature TypeScript types and validation schemas
 * @module welcome/greet
 * @file src/api/welcome/features/greet/greet.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for greet endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use GreetSchema
 * @llm-rule NOTE: Matches frontend types exactly for type safety across full stack
 */

import { z } from 'zod';

// Request validation schemas
export const GreetSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

// TypeScript interfaces for API responses
export interface GreetData {
  message: string;
  app: string;
  feature: string;
  name: string;
  timestamp: string;
  requestId: string;
  version: string;
}

export interface GreetResponse {
  success: boolean;
  data: GreetData;
}

// Export schema-inferred types
export type GreetRequest = z.infer<typeof GreetSchema>;

// Error response types
export interface GreetErrorResponse {
  success: false;
  error: {
    type: string;
    message: string;
    code: string;
    requestId: string;
  };
}