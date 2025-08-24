/**
 * Search feature TypeScript types and validation schemas
 * @module climate/search
 * @file src/api/climate/features/search/search.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for location search endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use LocationSearchRequestSchema
 * @llm-rule NOTE: Types match OpenWeatherMap Geocoding API response format for consistency
 */

import { z } from 'zod';

// Request validation schema - location search with optional limit
export const LocationSearchRequestSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().int().min(1).max(10).default(5)
});

// Individual location result
export interface LocationResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Successful location search response
export interface LocationSearchResponse {
  success: true;
  data: LocationResult[];
  requestId: string;
  cached?: boolean;
  count: number;
}

// Error response structure
export interface LocationSearchErrorResponse {
  success: false;
  error: {
    type: 'validation_error' | 'not_found' | 'external_api_error' | 'server_error';
    message: string;
    code: string;
    requestId: string;
  };
}

// External API response types (for service layer)
export interface OpenWeatherMapGeocodingResponse {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  local_names?: Record<string, string>;
}

// Cache key generation helper type
export interface SearchCacheKey {
  query: string;
  limit: number;
}

// Service configuration type
export interface SearchServiceConfig {
  openweathermap: {
    apiKey: string;
    geocodingUrl: string;
  };
  cache: {
    ttl: number; // Time to live in seconds (1 hour)
  };
}

// Export schema-inferred types
export type LocationSearchRequest = z.infer<typeof LocationSearchRequestSchema>;