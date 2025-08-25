/**
 * hello feature TypeScript types and validation schemas
 * @module welcome/hello
 * @file src/api/welcome/features/hello/hello.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for hello endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use schemas
 * @llm-rule NOTE: Simple hello world response with message and timestamp
 */

import { z } from 'zod';

// Response validation schema
export const HelloResponseSchema = z.object({
  message: z.string(),
  timestamp: z.string()
});

// TypeScript interface for API response
export interface HelloResponse {
  message: string;
  timestamp: string;
}

// Export schema-inferred type (should match interface)
export type HelloResponseType = z.infer<typeof HelloResponseSchema>;