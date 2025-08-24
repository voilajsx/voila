/**
 * Weather feature business logic and service layer
 * @module climate/weather
 * @file src/api/climate/features/weather/weather.services.ts
 * 
 * @llm-rule WHEN: Need weather data from external APIs with caching and fallback
 * @llm-rule AVOID: Direct external API calls without error handling and caching
 * @llm-rule NOTE: Implements OpenWeatherMap primary, WeatherAPI.com fallback with 5min cache
 */

import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { cacheClass } from '@voilajsx/appkit/cache';
import { configClass } from '@voilajsx/appkit/config';
// @ts-ignore - node-fetch types not available
import fetch from 'node-fetch';

import { 
  WeatherRequestSchema, 
  WeatherResponse, 
  WeatherData, 
  WeatherErrorResponse,
  WeatherRequest,
  OpenWeatherMapResponse,
  WeatherServiceConfig
} from './weather.types.js';

const utils = utilClass.get();
const log = loggerClass.get('weather.service');
const err = errorClass.get();
const secure = securityClass.get();
const cache = cacheClass.get();
const config = configClass.get();

export class WeatherService {
  
  private static getConfig(): WeatherServiceConfig {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY || config.get('openweathermap.api.key') || 'demo-key';
    
    // Configuration loaded successfully from environment
    
    return {
      openweathermap: {
        apiKey,
        baseUrl: 'https://api.openweathermap.org/data/2.5'
      },
      cache: {
        ttl: 300 // 5 minutes
      }
    };
  }

  private static generateCacheKey(request: WeatherRequest): string {
    const parts = [
      'weather',
      request.city ? 'city' : 'coordinates',
      request.city || `${request.lat}-${request.lon}`,
      request.units
    ];
    
    return parts.join('_');
  }

  private static convertTemperature(temp: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return temp;
    
    // Convert to Celsius first
    let celsius = temp;
    if (fromUnit === 'fahrenheit') {
      celsius = (temp - 32) * 5/9;
    } else if (fromUnit === 'kelvin') {
      celsius = temp - 273.15;
    }
    
    // Convert from Celsius to target
    if (toUnit === 'fahrenheit') {
      return celsius * 9/5 + 32;
    } else if (toUnit === 'kelvin') {
      return celsius + 273.15;
    }
    
    return celsius;
  }

  private static async fetchFromOpenWeatherMap(request: WeatherRequest, requestId: string): Promise<WeatherData> {
    const serviceConfig = WeatherService.getConfig();
    let url = `${serviceConfig.openweathermap.baseUrl}/weather?appid=${serviceConfig.openweathermap.apiKey}&units=metric`;
    
    if (request.city) {
      url += `&q=${encodeURIComponent(request.city)}`;
    } else {
      url += `&lat=${request.lat}&lon=${request.lon}`;
    }

    log.info('Fetching from OpenWeatherMap', { requestId, url: url.replace(/appid=[^&]+/, 'appid=***'), apiKey: serviceConfig.openweathermap.apiKey.substring(0, 6) + '...' });

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Voila-Climate-App/1.0' }
    });

    log.info('OpenWeatherMap response', { requestId, status: response.status, statusText: response.statusText });

    if (!response.ok) {
      if (response.status === 404) {
        throw err.notFound('Location not found');
      }
      if (response.status === 401) {
        log.error('OpenWeatherMap API authentication failed', { requestId, status: response.status });
        throw err.serverError('Weather service configuration error');
      }
      const errorText = await response.text();
      log.error('OpenWeatherMap API error', { requestId, status: response.status, error: errorText });
      throw err.serverError('Weather service temporarily unavailable');
    }

    const data = await response.json() as OpenWeatherMapResponse;
    
    const temperature = WeatherService.convertTemperature(data.main.temp, 'celsius', request.units);

    return {
      temperature,
      humidity: data.main.humidity,
      condition: data.weather[0].description,
      city: data.name,
      country: data.sys.country,
      timestamp: new Date().toISOString(),
      units: request.units
    };
  }


  /**
   * Get current weather conditions by city name or coordinates
   * @llm-rule WHEN: Client requests current weather data via GET /api/climate/weather/current
   * @llm-rule AVOID: Missing input validation - always validate with WeatherRequestSchema
   * @llm-rule NOTE: Uses caching with OpenWeatherMap API for reliable weather data
   */
  static async getCurrentWeather(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      // Validate request parameters
      const validatedRequest = WeatherRequestSchema.parse({
        city: req.query.city ? secure.input(req.query.city as string) : undefined,
        lat: req.query.lat ? parseFloat(req.query.lat as string) : undefined,
        lon: req.query.lon ? parseFloat(req.query.lon as string) : undefined,
        units: secure.input(req.query.units as string) || 'celsius'
      });

      // Check cache first
      const cacheKey = WeatherService.generateCacheKey(validatedRequest);
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        log.info('Weather data served from cache', { requestId, cacheKey });
        const response: WeatherResponse = {
          success: true,
          data: JSON.parse(cachedData),
          requestId,
          cached: true
        };
        res.json(response);
        return;
      }

      // Fetch weather data from OpenWeatherMap API
      const weatherData = await WeatherService.fetchFromOpenWeatherMap(validatedRequest, requestId);

      // Cache the response
      const serviceConfig = WeatherService.getConfig();
      await cache.set(cacheKey, JSON.stringify(weatherData), serviceConfig.cache.ttl);

      const response: WeatherResponse = {
        success: true,
        data: weatherData,
        requestId,
        cached: false,
        source: 'openweathermap'
      };
      
      log.info('Weather data fetched successfully', { 
        requestId, 
        source: 'openweathermap', 
        city: weatherData.city, 
        temperature: weatherData.temperature 
      });
      
      res.json(response);
      
    } catch (error: any) {
      log.error('Weather service error', { requestId, error: error.message });
      
      let errorResponse: WeatherErrorResponse;
      
      if (error.name === 'ZodError') {
        errorResponse = {
          success: false,
          error: {
            type: 'validation_error',
            message: 'Invalid request parameters',
            code: 'INVALID_INPUT',
            requestId
          }
        };
        res.status(400).json(errorResponse);
      } else if (error.statusCode === 404) {
        errorResponse = {
          success: false,
          error: {
            type: 'not_found',
            message: error.message,
            code: 'LOCATION_NOT_FOUND',
            requestId
          }
        };
        res.status(404).json(errorResponse);
      } else {
        errorResponse = {
          success: false,
          error: {
            type: 'server_error',
            message: 'Internal server error',
            code: 'WEATHER_SERVICE_ERROR',
            requestId
          }
        };
        res.status(500).json(errorResponse);
      }
    }
  }
}