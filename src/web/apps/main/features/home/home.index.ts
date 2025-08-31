/**
 * Main Home Feature - Landing page and application entry point
 */

import { createWebFeatureContract } from '../../../../../lib/web-contracts.js';

const MainHomeContract = createWebFeatureContract()
  .app('main')
  .feature('home')
  .description('Main landing page and application entry point')
  
  .providesComponent('HomePage')
  .providesComponent('LandingSection')
  .providesComponent('AppNavigation')
  
  .consumesComponent('Button')
  .consumesComponent('Card')
  .consumesComponent('Badge')
  .consumesComponent('Separator')
  
  .sharedState(false)
  
  .route('/', 'root.tsx', { auth: 'public' })
  .route('/test', 'test.tsx', { auth: 'public' })
  
  .build();

export default MainHomeContract;