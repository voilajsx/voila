/**
 * currency feature unit tests
 * @module converter/currency
 * @file src/api/converter/features/currency/currency.test.ts
 * 
 * @llm-rule WHEN: Testing currency service endpoints with mocked AppKit dependencies
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
import currencyRoutes from './currency.routes.js';

describe('Currency Feature', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/currency', currencyRoutes);
  });

  describe('GET /currency', () => {
    it('should return default greeting from converter/currency', async () => {
      const response = await request(app)
        .get('/currency')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'Hello from converter/currency!',
          app: 'converter',
          feature: 'currency',
          name: 'World',
          version: '1.0.0',
          requestId: 'test-uuid-1234'
        }
      });

      expect(response.body.data.timestamp).toBeDefined();
    });

    it('should include proper headers', async () => {
      const response = await request(app)
        .get('/currency')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('GET /currency/:name', () => {
    it('should return personalized greeting from converter/currency', async () => {
      const response = await request(app)
        .get('/currency/Alice')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'Hello from converter/currency, Alice!',
          app: 'converter',
          feature: 'currency',
          name: 'Alice',
          version: '1.0.0',
          requestId: 'test-uuid-1234'
        }
      });

      expect(response.body.data.timestamp).toBeDefined();
    });

    it('should handle names with special characters', async () => {
      const response = await request(app)
        .get('/currency/José')
        .expect(200);

      expect(response.body.data.name).toBe('José');
      expect(response.body.data.message).toContain('José');
    });
  });
});