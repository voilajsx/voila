// Hello service handlers with authentication integration

import { Request, Response } from 'express';
// Import VoilaJSX AppKit modules for enterprise features
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { authClass } from '@voilajsx/appkit/auth';
import { HelloSchema, type HelloResponse } from './hello.models.js';
import { GreetingLogModel } from '../logs/logs.models.js';

const utils = utilClass.get();
const log = loggerClass.get('hello.service');
const err = errorClass.get();
const secure = securityClass.get();
const auth = authClass.get();

export class HelloService {
  /**
   * Generate personalized greeting for specific name (ADMIN ONLY)
   * @llm-rule WHEN: Admin user provides name parameter in URL path
   * @llm-rule AVOID: Using req.params.name directly - always sanitize with secure.input()
   * @llm-rule NOTE: Requires admin.tenant level authentication
   */
  static async greetByName(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      // Extract authenticated user (admin required via middleware)
      const user = auth.user(req);
      if (!user) {
        throw err.unauthorized('Admin authentication required');
      }

      const name = secure.input(req.params.name);
      
      if (!name || name.length === 0) {
        throw err.badRequest('Name parameter is required');
      }
      
      if (name.length > 50) {
        throw err.badRequest('Name must be 50 characters or less');
      }

      // Admin-enhanced greetings in 3 languages
      const greetings = [
        `Hello, ${name}! (Admin: ${user.userId})`,           // English
        `Hola, ${name}! (Admin: ${user.userId})`,            // Spanish  
        `Bonjour, ${name}! (Admin: ${user.userId})`          // French
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
      
      // Log to database
      await GreetingLogModel.create({
        endpoint: `/hello/${name}`,
        message: greetings.join(' | '),
        userName: name,
        userId: user.userId,
        userRole: user.role,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      log.info('Admin hello greeting completed', { requestId, name, userId: user.userId, role: user.role });
      res.json(response);
      
    } catch (error: any) {
      log.error('Admin hello greeting failed', { requestId, error: error.message });
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
      
      // Log to database
      await GreetingLogModel.create({
        endpoint: '/hello',
        message: greetings.join(' | '),
        userName: 'World',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      log.info('Default hello greeting completed', { requestId });
      res.json(response);
      
    } catch (error: any) {
      log.error('Default hello greeting failed', { requestId, error: error.message });
      throw err.serverError('Failed to generate greeting');
    }
  }

  /**
   * Generate "Good Day" greeting in 3 languages (API KEY REQUIRED)
   * @llm-rule WHEN: External service wants a "good day" greeting
   * @llm-rule AVOID: Hardcoding timestamps - use new Date().toISOString()
   * @llm-rule NOTE: Requires API token authentication for external services
   */
  static async greetGoodDay(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const greetings = [
        'Good Day!',          // English
        'Buen Día!',          // Spanish
        'Bonne Journée!'      // French
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
      
      // Log to database
      await GreetingLogModel.create({
        endpoint: '/goodday',
        message: greetings.join(' | '),
        userName: 'World',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      log.info('Good day greeting completed', { requestId });
      res.json(response);
      
    } catch (error: any) {
      log.error('Good day greeting failed', { requestId, error: error.message });
      throw err.serverError('Failed to generate good day greeting');
    }
  }

  /**
   * Generate "Thank You" greeting in 3 languages (LOGIN REQUIRED)
   * @llm-rule WHEN: Authenticated user wants a "thank you" greeting
   * @llm-rule AVOID: Hardcoding timestamps - use new Date().toISOString()
   * @llm-rule NOTE: Requires login token authentication (any user level)
   */
  static async greetThankYou(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      // Extract authenticated user (any level allowed)
      const user = auth.user(req);
      if (!user) {
        throw err.unauthorized('Login required for thank you greeting');
      }

      const greetings = [
        `Thank You, User ${user.userId}!`,         // English
        `Gracias, Usuario ${user.userId}!`,        // Spanish
        `Merci, Utilisateur ${user.userId}!`       // French
      ];

      const response: HelloResponse = {
        success: true,
        data: {
          greetings,
          name: `User ${user.userId}`,
          language_count: 3,
          timestamp: new Date().toISOString(),
          requestId,
          feature: 'hello'
        }
      };
      
      // Log to database
      await GreetingLogModel.create({
        endpoint: '/thankyou',
        message: greetings.join(' | '),
        userName: `User ${user.userId}`,
        userId: user.userId,
        userRole: user.role,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      log.info('Thank you greeting completed', { requestId, userId: user.userId, role: user.role });
      res.json(response);
      
    } catch (error: any) {
      log.error('Thank you greeting failed', { requestId, error: error.message });
      throw err.serverError('Failed to generate thank you greeting');
    }
  }
}