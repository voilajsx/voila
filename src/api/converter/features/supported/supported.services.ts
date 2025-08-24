/**
 * supported feature business logic and service layer
 * @module converter/supported
 * @file src/api/converter/features/supported/supported.services.ts
 * 
 * @llm-rule WHEN: Need business logic for supported operations
 * @llm-rule AVOID: Direct database access - use repository pattern if needed
 * @llm-rule NOTE: All methods should be static for easy testing and imports
 */

import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { SupportedSchema, SupportedResponse, SupportedData } from './supported.types.js';

const utils = utilClass.get();
const log = loggerClass.get('supported.service');
const err = errorClass.get();
const secure = securityClass.get();

export class SupportedService {
  /**
   * Generate personalized greeting from converter/supported for specific name
   * @llm-rule WHEN: User provides name parameter in URL path
   * @llm-rule AVOID: Using req.params.name directly - always sanitize with secure.input()
   */
  static async greetByName(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const name = secure.input(req.params.name);
      
      if (!name || name.length === 0) {
        throw err.badRequest('Name parameter is required');
      }
      
      if (name.length > 50) {
        throw err.badRequest('Name must be 50 characters or less');
      }

      const response: SupportedResponse = {
        success: true,
        data: {
          message: `Hello from converter/supported, ${name}!`,
          app: 'converter',
          feature: 'supported',
          name,
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0'
        }
      };
      
      log.info('Supported greeting completed', { requestId, name });
      res.json(response);
      
    } catch (error: any) {
      log.error('Supported greeting failed', { requestId, error: error.message });
      throw error;
    }
  }

  /**
   * Generate default "Hello from converter/supported" greeting
   * @llm-rule WHEN: No name parameter provided - fallback greeting
   * @llm-rule AVOID: Hardcoding timestamps - use new Date().toISOString()
   */
  static async getDefault(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const response: SupportedResponse = {
        success: true,
        data: {
          message: 'Hello from converter/supported!',
          app: 'converter',
          feature: 'supported',
          name: 'World',
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0'
        }
      };
      
      log.info('Default supported greeting completed', { requestId });
      res.json(response);
      
    } catch (error: any) {
      log.error('Default supported greeting failed', { requestId, error: error.message });
      throw err.serverError('Failed to generate greeting');
    }
  }
}