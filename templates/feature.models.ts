/**
 * {{FEATURE_NAME}} feature database models and data persistence
 * @module {{APP_NAME}}/{{FEATURE_NAME}}
 * @file src/api/{{APP_NAME}}/features/{{FEATURE_NAME}}/{{FEATURE_NAME}}.models.ts
 * 
 * @llm-rule WHEN: {{FEATURE_NAME}} feature needs database interaction or data persistence
 * @llm-rule AVOID: Using this file for API types - use {{FEATURE_NAME}}.types.ts instead
 * @llm-rule NOTE: Optional file - only create if feature requires database operations
 */

import { databaseClass } from '@voilajsx/appkit/database';

/**
 * Database model for {{FEATURE_NAME}} feature data persistence
 * Implements VoilaJSX AppKit database patterns with tenant support
 * 
 * @llm-rule WHEN: Need to store {{FEATURE_NAME}} data in database
 * @llm-rule AVOID: Direct database queries - use AppKit database methods
 */
export class {{FEATURE_NAME_PASCAL}}Model {
  
  /**
   * Create a new {{FEATURE_NAME}} record in database
   * @llm-rule WHEN: Persisting {{FEATURE_NAME}} data to database
   * @llm-rule AVOID: Skipping tenant_id field - required for multi-tenancy
   */
  static async create(data: {
    name?: string;
    // Add other fields as needed for database storage
    userId?: string;
    tenant_id?: string;
  }) {
    const database = await databaseClass.get();
    
    return await database.{{FEATURE_NAME}}.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Find {{FEATURE_NAME}} records by criteria
   * @llm-rule WHEN: Querying {{FEATURE_NAME}} data from database
   * @llm-rule AVOID: Missing tenant filtering in multi-tenant apps
   */
  static async findMany(criteria: {
    userId?: string;
    tenant_id?: string;
    limit?: number;
  } = {}) {
    const database = await databaseClass.get();
    
    return await database.{{FEATURE_NAME}}.findMany({
      where: criteria,
      take: criteria.limit || 50,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Update {{FEATURE_NAME}} record
   * @llm-rule WHEN: Modifying existing {{FEATURE_NAME}} data
   * @llm-rule AVOID: Missing where clause - prevents accidental mass updates
   */
  static async update(id: string, data: {
    name?: string;
    // Add other updatable fields
  }) {
    const database = await databaseClass.get();
    
    return await database.{{FEATURE_NAME}}.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Delete {{FEATURE_NAME}} record
   * @llm-rule WHEN: Removing {{FEATURE_NAME}} data from database
   * @llm-rule AVOID: Hard deletes in production - consider soft delete flag
   */
  static async delete(id: string) {
    const database = await databaseClass.get();
    
    return await database.{{FEATURE_NAME}}.delete({
      where: { id }
    });
  }
}