/**
 * Feature: Hello World Routes
 * Purpose: Express routes for Hello World endpoint  
 * Dependencies: Express, HelloService
 * Exports: Router for /api/helloworld/hello endpoint
 * 
 * @llm-rule WHEN: Need HTTP endpoints for hello functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to HelloService static methods for clean separation
 */

import express from 'express';
import { HelloService } from './hello.services.js';

const router = express.Router();

// GET /api/helloworld/hello - Simple Hello World message
router.get('/hello', async (req, res, next) => {
  try {
    const result = await HelloService.getHello();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export { router as helloRoutes };