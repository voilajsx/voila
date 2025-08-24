/**
 * Search feature Express route definitions
 * @module climate/search
 * @file src/api/climate/features/search/search.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for location search functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to SearchService
 * @llm-rule NOTE: Routes map to SearchService static methods with proper error handling
 */

import express from 'express';
import { SearchService } from './search.services.js';

const router = express.Router();

// Routes loaded successfully

// GET /api/climate/weather/search - Search for locations by name
router.get('/', SearchService.searchLocations);

export default router;