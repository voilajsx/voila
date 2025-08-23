/**
 * weather feature database models and data persistence
 * @module climate/weather
 * @file src/api/climate/features/weather/weather.models.ts
 * 
 * @llm-rule WHEN: weather feature needs database interaction or data persistence
 * @llm-rule AVOID: Using this file for API types - use weather.types.ts instead
 * @llm-rule NOTE: Optional file - only create if feature requires database operations
 */

import { databaseClass } from '@voilajsx/appkit/database';

/**
 * Database model for weather feature data persistence
 * Implements VoilaJSX AppKit database patterns with tenant support
 * 
 * @llm-rule WHEN: Need to store weather data in database
 * @llm-rule AVOID: Direct database queries - use AppKit database methods
 */
export class WeatherModel {
  
  /**
   * Create a new weather record in database
   * @llm-rule WHEN: Persisting weather data to database
   * @llm-rule AVOID: Skipping tenant_id field - required for multi-tenancy
   */
  static async create(data: {
    name?: string;
    // Add other fields as needed for database storage
    userId?: string;
    tenant_id?: string;
  }) {
    const database = await databaseClass.get();
    
    return await database.weather.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Find weather records by criteria
   * @llm-rule WHEN: Querying weather data from database
   * @llm-rule AVOID: Missing tenant filtering in multi-tenant apps
   */
  static async findMany(criteria: {
    userId?: string;
    tenant_id?: string;
    limit?: number;
  } = {}) {
    const database = await databaseClass.get();
    
    return await database.weather.findMany({
      where: criteria,
      take: criteria.limit || 50,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Update weather record
   * @llm-rule WHEN: Modifying existing weather data
   * @llm-rule AVOID: Missing where clause - prevents accidental mass updates
   */
  static async update(id: string, data: {
    name?: string;
    // Add other updatable fields
  }) {
    const database = await databaseClass.get();
    
    return await database.weather.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Delete weather record
   * @llm-rule WHEN: Removing weather data from database
   * @llm-rule AVOID: Hard deletes in production - consider soft delete flag
   */
  static async delete(id: string) {
    const database = await databaseClass.get();
    
    return await database.weather.delete({
      where: { id }
    });
  }
}