/**
 * Weather feature Express route definitions
 * @module climate/weather
 * @file src/api/climate/features/weather/weather.routes.ts
 * 
 * @llm-rule WHEN: Need HTTP endpoints for weather API functionality
 * @llm-rule AVOID: Adding business logic here - keep routes thin, delegate to WeatherService
 * @llm-rule NOTE: Routes map to WeatherService static methods with proper error handling
 */

import express from 'express';
import { WeatherService } from './weather.services.js';

const router = express.Router();

// GET /api/climate/weather/current - Get current weather by city or coordinates
router.get('/current', WeatherService.getCurrentWeather);

export default router;