/**
 * hello feature database models and data persistence
 * @module helloworld/hello
 * @file src/api/helloworld/features/hello/hello.models.ts
 * 
 * @llm-rule WHEN: hello feature needs database interaction or data persistence
 * @llm-rule AVOID: Using this file for API types - use hello.types.ts instead
 * @llm-rule NOTE: Optional file - only create if feature requires database operations
 */

import { databaseClass } from '@voilajsx/appkit/database';

/**
 * Database model for hello feature data persistence
 * Implements VoilaJSX AppKit database patterns with tenant support
 * 
 * @llm-rule WHEN: Need to store hello data in database
 * @llm-rule AVOID: Direct database queries - use AppKit database methods
 */
export class HelloModel {
  
  /**
   * Create a new hello record in database
   * @llm-rule WHEN: Persisting hello data to database
   * @llm-rule AVOID: Skipping tenant_id field - required for multi-tenancy
   */
  static async create(data: {
    name?: string;
    // Add other fields as needed for database storage
    userId?: string;
    tenant_id?: string;
  }) {
    const database = await databaseClass.get();
    
    return await database.hello.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Find hello records by criteria
   * @llm-rule WHEN: Querying hello data from database
   * @llm-rule AVOID: Missing tenant filtering in multi-tenant apps
   */
  static async findMany(criteria: {
    userId?: string;
    tenant_id?: string;
    limit?: number;
  } = {}) {
    const database = await databaseClass.get();
    
    return await database.hello.findMany({
      where: criteria,
      take: criteria.limit || 50,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Update hello record
   * @llm-rule WHEN: Modifying existing hello data
   * @llm-rule AVOID: Missing where clause - prevents accidental mass updates
   */
  static async update(id: string, data: {
    name?: string;
    // Add other updatable fields
  }) {
    const database = await databaseClass.get();
    
    return await database.hello.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
  }

  /**
   * Delete hello record
   * @llm-rule WHEN: Removing hello data from database
   * @llm-rule AVOID: Hard deletes in production - consider soft delete flag
   */
  static async delete(id: string) {
    const database = await databaseClass.get();
    
    return await database.hello.delete({
      where: { id }
    });
  }
}