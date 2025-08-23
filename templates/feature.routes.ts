/**
 * {{FEATURE_NAME}} feature Express route definitions
 * @module {{APP_NAME}}/{{FEATURE_NAME}}
 * @file src/api/{{APP_NAME}}/features/{{FEATURE_NAME}}/{{FEATURE_NAME}}.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for {{FEATURE_NAME}} functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to services
 * @llm-rule NOTE: Routes map to {{FEATURE_NAME_PASCAL}}Service static methods for clean separation
 */

import express from 'express';
import { {{FEATURE_NAME_PASCAL}}Service } from './{{FEATURE_NAME}}.services.js';

const router = express.Router();

// GET /api/{{APP_NAME}}/{{FEATURE_NAME}} - Default greeting
router.get('/', {{FEATURE_NAME_PASCAL}}Service.getDefault);

// GET /api/{{APP_NAME}}/{{FEATURE_NAME}}/:name - Personalized greeting
router.get('/:name', {{FEATURE_NAME_PASCAL}}Service.greetByName);

export default router;