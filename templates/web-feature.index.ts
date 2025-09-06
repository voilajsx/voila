/**
 * {{FEATURE_NAME_PASCAL}} Feature Contract - {{FEATURE_NAME}} functionality
 * @module {{APP_NAME}}/{{FEATURE_NAME}}
 * @file src/web/apps/{{APP_NAME}}/features/{{FEATURE_NAME}}/{{FEATURE_NAME}}.index.ts
 * 
 * @llm-rule WHEN: Building {{FEATURE_NAME}} features for {{APP_NAME}} application
 * @llm-rule AVOID: Hardcoded routes - use contract system for dynamic discovery
 * @llm-rule PATTERN: Use enhanced web-contracts builder with validation modes and test specs
 * @llm-rule NOTE: Maps to backend src/api/{{APP_NAME}}/features/{{FEATURE_NAME}}/ with bidirectional type sync
 */

import { createWebFeatureContract } from '../../../../../lib/web-contracts.js';

const {{FEATURE_NAME_PASCAL}}Contract = createWebFeatureContract()
  .app('{{APP_NAME}}')
  .feature('{{FEATURE_NAME}}')
  .description('{{FEATURE_NAME_PASCAL}} feature functionality for {{APP_NAME}} application')
  
  // Routes with authentication
  .route('/{{APP_NAME}}/{{FEATURE_NAME}}', 'root.tsx', { auth: 'public' })

  // Hooks provided
  .providesHook('use{{FEATURE_NAME_PASCAL}}')
  
  // Validation mode
  .validation('{{VALIDATION_LEVEL}}')
  
  // Test specifications
  .tests([
    'should return correct initial structure',
    'should handle loading states properly',
    'should handle error states appropriately',
    'should provide expected functionality'
  ])
  
  // SEO specifications
  .seo('/{{APP_NAME}}/{{FEATURE_NAME}}', {
    title: '{{FEATURE_NAME_PASCAL}} - {{APP_NAME}}',
    description: '{{FEATURE_NAME_PASCAL}} functionality for {{APP_NAME}} application',
    keywords: ['{{FEATURE_NAME}}', '{{APP_NAME}}', 'web', 'application'],
    ogTitle: '{{FEATURE_NAME_PASCAL}} - {{APP_NAME}}',
    ogDescription: 'Access {{FEATURE_NAME}} features in {{APP_NAME}}'
  })
  
  .build();

export default {{FEATURE_NAME_PASCAL}}Contract;