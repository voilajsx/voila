/**
 * VoilaJSX AppKit Mock Utilities - Framework-level testing support
 * @file src/lib/test-appkit-mocks.ts
 * 
 * @llm-rule WHEN: Backend API tests need AppKit module mocking
 * @llm-rule AVOID: Duplicating AppKit mocks in every test file
 * @llm-rule PATTERN: Centralized mock factory functions for consistent testing
 * @llm-rule NOTE: Provides standard AppKit mocks for isolated unit testing
 */

import { vi } from 'vitest';

// ========================================
// APPKIT MOCK FACTORIES
// ========================================

/**
 * Create standard AppKit util mock
 */
export const createMockAppKitUtil = () => ({
  utilClass: {
    get: () => ({
      uuid: vi.fn(() => `mock-uuid-${Date.now()}`),
      generateId: vi.fn(() => `mock-id-${Date.now()}`),
      formatDate: vi.fn((date) => date?.toISOString?.() || '2025-01-01T00:00:00.000Z'),
      sanitize: vi.fn((input) => String(input).trim())
    })
  }
});

/**
 * Create standard AppKit logger mock
 */
export const createMockAppKitLogger = () => ({
  loggerClass: {
    get: () => ({
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn()
    })
  }
});

/**
 * Create standard AppKit error mock
 */
export const createMockAppKitError = () => ({
  errorClass: {
    get: () => ({
      badRequest: vi.fn((message) => {
        const error = new Error(message) as any;
        error.statusCode = 400;
        error.type = 'badRequest';
        return error;
      }),
      unauthorized: vi.fn((message) => {
        const error = new Error(message) as any;
        error.statusCode = 401;
        error.type = 'unauthorized';
        return error;
      }),
      forbidden: vi.fn((message) => {
        const error = new Error(message) as any;
        error.statusCode = 403;
        error.type = 'forbidden';
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
});

/**
 * Create standard AppKit security mock
 */
export const createMockAppKitSecurity = () => ({
  securityClass: {
    get: () => ({
      input: vi.fn((input) => String(input).trim()),
      sanitizeHtml: vi.fn((html) => String(html).replace(/<[^>]*>/g, '')),
      hash: vi.fn((value) => `hashed-${value}`),
      encrypt: vi.fn((value) => `encrypted-${value}`),
      decrypt: vi.fn((value) => value.replace('encrypted-', ''))
    })
  }
});

/**
 * Create standard AppKit auth mock for backend tests
 */
export const createMockAppKitAuth = (options: {
  mockApiToken?: any;
  mockUser?: any;
  mockAdminUser?: any;
} = {}) => {
  const defaultApiToken = options.mockApiToken || { keyId: 'test-service', role: 'service' };
  const defaultUser = options.mockUser || { userId: 'test-user-123', role: 'user', level: 'basic' };
  const defaultAdminUser = options.mockAdminUser || { userId: 'test-admin-123', role: 'admin', level: 'tenant' };
  
  return {
    authClass: {
      get: () => ({
        requireApiToken: vi.fn(() => (req: any, res: any, next: any) => {
          req.apiToken = defaultApiToken;
          next();
        }),
        requireLoginToken: vi.fn(() => (req: any, res: any, next: any) => {
          req.user = defaultUser;
          next();
        }),
        requireUserRoles: vi.fn(() => (req: any, res: any, next: any) => {
          req.user = defaultAdminUser;
          next();
        }),
        user: vi.fn((req: any) => req.user || null),
        validateToken: vi.fn(() => true),
        generateToken: vi.fn(() => 'mock-generated-token')
      })
    }
  };
};

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Setup all standard AppKit mocks for backend testing
 */
export function setupAppKitMocks(customOptions: {
  mockApiToken?: any;
  mockUser?: any;
  mockAdminUser?: any;
} = {}) {
  // Mock all AppKit modules
  vi.mock('@voilajsx/appkit/util', () => createMockAppKitUtil());
  vi.mock('@voilajsx/appkit/logger', () => createMockAppKitLogger());
  vi.mock('@voilajsx/appkit/error', () => createMockAppKitError());
  vi.mock('@voilajsx/appkit/security', () => createMockAppKitSecurity());
  vi.mock('@voilajsx/appkit/auth', () => createMockAppKitAuth(customOptions));
}

/**
 * Create inline auth middleware for simple backend tests
 */
export function createSimpleAuthMocks(options: {
  apiToken?: any;
  user?: any;
  adminUser?: any;
} = {}) {
  return {
    requireApiToken: () => (req: any, res: any, next: any) => {
      req.apiToken = options.apiToken || { keyId: 'test-service', role: 'service' };
      next();
    },
    requireLoginToken: () => (req: any, res: any, next: any) => {
      req.user = options.user || { userId: 'test-user-123', role: 'user', level: 'basic' };
      next();
    },
    requireUserRoles: () => (req: any, res: any, next: any) => {
      req.user = options.adminUser || { userId: 'test-admin-123', role: 'admin', level: 'tenant' };
      next();
    }
  };
}

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface MockUser {
  userId: string;
  role: 'user' | 'admin' | 'moderator';
  level: string;
}

export interface MockApiToken {
  keyId: string;
  role: 'service' | 'admin';
}

export interface TestAuthContext {
  user?: MockUser;
  apiToken?: MockApiToken;
  adminUser?: MockUser;
}