/**
 * temperature feature database models and data persistence
 * @module converter/temperature
 * @file src/api/converter/features/temperature/temperature.models.ts
 * 
 * @llm-rule WHEN: temperature feature needs database interaction or data persistence
 * @llm-rule AVOID: Using this file for API types - use temperature.types.ts instead
 * @llm-rule NOTE: Optional file - only create if feature requires database operations
 */

import { databaseClass } from '@voilajsx/appkit/database';

/**
 * Database model for temperature feature data persistence
 * Implements VoilaJSX AppKit database patterns with tenant support
 * 
 * @llm-rule WHEN: Need to store temperature data in database
 * @llm-rule AVOID: Direct database queries - use AppKit database methods
 */
export class TemperatureModel {
  
  /**
   * Create a new temperature record in database
   * @llm-rule WHEN: Persisting temperature data to database
   * @llm-rule AVOID: Skipping tenant_id field - required for multi-tenancy
   */
  static async create(data: {
    name?: string;
    // Add other fields as needed for database storage
    userId?: string;
    tenant_id?: string;
  }) {
    const database = await databaseClass.get();
    
    return await database.temperature.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Find temperature records by criteria
   * @llm-rule WHEN: Querying temperature data from database
   * @llm-rule AVOID: Missing tenant filtering in multi-tenant apps
   */
  static async findMany(criteria: {
    userId?: string;
    tenant_id?: string;
    limit?: number;
  } = {}) {
    const database = await databaseClass.get();
    
    return await database.temperature.findMany({
      where: criteria,
      take: criteria.limit || 50,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Update temperature record
   * @llm-rule WHEN: Modifying existing temperature data
   * @llm-rule AVOID: Missing where clause - prevents accidental mass updates
   */
  static async update(id: string, data: {
    name?: string;
    // Add other updatable fields
  }) {
    const database = await databaseClass.get();
    
    return await database.temperature.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Delete temperature record
   * @llm-rule WHEN: Removing temperature data from database
   * @llm-rule AVOID: Hard deletes in production - consider soft delete flag
   */
  static async delete(id: string) {
    const database = await databaseClass.get();
    
    return await database.temperature.delete({
      where: { id }
    });
  }
}