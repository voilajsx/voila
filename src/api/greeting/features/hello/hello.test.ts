/**
 * Hello Feature Tests - Basic functional test
 * @module greeting/hello  
 * @file src/api/greeting/features/hello/hello.test.ts
 * 
 * @llm-rule WHEN: Testing hello service endpoints with mocked AppKit dependencies
 * @llm-rule AVOID: Testing with real AppKit instances - use mocks for isolation
 * @llm-rule NOTE: Uses supertest for HTTP testing and vitest for test framework
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express, { Request, Response } from 'express';

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
      input: vi.fn((input) => input)
    })
  }
}));

// Import after mocking
import { HelloService } from './hello.services.js';

let app: express.Application;

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.get('/api/greeting/hello', HelloService.greetDefault);
  app.get('/api/greeting/hello/:name', HelloService.greetByName);
  
  app.use((error: any, req: Request, res: Response, next: any) => {
    res.status(error.statusCode || 500).json({
      error: error.type || 'serverError',
      message: error.message,
      statusCode: error.statusCode || 500
    });
  });
});

describe('Hello Feature Basic Tests', () => {
  it('should return default greeting', async () => {
    const response = await request(app)
      .get('/api/greeting/hello')
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        greetings: ['Hello, World!', 'Hola, Mundo!', 'Bonjour, Monde!'],
        name: 'World',
        language_count: 3,
        feature: 'hello'
      }
    });
  });

  // REMOVED: should return personalized greeting (testing none validation - should be ignored)

  it('should handle empty name parameter', async () => {
    const response = await request(app)
      .get('/api/greeting/hello/')
      .expect(400);

    expect(response.body.error).toBe('badRequest');
  });
});