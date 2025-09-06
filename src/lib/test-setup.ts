/**
 * Unified Vitest Test Setup - Browser and Node.js environment configuration
 * @file src/lib/test-setup.ts
 * 
 * @llm-rule WHEN: Setting up test environment for both React components and backend APIs
 * @llm-rule PATTERN: Environment-aware setup that configures browser or Node.js specific mocks
 * @llm-rule AVOID: Duplicating setup logic across multiple files
 * @llm-rule NOTE: Detects environment and applies appropriate configuration automatically
 */

import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';

// Conditional imports for browser environment
let cleanup: any;
if (typeof window !== 'undefined') {
  // Browser environment - import React testing utilities
  import('@testing-library/jest-dom');
  cleanup = (await import('@testing-library/react')).cleanup;
}

// ========================================
// ENVIRONMENT DETECTION
// ========================================

const isBrowserEnvironment = typeof window !== 'undefined';
const isNodeEnvironment = typeof process !== 'undefined' && process.versions?.node;

console.log(`🧪 Test setup: ${isBrowserEnvironment ? 'Browser (jsdom)' : 'Node.js'} environment`);

// ========================================
// GLOBAL TEST SETUP
// ========================================

beforeAll(async () => {
  if (isBrowserEnvironment) {
    console.log('🔧 Setting up browser test environment for React components');
  } else if (isNodeEnvironment) {
    console.log('🔧 Setting up Node.js test environment for API tests');
    
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'silent';
  }
});

afterAll(async () => {
  if (isBrowserEnvironment) {
    console.log('🧹 Cleaning up browser test environment');
  } else if (isNodeEnvironment) {
    console.log('🧹 Cleaning up Node.js test environment');
  }
});

afterEach(() => {
  // Browser environment cleanup
  if (isBrowserEnvironment && cleanup) {
    cleanup();
  }
  
  // Reset any global state between tests
  vi.clearAllMocks();
});

// ========================================
// BROWSER ENVIRONMENT SETUP (JSDOM)
// ========================================

if (isBrowserEnvironment) {
  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  }));

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  vi.stubGlobal('localStorage', localStorageMock);

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  vi.stubGlobal('sessionStorage', sessionStorageMock);

  // Setup console error/warn suppression for expected React warnings
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: React.createFactory'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
       args[0].includes('componentWillUpdate') ||
       args[0].includes('Warning: Each child in a list'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
}

// ========================================
// NODE.JS ENVIRONMENT SETUP
// ========================================

if (isNodeEnvironment && !isBrowserEnvironment) {
  // Mock Node.js globals if needed
  global.setTimeout = setTimeout;
  global.clearTimeout = clearTimeout;
  global.setInterval = setInterval;
  global.clearInterval = clearInterval;

  // Mock console output in Node.js environment (optional)
  if (process.env.SILENT_TESTS === 'true') {
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();
  }
}

// ========================================
// SHARED SETUP (BOTH ENVIRONMENTS)
// ========================================

// Mock fetch for API calls (available in both environments)
global.fetch = vi.fn();

// Mock crypto for UUID generation (if needed)
if (!global.crypto) {
  global.crypto = {
    randomUUID: vi.fn(() => `mock-uuid-${Date.now()}-${Math.random()}`),
  } as any;
}

// ========================================
// UTILITY EXPORTS
// ========================================

export const testEnvironment = {
  isBrowser: isBrowserEnvironment,
  isNode: isNodeEnvironment,
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};

export const testUtils = {
  /**
   * Create a mock fetch response
   */
  createMockResponse: (data: any, options: { status?: number; ok?: boolean } = {}) => ({
    ok: options.ok ?? true,
    status: options.status ?? 200,
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  }),

  /**
   * Setup fetch mock with predefined responses
   */
  setupFetchMock: (responses: Record<string, any>) => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      const response = responses[url] || responses['*']; // '*' as fallback
      if (response) {
        return Promise.resolve(testUtils.createMockResponse(response));
      }
      return Promise.reject(new Error(`No mock response defined for: ${url}`));
    });
    
    global.fetch = mockFetch;
    return mockFetch;
  },

  /**
   * Wait for next tick (useful for async operations in tests)
   */
  nextTick: () => new Promise(resolve => setTimeout(resolve, 0)),

  /**
   * Sleep for specified milliseconds
   */
  sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
};

// Export test environment info for conditional test logic
export { isBrowserEnvironment, isNodeEnvironment };