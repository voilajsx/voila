/**
 * Lovable Home Feature - FirstConsults consulting website
 */

import { createWebFeatureContract } from '../../../../../lib/web-contracts.js';

const LovableHomeContract = createWebFeatureContract()
  .app('lovable')
  .feature('home')
  .description('FirstConsults consulting website with hero, about, services, and gallery')
  
  .route('/lovable', 'root.tsx', { layout: 'Navigation', auth: 'public' })
  .route('/lovable/about', 'about.tsx', { layout: 'Navigation', auth: 'public' })
  .route('/lovable/services', 'services.tsx', { layout: 'Navigation', auth: 'public' })
  .route('/lovable/gallery', 'gallery.tsx', { layout: 'Navigation', auth: 'public' })
  
  .validation('basic')
  
  .build();

export default LovableHomeContract;