/**
 * supported feature database models and data persistence
 * @module converter/supported
 * @file src/api/converter/features/supported/supported.models.ts
 * 
 * @llm-rule WHEN: supported feature needs database interaction or data persistence
 * @llm-rule AVOID: Using this file for API types - use supported.types.ts instead
 * @llm-rule NOTE: Optional file - only create if feature requires database operations
 */

import { databaseClass } from '@voilajsx/appkit/database';

/**
 * Database model for supported feature data persistence
 * Implements VoilaJSX AppKit database patterns with tenant support
 * 
 * @llm-rule WHEN: Need to store supported data in database
 * @llm-rule AVOID: Direct database queries - use AppKit database methods
 */
export class SupportedModel {
  
  /**
   * Create a new supported record in database
   * @llm-rule WHEN: Persisting supported data to database
   * @llm-rule AVOID: Skipping tenant_id field - required for multi-tenancy
   */
  static async create(data: {
    name?: string;
    // Add other fields as needed for database storage
    userId?: string;
    tenant_id?: string;
  }) {
    const database = await databaseClass.get();
    
    return await database.supported.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Find supported records by criteria
   * @llm-rule WHEN: Querying supported data from database
   * @llm-rule AVOID: Missing tenant filtering in multi-tenant apps
   */
  static async findMany(criteria: {
    userId?: string;
    tenant_id?: string;
    limit?: number;
  } = {}) {
    const database = await databaseClass.get();
    
    return await database.supported.findMany({
      where: criteria,
      take: criteria.limit || 50,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Update supported record
   * @llm-rule WHEN: Modifying existing supported data
   * @llm-rule AVOID: Missing where clause - prevents accidental mass updates
   */
  static async update(id: string, data: {
    name?: string;
    // Add other updatable fields
  }) {
    const database = await databaseClass.get();
    
    return await database.supported.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Delete supported record
   * @llm-rule WHEN: Removing supported data from database
   * @llm-rule AVOID: Hard deletes in production - consider soft delete flag
   */
  static async delete(id: string) {
    const database = await databaseClass.get();
    
    return await database.supported.delete({
      where: { id }
    });
  }
}