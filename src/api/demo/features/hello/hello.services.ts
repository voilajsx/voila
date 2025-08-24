/**
 * hello feature business logic and service layer
 * @module demo/hello
 * @file src/api/demo/features/hello/hello.services.ts
 * 
 * @llm-rule WHEN: Need business logic for hello operations
 * @llm-rule AVOID: Direct database access - use repository pattern if needed
 * @llm-rule NOTE: All methods should be static for easy testing and imports
 */

import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { HelloResponse } from './hello.types.js';

const utils = utilClass.get();
const log = loggerClass.get('hello.service');
const err = errorClass.get();
const secure = securityClass.get();

export class HelloService {
  /**
   * Generate "Hello, World!" greeting
   * @llm-rule WHEN: No name parameter provided - fallback greeting
   * @llm-rule AVOID: Hardcoding timestamps - use new Date().toISOString()
   */
  static async getHello(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const response: HelloResponse = {
        success: true,
        data: {
          message: 'Hello, World!'
        }
      };
      
      log.info('Default hello greeting completed', { requestId });
      res.json(response);
      
    } catch (error: any) {
      log.error('Default hello greeting failed', { requestId, error: error.message });
      throw err.serverError('Failed to generate greeting');
    }
  }
}
