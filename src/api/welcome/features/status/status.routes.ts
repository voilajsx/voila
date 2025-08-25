/**
 * Status feature Express route definitions - Health Check Routes
 * @module welcome/status
 * @file src/api/welcome/features/status/status.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for application health monitoring
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to StatusService static methods for clean separation
 */

import express from 'express';
import { StatusService } from './status.services.js';

const router = express.Router();

// GET /api/welcome/status - Application health and status monitoring
router.get('/status', StatusService.getHealthStatus);

export default router;