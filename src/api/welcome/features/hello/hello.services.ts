/**
 * hello feature business logic and service layer
 * @module welcome/hello
 * @file src/api/welcome/features/hello/hello.services.ts
 * 
 * @llm-rule WHEN: Need business logic for hello operations
 * @llm-rule AVOID: Complex logic - keep hello world simple
 * @llm-rule NOTE: Returns basic hello world greeting with timestamp
 */

import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import type { Request, Response } from 'express';
import { HelloResponse } from './hello.types.js';

const utils = utilClass.get();
const log = loggerClass.get('hello.service');
const err = errorClass.get();

export class HelloService {
  /**
   * Generate hello world greeting message
   * @returns Hello world response with timestamp
   * @llm-rule WHEN: Client requests hello world greeting
   * @llm-rule AVOID: Making this complex - keep it simple
   * @llm-rule NOTE: Basic hello world implementation with logging
   */
  static async getHelloWorld(): Promise<HelloResponse> {
    try {
      log.info('Processing hello world request');
      
      const response: HelloResponse = {
        message: 'Hello, World!',
        timestamp: new Date().toISOString()
      };
      
      log.info('Hello world request completed', { response });
      return response;
      
    } catch (error: any) {
      log.error('Hello world request failed', { error: error.message });
      throw err.serverError('Failed to generate hello world greeting');
    }
  }
}