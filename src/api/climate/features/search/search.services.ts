/**
 * Search feature business logic and service layer
 * @module climate/search
 * @file src/api/climate/features/search/search.services.ts
 * 
 * @llm-rule WHEN: Need location search via OpenWeatherMap geocoding with caching
 * @llm-rule AVOID: Direct external API calls without error handling and caching
 * @llm-rule NOTE: Uses OpenWeatherMap Geocoding API with 1-hour cache for location searches
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
  LocationSearchRequestSchema, 
  LocationSearchResponse, 
  LocationResult, 
  LocationSearchErrorResponse,
  LocationSearchRequest,
  OpenWeatherMapGeocodingResponse,
  SearchServiceConfig
} from './search.types.js';

const utils = utilClass.get();
const log = loggerClass.get('search.service');
const err = errorClass.get();
const secure = securityClass.get();
const cache = cacheClass.get();
const config = configClass.get();

export class SearchService {
  
  private static getConfig(): SearchServiceConfig {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY || config.get('openweathermap.api.key') || 'demo-key';
    
    return {
      openweathermap: {
        apiKey,
        geocodingUrl: 'https://api.openweathermap.org/geo/1.0'
      },
      cache: {
        ttl: 3600 // 1 hour
      }
    };
  }

  private static generateCacheKey(request: LocationSearchRequest): string {
    const parts = [
      'location_search',
      request.query.toLowerCase().trim(),
      request.limit.toString()
    ];
    
    return parts.join('_');
  }

  private static async fetchFromOpenWeatherMapGeocoding(request: LocationSearchRequest, requestId: string): Promise<LocationResult[]> {
    const serviceConfig = SearchService.getConfig();
    const url = `${serviceConfig.openweathermap.geocodingUrl}/direct?q=${encodeURIComponent(request.query)}&limit=${request.limit}&appid=${serviceConfig.openweathermap.apiKey}`;

    log.info('Fetching from OpenWeatherMap Geocoding', { 
      requestId, 
      url: url.replace(/appid=[^&]+/, 'appid=***'),
      query: request.query,
      limit: request.limit
    });

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Voila-Climate-App/1.0' }
    });

    log.info('OpenWeatherMap Geocoding response', { requestId, status: response.status, statusText: response.statusText });

    if (!response.ok) {
      if (response.status === 401) {
        log.error('OpenWeatherMap Geocoding API authentication failed', { requestId, status: response.status });
        throw err.serverError('Location search service configuration error');
      }
      const errorText = await response.text();
      log.error('OpenWeatherMap Geocoding API error', { requestId, status: response.status, error: errorText });
      throw err.serverError('Location search service temporarily unavailable');
    }

    const data = await response.json() as OpenWeatherMapGeocodingResponse[];
    
    // Transform to our format
    return data.map(location => ({
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon
    }));
  }

  /**
   * Search for locations by name with coordinates and country information
   * @llm-rule WHEN: Client requests location search via GET /api/climate/weather/search
   * @llm-rule AVOID: Missing input validation - always validate with LocationSearchRequestSchema
   * @llm-rule NOTE: Uses caching with OpenWeatherMap Geocoding API for reliable location data
   */
  static async searchLocations(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      // Validate request parameters
      const validatedRequest = LocationSearchRequestSchema.parse({
        query: req.query.query ? secure.input(req.query.query as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 5
      });

      // Check cache first
      const cacheKey = SearchService.generateCacheKey(validatedRequest);
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        log.info('Location search data served from cache', { requestId, cacheKey, query: validatedRequest.query });
        const cachedResults = JSON.parse(cachedData) as LocationResult[];
        const response: LocationSearchResponse = {
          success: true,
          data: cachedResults,
          requestId,
          cached: true,
          count: cachedResults.length
        };
        res.json(response);
        return;
      }

      // Fetch location data from OpenWeatherMap Geocoding API
      const locationResults = await SearchService.fetchFromOpenWeatherMapGeocoding(validatedRequest, requestId);

      // Cache the response
      const serviceConfig = SearchService.getConfig();
      await cache.set(cacheKey, JSON.stringify(locationResults), serviceConfig.cache.ttl);

      const response: LocationSearchResponse = {
        success: true,
        data: locationResults,
        requestId,
        cached: false,
        count: locationResults.length
      };
      
      log.info('Location search data fetched successfully', { 
        requestId, 
        source: 'openweathermap', 
        query: validatedRequest.query,
        count: locationResults.length
      });
      
      res.json(response);
      
    } catch (error: any) {
      log.error('Search service error', { requestId, error: error.message });
      
      let errorResponse: LocationSearchErrorResponse;
      
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
            message: 'No locations found for the given query',
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
            code: 'SEARCH_SERVICE_ERROR',
            requestId
          }
        };
        res.status(500).json(errorResponse);
      }
    }
  }
}