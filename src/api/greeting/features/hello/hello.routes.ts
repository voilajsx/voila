/**
 * Hello feature Express route definitions
 * @module greeting/hello
 * @file src/api/greeting/features/hello/hello.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for hello greeting functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to HelloService static methods for clean separation
 */

import express from 'express';
import { HelloService } from './hello.services.js';

const router = express.Router();

// GET /api/greeting/hello
router.get('/', HelloService.greetDefault);

// GET /api/greeting/hello/goodday
router.get('/goodday', HelloService.greetGoodDay);

// GET /api/greeting/hello/:name
router.get('/:name', HelloService.greetByName);

export default router;