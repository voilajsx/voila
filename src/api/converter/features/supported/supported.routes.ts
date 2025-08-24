/**
 * supported feature Express route definitions
 * @module converter/supported
 * @file src/api/converter/features/supported/supported.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for supported functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to SupportedService static methods for clean separation
 */

import express from 'express';
import { SupportedService } from './supported.services.js';

const router = express.Router();

// GET /api/converter/supported - Default greeting
router.get('/', SupportedService.getDefault);

// GET /api/converter/supported/:name - Personalized greeting
router.get('/:name', SupportedService.greetByName);

export default router;