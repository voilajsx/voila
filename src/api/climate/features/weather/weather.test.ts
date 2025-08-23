/**
 * Weather feature unit tests
 * @module climate/weather
 * @file src/api/climate/features/weather/weather.test.ts
 * 
 * @llm-rule WHEN: Testing weather service with external API mocks and error scenarios
 * @llm-rule AVOID: Testing with real APIs - use mocks for isolation and reliability
 * @llm-rule NOTE: Uses supertest for HTTP testing and comprehensive error case coverage
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock external dependencies - must be declared before import
vi.mock('node-fetch', () => ({ 
  default: vi.fn()
}));

// Mock AppKit modules with factory functions
vi.mock('@voilajsx/appkit/util', () => ({
  utilClass: {
    get: () => ({
      uuid: vi.fn(() => 'test-uuid-1234')
    })
  }
}));

vi.mock('@voilajsx/appkit/logger', () => ({
  loggerClass: {
    get: () => ({
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn()
    })
  }
}));

vi.mock('@voilajsx/appkit/error', () => ({
  errorClass: {
    get: () => ({
      badRequest: vi.fn((message) => {
        const error = new Error(message) as any;
        error.statusCode = 400;
        error.type = 'badRequest';
        return error;
      }),
      notFound: vi.fn((message) => {
        const error = new Error(message) as any;
        error.statusCode = 404;
        error.type = 'notFound';
        return error;
      }),
      serverError: vi.fn((message) => {
        const error = new Error(message) as any;
        error.statusCode = 500;
        error.type = 'serverError';
        return error;
      })
    })
  }
}));

vi.mock('@voilajsx/appkit/security', () => ({
  securityClass: {
    get: () => ({
      input: vi.fn((input) => input) // Pass through for testing
    })
  }
}));

vi.mock('@voilajsx/appkit/cache', () => {
  const mockCache = {
    get: vi.fn(() => null), // No cache by default
    set: vi.fn()
  };
  
  return {
    cacheClass: {
      get: () => mockCache
    }
  };
});

vi.mock('@voilajsx/appkit/config', () => ({
  configClass: {
    get: () => ({
      get: vi.fn((key) => {
        if (key === 'openweathermap.api.key') return 'test-owm-key';
        return null;
      })
    })
  }
}));

// Import after mocking
import weatherRoutes from './weather.routes.js';

describe('Weather Feature', () => {
  let app: express.Application;
  let mockFetch: any;

  beforeEach(async () => {
    // Get the mocked fetch function
    const fetchModule = await import('node-fetch');
    mockFetch = fetchModule.default as any;
    
    app = express();
    app.use(express.json());
    app.use('/weather', weatherRoutes);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /weather/current', () => {
    it('should return weather for valid city name', async () => {
      // Mock successful OpenWeatherMap response
      vi.mocked(mockFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          main: { temp: 20, humidity: 65 },
          weather: [{ main: 'Clear', description: 'clear sky' }],
          name: 'London',
          sys: { country: 'GB' },
          dt: 1692780000
        })
      });

      const response = await request(app)
        .get('/weather/current?city=London')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          temperature: 20,
          humidity: 65,
          condition: 'clear sky',
          city: 'London',
          country: 'GB',
          units: 'celsius'
        },
        requestId: 'test-uuid-1234',
        cached: false,
        source: 'openweathermap'
      });

      expect(response.body.data.timestamp).toBeDefined();
    });

    it('should return weather for valid coordinates', async () => {
      // Mock successful OpenWeatherMap response
      vi.mocked(mockFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          main: { temp: 15.5, humidity: 72 },
          weather: [{ main: 'Clouds', description: 'overcast clouds' }],
          name: 'Greenwich',
          sys: { country: 'GB' },
          dt: 1692780000
        })
      });

      const response = await request(app)
        .get('/weather/current?lat=51.5074&lon=-0.1278')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          temperature: 15.5,
          humidity: 72,
          condition: 'overcast clouds',
          city: 'Greenwich',
          country: 'GB'
        }
      });
    });

    it('should handle temperature unit conversion', async () => {
      // Mock successful OpenWeatherMap response (returns Celsius)
      vi.mocked(mockFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          main: { temp: 20, humidity: 65 },
          weather: [{ main: 'Clear', description: 'clear sky' }],
          name: 'London',
          sys: { country: 'GB' },
          dt: 1692780000
        })
      });

      const response = await request(app)
        .get('/weather/current?city=London&units=fahrenheit')
        .expect(200);

      expect(response.body.data.temperature).toBe(68); // 20°C = 68°F
      expect(response.body.data.units).toBe('fahrenheit');
    });

    it('should handle API server errors with 500 status', async () => {
      // Mock OpenWeatherMap server error (500)
      vi.mocked(mockFetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error'
      });

      const response = await request(app)
        .get('/weather/current?city=London')
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'server_error',
          message: 'Internal server error',
          code: 'WEATHER_SERVICE_ERROR'
        }
      });
    });

    it('should handle invalid city names with 404 error', async () => {
      // Mock 404 response from OpenWeatherMap
      vi.mocked(mockFetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found'
      });

      const response = await request(app)
        .get('/weather/current?city=NonExistentCity')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'not_found',
          message: 'Location not found',
          code: 'LOCATION_NOT_FOUND',
          requestId: 'test-uuid-1234'
        }
      });
    });

    it('should handle invalid coordinates with 400 error', async () => {
      const response = await request(app)
        .get('/weather/current?lat=91&lon=0') // Invalid latitude > 90
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'validation_error',
          message: 'Invalid request parameters',
          code: 'INVALID_INPUT'
        }
      });
    });

    it('should require either city or coordinates', async () => {
      const response = await request(app)
        .get('/weather/current') // No parameters
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation_error');
    });

    it('should handle external API failures gracefully', async () => {
      // Mock OpenWeatherMap network failure
      vi.mocked(mockFetch).mockRejectedValueOnce(new Error('Network error'));

      const response = await request(app)
        .get('/weather/current?city=London')
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'server_error',
          message: 'Internal server error',
          code: 'WEATHER_SERVICE_ERROR'
        }
      });
    });

    it('should serve cached data when available', async () => {
      const cachedWeatherData = JSON.stringify({
        temperature: 22,
        humidity: 60,
        condition: 'sunny',
        city: 'London',
        country: 'GB',
        timestamp: '2023-08-23T12:00:00.000Z',
        units: 'celsius'
      });

      // Get reference to the mocked cache
      const cacheModule = await import('@voilajsx/appkit/cache');
      const mockCache = cacheModule.cacheClass.get();
      
      // Set up the cache mock to return cached data for this test
      vi.mocked(mockCache.get).mockResolvedValueOnce(cachedWeatherData);

      const response = await request(app)
        .get('/weather/current?city=London')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          temperature: 22,
          humidity: 60,
          condition: 'sunny'
        },
        cached: true
      });

      // Verify no external API calls were made
      expect(vi.mocked(mockFetch)).not.toHaveBeenCalled();
    });
  });
});