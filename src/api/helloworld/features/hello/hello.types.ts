/**
 * Feature: Hello World Service  
 * Purpose: Simple Hello World endpoint types and validation
 * Dependencies: Zod for schema validation
 * Exports: HelloResponse, HelloResponseSchema
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for hello endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use schemas
 * @llm-rule NOTE: Matches frontend types exactly for type safety across full stack
 */

import { z } from 'zod';

// Response schema for Hello World endpoint
export const HelloResponseSchema = z.object({
  message: z.string()
});

// TypeScript interface for Hello World response data
export interface HelloData {
  message: string;
}

// Standard Voila response format
export interface HelloResponse {
  success: boolean;
  data: HelloData;
}

// Export schema-inferred types
export type HelloRequest = void; // No input required for simple hello endpoint