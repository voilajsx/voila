/**
 * status feature Express route definitions
 * @module welcome/status
 * @file src/api/welcome/features/status/status.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for status functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to StatusService static methods for clean separation
 */

import express from 'express';
import { StatusService } from './status.services.js';

const router = express.Router();

// GET /api/welcome/status - Default greeting
router.get('/', StatusService.getDefault);

// GET /api/welcome/status/:name - Personalized greeting
router.get('/:name', StatusService.greetByName);

export default router;