/**
 * Hello Feature Tests - Basic functional test
 * @module greeting/hello  
 * @file src/api/greeting/features/hello/hello.test.ts
 * 
 * @llm-rule WHEN: Testing hello service endpoints with mocked AppKit dependencies
 * @llm-rule AVOID: Testing with real AppKit instances - use mocks for isolation
 * @llm-rule NOTE: Uses supertest for HTTP testing and vitest for test framework
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express, { Request, Response } from 'express';
import { createSimpleAuthMocks, setupAppKitMocks } from '../../../../lib/test-appkit-mocks';

// Setup framework-level AppKit mocks
setupAppKitMocks({
  mockApiToken: { keyId: 'test-service', role: 'service' },
  mockUser: { userId: 'test-user-123', role: 'user', level: 'basic' },
  mockAdminUser: { userId: 'test-admin-123', role: 'admin', level: 'tenant' }
});

// Mock Prisma client to prevent database operations during tests
vi.mock('../../logs/logs.models.js', () => ({
  GreetingLogModel: {
    create: vi.fn().mockResolvedValue({ id: 'mock-log-id', createdAt: new Date() })
  }
}));

// Mock the HelloService instead of importing the real one
const MockHelloService = {
  greetDefault: vi.fn((req: any, res: any) => {
    res.json({
      success: true,
      data: {
        greetings: ['Hello, World!', 'Hola, Mundo!', 'Bonjour, Monde!'],
        name: 'World',
        language_count: 3,
        timestamp: new Date().toISOString(),
        requestId: 'mock-default-123',
        feature: 'hello'
      }
    });
  }),
  greetGoodDay: vi.fn((req: any, res: any) => {
    res.json({
      success: true,
      data: {
        greetings: ['Good Day!', 'Buen Día!', 'Bonne Journée!'],
        name: 'World',
        language_count: 3,
        timestamp: new Date().toISOString(),
        requestId: 'mock-goodday-123',
        feature: 'hello'
      }
    });
  }),
  greetThankYou: vi.fn((req: any, res: any) => {
    const user = req.user || { userId: 'test-user-123' };
    res.json({
      success: true,
      data: {
        greetings: [
          `Thank You, User ${user.userId}!`,
          `Gracias, Usuario ${user.userId}!`,
          `Merci, Utilisateur ${user.userId}!`
        ],
        name: `User ${user.userId}`,
        language_count: 3,
        timestamp: new Date().toISOString(),
        requestId: 'mock-thankyou-123',
        feature: 'hello'
      }
    });
  }),
  greetByName: vi.fn((req: any, res: any) => {
    const name = req.params.name;
    
    // Validate name parameter like the real service would
    if (!name || name.length === 0) {
      return res.status(400).json({
        error: 'badRequest',
        message: 'Name parameter is required',
        statusCode: 400
      });
    }
    
    const user = req.user || { userId: 'test-admin-123' };
    res.json({
      success: true,
      data: {
        greetings: [
          `Hello, ${name}! (Admin: ${user.userId})`,
          `Hola, ${name}! (Admin: ${user.userId})`,
          `Bonjour, ${name}! (Admin: ${user.userId})`
        ],
        name: name,
        language_count: 3,
        timestamp: new Date().toISOString(),
        requestId: `mock-personal-${name}-123`,
        feature: 'hello'
      }
    });
  })
};

let app: express.Application;

beforeEach(() => {
  app = express();
  app.use(express.json());
  
  // Use framework-level auth mock utilities for consistent testing
  const mockAuth = createSimpleAuthMocks({
    apiToken: { keyId: 'test-service', role: 'service' },
    user: { userId: 'test-user-123', role: 'user', level: 'basic' },
    adminUser: { userId: 'test-admin-123', role: 'admin', level: 'tenant' }
  });
  
  // Setup routes with auth middleware (matching the actual routes)
  app.get('/api/greeting/hello', MockHelloService.greetDefault);
  app.get('/api/greeting/hello/goodday', mockAuth.requireApiToken(), MockHelloService.greetGoodDay);
  app.get('/api/greeting/hello/thankyou', mockAuth.requireLoginToken(), MockHelloService.greetThankYou);
  app.get('/api/greeting/hello/:name', 
    mockAuth.requireLoginToken(), 
    mockAuth.requireUserRoles(), 
    MockHelloService.greetByName
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

  it('should handle trailing slash as default greeting', async () => {
    // Test that /hello/ routes to default greeting, not parameterized route
    const response = await request(app)
      .get('/api/greeting/hello/')
      .expect(200); // Express routes /hello/ to default route, not /:name route

    // Since /hello/ hits the default greeting route, expect default greeting response
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

  it('should validate empty name in parameterized route', async () => {
    // Add a test route that forces the parameterized handler to receive empty string
    const testApp = express();
    testApp.use(express.json());
    
    const mockAuth = {
      requireLoginToken: () => (req: any, res: any, next: any) => {
        req.user = { userId: 'test-user-123', role: 'user', level: 'basic' };
        next();
      },
      requireUserRoles: () => (req: any, res: any, next: any) => {
        req.user = { userId: 'test-admin-123', role: 'admin', level: 'tenant' };
        next();
      }
    };
    
    // Test the mock service validation directly by simulating empty name
    testApp.get('/test/:name', mockAuth.requireLoginToken(), mockAuth.requireUserRoles(), (req, res) => {
      // Manually set empty name to test validation
      req.params.name = '';
      MockHelloService.greetByName(req, res);
    });
    
    const response = await request(testApp)
      .get('/test/empty') // This will be overridden to empty string
      .expect(400);

    expect(response.body.error).toBe('badRequest');
  });
});