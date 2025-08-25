/**
 * hello feature Express route definitions
 * @module welcome/hello
 * @file src/api/welcome/features/hello/hello.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for hello functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Simple GET endpoint that calls HelloService for hello world
 */

import express from 'express';
import { HelloService } from './hello.services.js';

const router = express.Router();

// GET /api/welcome/hello - Hello world greeting
router.get('/', async (req, res, next) => {
  try {
    const result = await HelloService.getHelloWorld();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;