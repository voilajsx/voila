/**
 * Status feature TypeScript types and validation schemas - Health Check Types
 * @module welcome/status
 * @file src/api/welcome/features/status/status.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for health check endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use StatusSchema
 * @llm-rule NOTE: Matches technical specification format: { status: string, uptime: number }
 */

import { z } from 'zod';

// Response validation schema for health check
export const StatusSchema = z.object({
  status: z.literal('healthy'),
  uptime: z.number().nonnegative()
});

// TypeScript interface for health check response
export interface StatusResponse {
  status: 'healthy';
  uptime: number;
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