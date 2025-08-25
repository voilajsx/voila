/**
 * hello feature unit tests
 * @module welcome/hello
 * @file src/api/welcome/features/hello/hello.test.ts
 * 
 * @llm-rule WHEN: Testing hello service endpoints with mocked AppKit dependencies
 * @llm-rule AVOID: Testing with real AppKit instances - use mocks for isolation
 * @llm-rule NOTE: Tests simple hello world implementation with basic response format
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
      success: vi.fn(),
      error: vi.fn()
    })
  }
}));

vi.mock('@voilajsx/appkit/error', () => ({
  errorClass: {
    get: () => ({
      serverError: vi.fn((message) => {
        const error = new Error(message) as any;
        error.statusCode = 500;
        error.type = 'serverError';
        return error;
      })
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
    app.use('/api/welcome/hello', helloRoutes);
  });

  describe('GET /api/welcome/hello', () => {
    it('should return hello world greeting message', async () => {
      const response = await request(app)
        .get('/api/welcome/hello')
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Hello, World!'
      });

      expect(response.body.timestamp).toBeDefined();
      expect(typeof response.body.timestamp).toBe('string');
    });

    it('should include timestamp in response', async () => {
      const response = await request(app)
        .get('/api/welcome/hello')
        .expect(200);

      expect(response.body.timestamp).toBeDefined();
      
      // Verify timestamp is valid ISO string
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should return proper JSON format', async () => {
      const response = await request(app)
        .get('/api/welcome/hello')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          timestamp: expect.any(String)
        })
      );
    });
  });
});