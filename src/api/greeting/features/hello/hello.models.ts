/**
 * Hello API Models - Data models and validation schemas
 * @file src/api/greeting/features/hello/hello.models.ts
 * @group API Models
 * 
 * @llm-rule WHEN: Need data validation and type safety for API requests/responses
 * @llm-rule AVOID: Manual validation - use Zod schemas for consistent validation
 * @llm-rule PATTERN: Zod schema -> TypeScript interface -> API contract
 * @llm-rule NOTE: All models include proper error handling and sanitization
 */

import { z } from 'zod';

/**
 * Hello Request Validation Schema
 * 
 * Zod schema for validating incoming hello API requests.
 * Used by Express routes for automatic request validation.
 * 
 * @example
 * ```typescript
 * const validatedData = HelloSchema.parse(req.body);
 * ```
 */
export const HelloSchema = z.object({
  /** User name for personalized greeting (optional, 1-50 characters) */
  name: z.string().min(1).max(50).optional(),
});

/**
 * Hello Response Data Structure
 * 
 * Contains the actual greeting data returned by the API.
 * Includes multi-language greetings and metadata.
 */
export interface HelloData {
  /** Array of greetings in different languages */
  greetings: string[];
  /** User name used in the greeting */
  name: string;
  /** Number of languages included in greetings array */
  language_count: number;
  /** ISO 8601 timestamp when greeting was generated */
  timestamp: string;
  /** Unique request identifier for tracking */
  requestId: string;
  /** Feature identifier (always "hello") */
  feature: string;
}

/**
 * Hello API Response Structure
 * 
 * Standard API response format for hello endpoints.
 * Follows the common success/data pattern used across all APIs.
 * 
 * @example
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "greetings": ["Hello World!", "Hola Mundo!", "Bonjour le monde!"],
 *     "name": "World",
 *     "language_count": 3,
 *     "timestamp": "2025-01-01T12:00:00.000Z",
 *     "requestId": "req_123456",
 *     "feature": "hello"
 *   }
 * }
 * ```
 */
export interface HelloResponse {
  /** Indicates if the request was successful */
  success: boolean;
  /** The actual greeting data */
  data: HelloData;
}

/**
 * Hello Request Type
 * 
 * TypeScript type inferred from HelloSchema for request validation.
 * Use this type for function parameters and request handling.
 * 
 * @example
 * ```typescript
 * function processHelloRequest(request: HelloRequest): HelloResponse {
 *   // Implementation
 * }
 * ```
 */
export type HelloRequest = z.infer<typeof HelloSchema>;