/**
 * Vitest Configuration - Unit and integration testing for frontend features
 * @file vitest.config.ts  
 * @llm-rule WHEN: Setting up unit tests for hooks, components, and utilities
 * @llm-rule PATTERN: JSDoc environment for React, test file patterns, coverage reporting
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Default environment for frontend tests
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable'
      }
    },
    setupFiles: ['./src/lib/test-setup.ts'],
    globals: true,
    
    /* Feature-level test patterns */
    include: [
      'src/web/**/*.{test,spec}.{ts,tsx}',        // Frontend tests (jsdom)
      'src/api/**/*.{test,spec}.{ts,js}',         // Backend API tests (use pool config for node)
      'src/lib/**/*.{test,spec}.{ts,tsx}'         // Library tests
    ],
    
    /* Global exclusions for all projects */
    exclude: [
      'node_modules',
      'dist', 
      'tests', // Exclude Playwright E2E tests
      '**/prisma/generated/**'
    ],
    
    /* Coverage configuration */
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/', // Exclude E2E tests from coverage
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/prisma/generated/**'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    
    /* Test timeout */
    testTimeout: 10000, // 10 seconds
    
    /* Hook timeout */
    hookTimeout: 10000,
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@web': resolve(__dirname, 'src/web'),
      '@api': resolve(__dirname, 'src/api'),
      '@app': resolve(__dirname, 'src/app'),
      '@voilajsx/appkit': resolve(__dirname, 'node_modules/@voilajsx/appkit'),
      '@voilajsx/uikit': resolve(__dirname, 'node_modules/@voilajsx/uikit'),
    },
  },
});