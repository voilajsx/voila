/**
 * {{FEATURE_NAME}} feature TypeScript types and validation schemas
 * @module {{APP_NAME}}/{{FEATURE_NAME}}
 * @file src/api/{{APP_NAME}}/features/{{FEATURE_NAME}}/{{FEATURE_NAME}}.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for {{FEATURE_NAME}} endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use {{FEATURE_NAME_PASCAL}}Schema
 * @llm-rule NOTE: Matches frontend types exactly for type safety across full stack
 */

import { z } from 'zod';

// Request validation schemas
export const {{FEATURE_NAME_PASCAL}}Schema = z.object({
  name: z.string().min(1).max(50).optional(),
});

// TypeScript interfaces for API responses
export interface {{FEATURE_NAME_PASCAL}}Data {
  message: string;
  app: string;
  feature: string;
  name: string;
  timestamp: string;
  requestId: string;
  version: string;
}

export interface {{FEATURE_NAME_PASCAL}}Response {
  success: boolean;
  data: {{FEATURE_NAME_PASCAL}}Data;
  requestId: string;
}

// Export schema-inferred types
export type {{FEATURE_NAME_PASCAL}}Request = z.infer<typeof {{FEATURE_NAME_PASCAL}}Schema>;

// Error response types
export interface {{FEATURE_NAME_PASCAL}}ErrorResponse {
  success: false;
  error: {
    type: string;
    message: string;
    code: string;
    requestId: string;
  };
}