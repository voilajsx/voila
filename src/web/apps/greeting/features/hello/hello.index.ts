/**
 * Hello Web Contract - Feature contract for greeting UI with routing and SEO
 * @file src/web/apps/greeting/features/hello/hello.index.ts  
 * @group Web Contract
 * 
 * @llm-rule WHEN: Building greeting features with authentication and personalization
 * @llm-rule AVOID: Hardcoded routes - use contract system for dynamic discovery
 * @llm-rule PATTERN: Use enhanced web-contracts builder with validation modes and test specs
 * @llm-rule NOTE: Maps to backend src/api/greeting/features/hello/ with bidirectional type sync
 */

import { createWebFeatureContract } from '../../../../../lib/web-contracts.js';

const HelloContract = createWebFeatureContract()
  .app('greeting')
  .feature('hello')
  .description('Interactive greeting UI with multi-language support and backend integration')
  
  // Routes with authentication
  .route('/greeting/hello', 'root.tsx', { auth: 'public' })
  .route('/greeting/hello/:name', '[name].tsx', { auth: 'public' })
  .route('/greeting/hello/:name/:new', '[name]-[new].tsx', { auth: 'public' })

  // Hooks provided
  .providesHook('useHello')
  
  // Validation mode
  .validation('essential')
  
  // Test specifications
  .tests([
    // Core Hook Tests - ACTIVE SET
    'should return correct initial structure with hardcoded tokens',
    'should only make personalized greeting API call in [name].tsx page',
    'should not make default/goodday/thankyou API calls in [name].tsx page',
    
    // Route Parameter Tests - ACTIVE SET 2
    'should extract single name parameter from /greeting/hello/:name',
    'should extract multiple parameters from /greeting/hello/:name/:new URLs',
    'should handle dynamic URLs with 4+ parameters (ram/sample/new/old)',
    
    // Form Validation Tests - ACTIVE SET 3
    'should validate day input allows only Monday-Sunday',
    'should reject numeric input in day selection form',
    'should display day-specific messages when valid day selected',
    
    // API Authentication Tests - ACTIVE SET 4
    'should use ADMIN_LOGIN_TOKEN for personalized greeting API calls',
    'should handle 401 authentication errors gracefully',
    'should limit API retry attempts to maximum 3',
    
    // UI Component Tests - ACTIVE SET 5
    'should not display multilanguage greeting messages with admin info',
    'should render clean greeting display without backend response details',
    'should handle route navigation between [name] and [name]-[new] pages'
  ])
  
  // SEO specifications
  .seo('/greeting/hello', {
    title: 'Hello Greeting - Multi-language Greetings',
    description: 'Interactive greeting interface with multi-language support and personalization',
    keywords: ['greeting', 'hello', 'multilanguage', 'personalized'],
    ogTitle: 'Hello Greeting Service',
    ogDescription: 'Get personalized greetings in multiple languages'
  })
  .seo('/greeting/hello/:name', {
    title: 'Personal Greeting for {name}',
    description: 'Personalized greeting for {name} with multi-language support',
    keywords: ['personal greeting', 'hello', 'name', '{name}'],
    ogTitle: 'Personal Greeting for {name}',
    ogDescription: 'Get a personalized greeting for {name}'
  })
  .seo('/greeting/hello/:name/:new', {
    title: 'New Greeting for {name} - {new}',
    description: 'Advanced personalized greeting for {name} with {new} parameter',
    keywords: ['personal greeting', 'hello', 'name', '{name}', '{new}'],
    ogTitle: 'New Greeting for {name} - {new}',
    ogDescription: 'Get an advanced personalized greeting for {name} with {new}'
  })
  
  .build();

export default HelloContract;