/**
 * time feature Express route definitions
 * @module converter/time
 * @file src/api/converter/features/time/time.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for time functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to TimeService static methods for clean separation
 */

import express from 'express';
import { TimeService } from './time.services.js';

const router = express.Router();

// GET /api/converter/time - Default greeting
router.get('/', TimeService.getDefault);

// GET /api/converter/time/:name - Personalized greeting
router.get('/:name', TimeService.greetByName);

export default router;