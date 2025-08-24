/**
 * temperature feature TypeScript types and validation schemas
 * @module converter/temperature
 * @file src/api/converter/features/temperature/temperature.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for temperature endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use TemperatureSchema
 * @llm-rule NOTE: Matches frontend types exactly for type safety across full stack
 */

import { z } from 'zod';

// Request validation schemas
export const TemperatureSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

// TypeScript interfaces for API responses
export interface TemperatureData {
  message: string;
  app: string;
  feature: string;
  name: string;
  timestamp: string;
  requestId: string;
  version: string;
}

export interface TemperatureResponse {
  success: boolean;
  data: TemperatureData;
  requestId: string;
}

// Export schema-inferred types
export type TemperatureRequest = z.infer<typeof TemperatureSchema>;

// Error response types
export interface TemperatureErrorResponse {
  success: false;
  error: {
    type: string;
    message: string;
    code: string;
    requestId: string;
  };
}