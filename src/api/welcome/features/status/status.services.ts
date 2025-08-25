/**
 * Status feature business logic and service layer - Health Check Service
 * @module welcome/status
 * @file src/api/welcome/features/status/status.services.ts
 * 
 * @llm-rule WHEN: Need health check and status monitoring for application
 * @llm-rule AVOID: Including sensitive system information in status responses
 * @llm-rule NOTE: All methods should be static for easy testing and imports
 */

import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { StatusResponse } from './status.types.js';

const utils = utilClass.get();
const log = loggerClass.get('status.service');
const err = errorClass.get();

// Track application start time for uptime calculation
const APPLICATION_START_TIME = Date.now();

export class StatusService {
  /**
   * Get application health status and uptime
   * @llm-rule WHEN: Health check endpoint called - return status and uptime
   * @llm-rule AVOID: Exposing detailed system information or sensitive data
   * @llm-rule NOTE: Should return { status: "healthy", uptime: number } format
   */
  static async getHealthStatus(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      // Calculate uptime in seconds since application started
      const uptimeMs = Date.now() - APPLICATION_START_TIME;
      const uptimeSeconds = Math.floor(uptimeMs / 1000);

      const response: StatusResponse = {
        status: 'healthy',
        uptime: uptimeSeconds
      };
      
      log.info('Health status check completed', { 
        requestId, 
        status: response.status, 
        uptime: response.uptime 
      });
      
      res.json(response);
      
    } catch (error: any) {
      log.error('Health status check failed', { requestId, error: error.message });
      throw err.serverError('Failed to get application status');
    }
  }
}