/**
 * temperature feature business logic and service layer
 * @module converter/temperature
 * @file src/api/converter/features/temperature/temperature.services.ts
 * 
 * @llm-rule WHEN: Need business logic for temperature operations
 * @llm-rule AVOID: Direct database access - use repository pattern if needed
 * @llm-rule NOTE: All methods should be static for easy testing and imports
 */

import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { TemperatureSchema, TemperatureResponse, TemperatureData } from './temperature.types.js';

const utils = utilClass.get();
const log = loggerClass.get('temperature.service');
const err = errorClass.get();
const secure = securityClass.get();

export class TemperatureService {
  /**
   * Generate personalized greeting from converter/temperature for specific name
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

      const response: TemperatureResponse = {
        success: true,
        data: {
          message: `Hello from converter/temperature, ${name}!`,
          app: 'converter',
          feature: 'temperature',
          name,
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0'
        }
      };
      
      log.info('Temperature greeting completed', { requestId, name });
      res.json(response);
      
    } catch (error: any) {
      log.error('Temperature greeting failed', { requestId, error: error.message });
      throw error;
    }
  }

  /**
   * Generate default "Hello from converter/temperature" greeting
   * @llm-rule WHEN: No name parameter provided - fallback greeting
   * @llm-rule AVOID: Hardcoding timestamps - use new Date().toISOString()
   */
  static async getDefault(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const response: TemperatureResponse = {
        success: true,
        data: {
          message: 'Hello from converter/temperature!',
          app: 'converter',
          feature: 'temperature',
          name: 'World',
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0'
        }
      };
      
      log.info('Default temperature greeting completed', { requestId });
      res.json(response);
      
    } catch (error: any) {
      log.error('Default temperature greeting failed', { requestId, error: error.message });
      throw err.serverError('Failed to generate greeting');
    }
  }
}