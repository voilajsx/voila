/**
 * hello feature Express route definitions
 * @module demo/hello
 * @file src/api/demo/features/hello/hello.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for hello functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to HelloService static methods for clean separation
 */

import express from 'express';
import { HelloService } from './hello.services.js';

const router = express.Router();

// GET /api/demo/hello - Default greeting
router.get('/', HelloService.getHello);

export default router;
