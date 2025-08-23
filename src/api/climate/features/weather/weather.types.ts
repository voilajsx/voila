/**
 * Weather feature TypeScript types and validation schemas
 * @module climate/weather
 * @file src/api/climate/features/weather/weather.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for weather API endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use WeatherRequestSchema
 * @llm-rule NOTE: Types match OpenWeatherMap API response format for consistency
 */

import { z } from 'zod';

// Request validation schema - supports both city and coordinate queries
export const WeatherRequestSchema = z.object({
  city: z.string().min(1).max(100).optional(),
  lat: z.number().min(-90).max(90).optional(), 
  lon: z.number().min(-180).max(180).optional(),
  units: z.enum(['celsius', 'fahrenheit', 'kelvin']).default('celsius'),
}).refine(
  (data) => data.city || (data.lat !== undefined && data.lon !== undefined),
  {
    message: "Either 'city' or both 'lat' and 'lon' must be provided",
  }
);

// Core weather data structure
export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  city: string;
  country: string;
  timestamp: string;
  units: string;
}

// Successful weather API response
export interface WeatherResponse {
  success: true;
  data: WeatherData;
  requestId: string;
  cached?: boolean;
  source?: 'openweathermap';
}

// Error response structure
export interface WeatherErrorResponse {
  success: false;
  error: {
    type: 'validation_error' | 'not_found' | 'external_api_error' | 'server_error';
    message: string;
    code: string;
    requestId: string;
  };
}

// External API response types (for service layer)
export interface OpenWeatherMapResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  name: string;
  sys: {
    country: string;
  };
  dt: number;
}


// Cache key generation helper type
export interface WeatherCacheKey {
  type: 'city' | 'coordinates';
  city?: string;
  lat?: number;
  lon?: number;
  units: string;
}

// Service configuration type
export interface WeatherServiceConfig {
  openweathermap: {
    apiKey: string;
    baseUrl: string;
  };
  cache: {
    ttl: number; // Time to live in seconds
  };
}

// Export schema-inferred types
export type WeatherRequest = z.infer<typeof WeatherRequestSchema>;