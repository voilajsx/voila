/**
 * Hello API Routes - Express route definitions with authentication
 * @file src/api/greeting/features/hello/hello.routes.ts  
 * @group API Routes
 * 
 * @llm-rule WHEN: Need HTTP endpoints for greeting functionality
 * @llm-rule AVOID: Business logic in routes - delegate to service layer
 * @llm-rule PATTERN: Route -> Middleware -> Service -> Response
 * @llm-rule NOTE: All routes require authentication and include CORS headers
 */

import express from 'express';
import { authClass } from '@voilajsx/appkit/auth';
import { HelloService } from './hello.services.js';

const router = express.Router();
const auth = authClass.get();

// GET /api/greeting/hello - PUBLIC (no auth required)
router.get('/', HelloService.greetDefault);

// GET /api/greeting/hello/goodday - API KEY required
router.get('/goodday', auth.requireApiToken(), HelloService.greetGoodDay);

// GET /api/greeting/hello/thankyou - LOGIN required (any user level)
router.get('/thankyou', auth.requireLoginToken(), HelloService.greetThankYou);

// GET /api/greeting/hello/:name - LOGIN + ADMIN level required
router.get('/:name', 
  auth.requireLoginToken(), 
  auth.requireUserRoles(['admin.tenant']), 
  HelloService.greetByName
);

export default router;