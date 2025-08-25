/**
 * status feature business logic and service layer
 * @module welcome/status
 * @file src/api/welcome/features/status/status.services.ts
 * 
 * @llm-rule WHEN: Need business logic for status operations
 * @llm-rule AVOID: Direct database access - use repository pattern if needed
 * @llm-rule NOTE: All methods should be static for easy testing and imports
 */

import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { StatusSchema, StatusResponse, StatusData } from './status.types.js';

const utils = utilClass.get();
const log = loggerClass.get('status.service');
const err = errorClass.get();
const secure = securityClass.get();

export class StatusService {
  /**
   * Generate personalized greeting from welcome/status for specific name
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

      const response: StatusResponse = {
        success: true,
        data: {
          message: `Hello from welcome/status, ${name}!`,
          app: 'welcome',
          feature: 'status',
          name,
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0'
        }
      };
      
      log.info('Status greeting completed', { requestId, name });
      res.json(response);
      
    } catch (error: any) {
      log.error('Status greeting failed', { requestId, error: error.message });
      throw error;
    }
  }

  /**
   * Generate default "Hello from welcome/status" greeting
   * @llm-rule WHEN: No name parameter provided - fallback greeting
   * @llm-rule AVOID: Hardcoding timestamps - use new Date().toISOString()
   */
  static async getDefault(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const response: StatusResponse = {
        success: true,
        data: {
          message: 'Hello from welcome/status!',
          app: 'welcome',
          feature: 'status',
          name: 'World',
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0'
        }
      };
      
      log.info('Default status greeting completed', { requestId });
      res.json(response);
      
    } catch (error: any) {
      log.error('Default status greeting failed', { requestId, error: error.message });
      throw err.serverError('Failed to generate greeting');
    }
  }
}