/**
 * greet feature Express route definitions
 * @module welcome/greet
 * @file src/api/welcome/features/greet/greet.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for greet functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to GreetService static methods for clean separation
 */

import express from 'express';
import { GreetService } from './greet.services.js';

const router = express.Router();

// GET /api/welcome/greet - Default greeting
router.get('/', GreetService.getDefault);

// GET /api/welcome/greet/:name - Personalized greeting
router.get('/:name', GreetService.greetByName);

export default router;