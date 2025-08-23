/**
 * Hello feature data models and validation schemas
 * @module greeting/hello
 * @file src/api/greeting/features/hello/hello.models.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for hello endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use HelloSchema
 * @llm-rule NOTE: Matches frontend models exactly for type safety
 */

import { z } from 'zod';

// Request validation schemas
export const HelloSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

// TypeScript types
export interface HelloData {
  greetings: string[];
  name: string;
  language_count: number;
  timestamp: string;
  requestId: string;
  feature: string;
}

export interface HelloResponse {
  success: boolean;
  data: HelloData;
}

// Export schema types
export type HelloRequest = z.infer<typeof HelloSchema>;