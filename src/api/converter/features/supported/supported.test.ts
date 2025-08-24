/**
 * supported feature unit tests
 * @module converter/supported
 * @file src/api/converter/features/supported/supported.test.ts
 * 
 * @llm-rule WHEN: Testing supported service endpoints with mocked AppKit dependencies
 * @llm-rule AVOID: Testing with real AppKit instances - use mocks for isolation
 * @llm-rule NOTE: Uses supertest for HTTP testing and vitest for test framework
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

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
      error: vi.fn()
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

// Import after mocking
import supportedRoutes from './supported.routes.js';

describe('Supported Feature', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/supported', supportedRoutes);
  });

  describe('GET /supported', () => {
    it('should return default greeting from converter/supported', async () => {
      const response = await request(app)
        .get('/supported')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'Hello from converter/supported!',
          app: 'converter',
          feature: 'supported',
          name: 'World',
          version: '1.0.0',
          requestId: 'test-uuid-1234'
        }
      });

      expect(response.body.data.timestamp).toBeDefined();
    });

    it('should include proper headers', async () => {
      const response = await request(app)
        .get('/supported')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('GET /supported/:name', () => {
    it('should return personalized greeting from converter/supported', async () => {
      const response = await request(app)
        .get('/supported/Alice')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'Hello from converter/supported, Alice!',
          app: 'converter',
          feature: 'supported',
          name: 'Alice',
          version: '1.0.0',
          requestId: 'test-uuid-1234'
        }
      });

      expect(response.body.data.timestamp).toBeDefined();
    });

    it('should handle names with special characters', async () => {
      const response = await request(app)
        .get('/supported/José')
        .expect(200);

      expect(response.body.data.name).toBe('José');
      expect(response.body.data.message).toContain('José');
    });
  });
});