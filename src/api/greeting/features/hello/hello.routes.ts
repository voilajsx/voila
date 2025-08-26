/**
 * Hello feature Express route definitions with authentication
 * @module greeting/hello
 * @file src/api/greeting/features/hello/hello.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for hello greeting functionality with auth
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to HelloService static methods with appropriate auth middleware
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