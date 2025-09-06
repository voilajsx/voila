/**
 * Main Home Feature - Landing page and application entry point
 */

import { createWebFeatureContract } from '../../../../../lib/web-contracts.js';

const MainHomeContract = createWebFeatureContract()
  .app('main')
  .feature('home')
  .description('Main landing page and application entry point')
  
  .route('/', 'root.tsx', { auth: 'public' })
  .route('/test', 'test.tsx', { auth: 'public' })
  
  .validation('basic')
  
  .build();

export default MainHomeContract;