/**
 * hello feature unit tests
 * @module helloworld/hello
 * @file src/api/helloworld/features/hello/hello.test.ts
 * 
 * @llm-rule WHEN: Testing hello service endpoints with mocked AppKit dependencies
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
import helloRoutes from './hello.routes.js';

describe('Hello Feature', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/hello', helloRoutes);
  });

  describe('GET /hello', () => {
    it('should return Hello World message', async () => {
      const response = await request(app)
        .get('/hello')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'Hello World'
        }
      });
    });

    it('should return JSON response with success true', async () => {
      const response = await request(app)
        .get('/hello')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should respond with status 200', async () => {
      await request(app)
        .get('/hello')
        .expect(200);
    });
  });
});