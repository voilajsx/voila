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

// Mock Prisma client first to prevent database operations during tests
vi.mock('../../logs/logs.models.js', () => ({
  GreetingLogModel: {
    create: vi.fn().mockResolvedValue({ id: 'mock-log-id', createdAt: new Date() })
  }
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

vi.mock('@voilajsx/appkit/auth', () => ({
  authClass: {
    get: () => ({
      requireApiToken: vi.fn(() => (req: any, res: any, next: any) => {
        // Mock API token validation - simulate valid API token
        req.apiToken = { keyId: 'test-service', role: 'service' };
        next();
      }),
      requireLoginToken: vi.fn(() => (req: any, res: any, next: any) => {
        // Mock login token validation - simulate valid user token
        req.user = { userId: 'test-user-123', role: 'user', level: 'basic' };
        next();
      }),
      requireUserRoles: vi.fn((roles: string[]) => (req: any, res: any, next: any) => {
        // Mock role validation - simulate admin user for testing
        req.user = { userId: 'test-admin-123', role: 'admin', level: 'tenant' };
        next();
      }),
      user: vi.fn((req: any) => {
        // Return mock user based on what's set by middleware
        return req.user || null;
      })
    })
  }
}));

// Import after mocking
import { HelloService } from './hello.services.js';
import { authClass } from '@voilajsx/appkit/auth';

let app: express.Application;

beforeEach(() => {
  app = express();
  app.use(express.json());
  
  const auth = authClass.get();
  
  // Setup routes with auth middleware (matching the actual routes)
  app.get('/api/greeting/hello', HelloService.greetDefault);
  app.get('/api/greeting/hello/goodday', auth.requireApiToken(), HelloService.greetGoodDay);
  app.get('/api/greeting/hello/thankyou', auth.requireLoginToken(), HelloService.greetThankYou);
  app.get('/api/greeting/hello/:name', 
    auth.requireLoginToken(), 
    auth.requireUserRoles(['admin.tenant']), 
    HelloService.greetByName
  );
  
  app.use((error: any, req: Request, res: Response, next: any) => {
    res.status(error.statusCode || 500).json({
      error: error.type || 'serverError',
      message: error.message,
      statusCode: error.statusCode || 500
    });
  });
});

describe('Hello Feature Authentication Tests', () => {
  it('should return default greeting (PUBLIC - no auth)', async () => {
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

  it('should return good day greeting (API KEY required)', async () => {
    const response = await request(app)
      .get('/api/greeting/hello/goodday')
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        greetings: ['Good Day!', 'Buen Día!', 'Bonne Journée!'],
        name: 'World',
        language_count: 3,
        feature: 'hello'
      }
    });
  });

  it('should return thank you greeting (LOGIN required)', async () => {
    const response = await request(app)
      .get('/api/greeting/hello/thankyou')
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        greetings: [
          'Thank You, User test-user-123!',
          'Gracias, Usuario test-user-123!',
          'Merci, Utilisateur test-user-123!'
        ],
        name: 'User test-user-123',
        language_count: 3,
        feature: 'hello'
      }
    });
  });

  it('should return personalized greeting (ADMIN required)', async () => {
    const response = await request(app)
      .get('/api/greeting/hello/john')
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        greetings: [
          'Hello, john! (Admin: test-admin-123)',
          'Hola, john! (Admin: test-admin-123)',
          'Bonjour, john! (Admin: test-admin-123)'
        ],
        name: 'john',
        language_count: 3,
        feature: 'hello'
      }
    });
  });

  it('should handle empty name parameter for admin endpoint', async () => {
    const response = await request(app)
      .get('/api/greeting/hello/')
      .expect(400);

    expect(response.body.error).toBe('badRequest');
  });
});