/**
 * {{FEATURE_NAME}} feature business logic and service layer
 * @module {{APP_NAME}}/{{FEATURE_NAME}}
 * @file src/api/{{APP_NAME}}/features/{{FEATURE_NAME}}/{{FEATURE_NAME}}.services.ts
 * 
 * @llm-rule WHEN: Need business logic for {{FEATURE_NAME}} operations
 * @llm-rule AVOID: Direct database access - use repository pattern if needed
 * @llm-rule NOTE: All methods should be static for easy testing and imports
 */

import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { {{FEATURE_NAME_PASCAL}}Schema, {{FEATURE_NAME_PASCAL}}Response, {{FEATURE_NAME_PASCAL}}Data } from './{{FEATURE_NAME}}.types.js';

const utils = utilClass.get();
const log = loggerClass.get('{{FEATURE_NAME}}.service');
const err = errorClass.get();
const secure = securityClass.get();

export class {{FEATURE_NAME_PASCAL}}Service {
  /**
   * Generate personalized greeting from {{APP_NAME}}/{{FEATURE_NAME}} for specific name
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

      const response: {{FEATURE_NAME_PASCAL}}Response = {
        success: true,
        data: {
          message: `Hello from {{APP_NAME}}/{{FEATURE_NAME}}, ${name}!`,
          app: '{{APP_NAME}}',
          feature: '{{FEATURE_NAME}}',
          name,
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0'
        }
      };
      
      log.info('{{FEATURE_NAME_PASCAL}} greeting completed', { requestId, name });
      res.json(response);
      
    } catch (error: any) {
      log.error('{{FEATURE_NAME_PASCAL}} greeting failed', { requestId, error: error.message });
      throw error;
    }
  }

  /**
   * Generate default "Hello from {{APP_NAME}}/{{FEATURE_NAME}}" greeting
   * @llm-rule WHEN: No name parameter provided - fallback greeting
   * @llm-rule AVOID: Hardcoding timestamps - use new Date().toISOString()
   */
  static async getDefault(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const response: {{FEATURE_NAME_PASCAL}}Response = {
        success: true,
        data: {
          message: 'Hello from {{APP_NAME}}/{{FEATURE_NAME}}!',
          app: '{{APP_NAME}}',
          feature: '{{FEATURE_NAME}}',
          name: 'World',
          timestamp: new Date().toISOString(),
          requestId,
          version: '1.0.0'
        }
      };
      
      log.info('Default {{FEATURE_NAME}} greeting completed', { requestId });
      res.json(response);
      
    } catch (error: any) {
      log.error('Default {{FEATURE_NAME}} greeting failed', { requestId, error: error.message });
      throw err.serverError('Failed to generate greeting');
    }
  }
}