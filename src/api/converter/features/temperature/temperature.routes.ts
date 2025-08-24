/**
 * temperature feature Express route definitions
 * @module converter/temperature
 * @file src/api/converter/features/temperature/temperature.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for temperature functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to TemperatureService static methods for clean separation
 */

import express from 'express';
import { TemperatureService } from './temperature.services.js';

const router = express.Router();

// GET /api/converter/temperature - Default greeting
router.get('/', TemperatureService.getDefault);

// GET /api/converter/temperature/:name - Personalized greeting
router.get('/:name', TemperatureService.greetByName);

export default router;