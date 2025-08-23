import { Request, Response } from 'express';
// Import VoilaJSX AppKit modules for enterprise features
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { EchoSchema, type EchoResponse } from './echo.models.js';

const utils = utilClass.get();
const log = loggerClass.get('echo.service');
const err = errorClass.get();
const secure = securityClass.get();

export class EchoService {
  static async echoMessage(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const sanitizedInput = secure.input(req.body);
      
      // Validate input
      const validation = EchoSchema.safeParse(sanitizedInput);
      if (!validation.success) {
        throw err.badRequest('Invalid message format');
      }

      const { message } = validation.data;

      if (message.length > 500) {
        throw err.badRequest('Message must be 500 characters or less');
      }

      const response: EchoResponse = {
        success: true,
        data: {
          original_message: message,
          echoed_message: message,
          message_length: message.length,
          timestamp: new Date().toISOString(),
          requestId,
          feature: 'echo',
          method: 'POST'
        }
      };
      
      log.info('Echo message completed', { requestId, messageLength: message.length });
      res.json(response);
      
    } catch (error: any) {
      log.error('Echo message failed', { requestId, error: error.message });
      throw error;
    }
  }

  static async echoMessageGet(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const message = secure.input(req.params.message);
      
      if (!message || message.length === 0) {
        throw err.badRequest('Message parameter is required');
      }
      
      if (message.length > 200) {
        throw err.badRequest('Message must be 200 characters or less for GET requests');
      }

      const response: EchoResponse = {
        success: true,
        data: {
          original_message: message,
          echoed_message: message,
          message_length: message.length,
          timestamp: new Date().toISOString(),
          requestId,
          feature: 'echo',
          method: 'GET'
        }
      };
      
      log.info('Echo message (GET) completed', { requestId, messageLength: message.length });
      res.json(response);
      
    } catch (error: any) {
      log.error('Echo message (GET) failed', { requestId, error: error.message });
      throw error;
    }
  }
}