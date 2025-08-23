// Hello service handlers - testing 'none' validation mode

import { Request, Response } from 'express';
// Import VoilaJSX AppKit modules for enterprise features
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { HelloSchema, type HelloResponse } from './hello.models.js';

const utils = utilClass.get();
const log = loggerClass.get('hello.service');
const err = errorClass.get();
const secure = securityClass.get();

export class HelloService {
  /**
   * Generate personalized greeting for specific name
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

      // Greetings in 3 languages
      const greetings = [
        `Hello, ${name}!`,           // English
        `Hola, ${name}!`,            // Spanish  
        `Bonjour, ${name}!`          // French
      ];

      const response: HelloResponse = {
        success: true,
        data: {
          greetings,
          name,
          language_count: 3,
          timestamp: new Date().toISOString(),
          requestId,
          feature: 'hello'
        }
      };
      
      log.info('Hello greeting completed', { requestId, name });
      res.json(response);
      
    } catch (error: any) {
      log.error('Hello greeting failed', { requestId, error: error.message });
      throw error;
    }
  }

  /**
   * Generate default "Hello World" greeting in 3 languages
   * @llm-rule WHEN: No name parameter provided - fallback greeting
   * @llm-rule AVOID: Hardcoding timestamps - use new Date().toISOString()
   */
  static async greetDefault(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const greetings = [
        'Hello, World!',
        'Hola, Mundo!', 
        'Bonjour, Monde!'
      ];

      const response: HelloResponse = {
        success: true,
        data: {
          greetings,
          name: 'World',
          language_count: 3,
          timestamp: new Date().toISOString(),
          requestId,
          feature: 'hello'
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