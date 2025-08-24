/**
 * hello feature TypeScript types and validation schemas
 * @module demo/hello
 * @file src/api/demo/features/hello/hello.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for hello endpoints
 * @llm-rule AVOID: Using plain objects without validation
 * @llm-rule NOTE: Matches frontend types exactly for type safety across full stack
 */

import { z } from 'zod';

// TypeScript interfaces for API responses
export interface HelloResponse {
  success: boolean;
  data: {
    message: string;
  };
}
