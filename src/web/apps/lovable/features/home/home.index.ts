/**
 * Lovable Home Feature - FirstConsults consulting website
 */

import { createWebFeatureContract } from '../../../../../lib/web-contracts.js';

const LovableHomeContract = createWebFeatureContract()
  .app('lovable')
  .feature('home')
  .description('FirstConsults consulting website with hero, about, services, and gallery')
  
  .providesComponent('HomePage')
  .providesComponent('AboutPage')
  .providesComponent('ServicesPage') 
  .providesComponent('GalleryPage')
  
  .consumesComponent('Navigation')
  .consumesComponent('Button')
  .consumesComponent('Card')
  .consumesAPI('lovable/contact')
  
  .sharedState(false)
  
  .route('/lovable', 'root.tsx', { layout: 'Navigation', auth: 'public' })
  .route('/lovable/about', 'about.tsx', { layout: 'Navigation', auth: 'public' })
  .route('/lovable/services', 'services.tsx', { layout: 'Navigation', auth: 'public' })
  .route('/lovable/gallery', 'gallery.tsx', { layout: 'Navigation', auth: 'public' })
  
  .build();

export default LovableHomeContract;