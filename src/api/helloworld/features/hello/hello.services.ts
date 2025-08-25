/**
 * Feature: Hello World Service
 * Purpose: Simple Hello World endpoint returning "Hello World" message
 * Dependencies: None (simplified for demo)
 * Exports: HelloService
 * 
 * @llm-rule WHEN: Need business logic for hello operations
 * @llm-rule AVOID: Complex logic in simple demo - keep minimal
 * @llm-rule NOTE: All methods should be static for easy testing and imports
 */

import { HelloResponse } from './hello.types.js';

export class HelloService {
  /**
   * Generate simple Hello World message
   * @returns Hello World response with standard format
   * @llm-rule WHEN: User requests simple hello endpoint
   * @llm-rule AVOID: Adding complex logic - this is a demo
   * @llm-rule NOTE: Returns consistent format for all hello requests
   */
  static async getHello(): Promise<HelloResponse> {
    return {
      success: true,
      data: {
        message: 'Hello World'
      }
    };
  }
}