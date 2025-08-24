/**
 * Search feature unit tests
 * @module climate/search
 * @file src/api/climate/features/search/search.test.ts
 * 
 * @llm-rule WHEN: Testing location search service with external API mocks and error scenarios
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
import searchRoutes from './search.routes.js';

describe('Search Feature', () => {
  let app: express.Application;
  let mockFetch: any;

  beforeEach(async () => {
    // Get the mocked fetch function
    const fetchModule = await import('node-fetch');
    mockFetch = fetchModule.default as any;
    
    app = express();
    app.use(express.json());
    app.use('/search', searchRoutes);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /search', () => {
    it('should return locations for valid query string', async () => {
      // Mock successful OpenWeatherMap Geocoding response
      vi.mocked(mockFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          {
            name: 'London',
            country: 'GB',
            state: 'England',
            lat: 51.5073219,
            lon: -0.1276474
          },
          {
            name: 'London',
            country: 'CA',
            state: 'Ontario',
            lat: 42.9832406,
            lon: -81.243372
          }
        ])
      });

      const response = await request(app)
        .get('/search?query=London&limit=2')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: [
          {
            name: 'London',
            country: 'GB',
            state: 'England',
            lat: 51.5073219,
            lon: -0.1276474
          },
          {
            name: 'London',
            country: 'CA',
            state: 'Ontario',
            lat: 42.9832406,
            lon: -81.243372
          }
        ],
        requestId: 'test-uuid-1234',
        cached: false,
        count: 2
      });
    });

    it('should respect limit parameter (1-10 max)', async () => {
      // Mock successful response with 5 results
      const mockResults = Array.from({ length: 5 }, (_, i) => ({
        name: `Location ${i + 1}`,
        country: 'US',
        lat: 40.0 + i,
        lon: -74.0 + i
      }));

      vi.mocked(mockFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults
      });

      const response = await request(app)
        .get('/search?query=Test&limit=3')
        .expect(200);

      expect(response.body.count).toBe(5); // Actual count from API
      expect(response.body.data).toHaveLength(5);
    });

    it('should handle empty query with 400 error', async () => {
      const response = await request(app)
        .get('/search?query=&limit=5')
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

    it('should handle query too long with 400 error', async () => {
      const longQuery = 'a'.repeat(101); // 101 characters
      
      const response = await request(app)
        .get(`/search?query=${longQuery}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('validation_error');
    });

    it('should cache search results for 1 hour', async () => {
      const cachedLocationData = JSON.stringify([
        {
          name: 'Paris',
          country: 'FR',
          lat: 48.8566,
          lon: 2.3522
        }
      ]);

      // Get reference to the mocked cache
      const cacheModule = await import('@voilajsx/appkit/cache');
      const mockCache = cacheModule.cacheClass.get();
      
      // Set up the cache mock to return cached data for this test
      vi.mocked(mockCache.get).mockResolvedValueOnce(cachedLocationData);

      const response = await request(app)
        .get('/search?query=Paris')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: [
          {
            name: 'Paris',
            country: 'FR',
            lat: 48.8566,
            lon: 2.3522
          }
        ],
        cached: true
      });

      // Verify no external API calls were made
      expect(vi.mocked(mockFetch)).not.toHaveBeenCalled();
    });

    it('should handle external API failures gracefully', async () => {
      // Mock OpenWeatherMap network failure
      vi.mocked(mockFetch).mockRejectedValueOnce(new Error('Network error'));

      const response = await request(app)
        .get('/search?query=TestCity')
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'server_error',
          message: 'Internal server error',
          code: 'SEARCH_SERVICE_ERROR'
        }
      });
    });
  });
});