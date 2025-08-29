/**
 * Home Frontend Feature Contract - Default Route
 * @file src/web/main/features/home/home.index.ts
 * 
 * Main landing page contract that serves as the default route (/)
 */

import { createWebFeatureContract } from '../../../../lib/web-contracts.js';
import type { VoilaWebFeatureContract } from '../../../../lib/web-contracts.js';

const HomeWebContract: VoilaWebFeatureContract = createWebFeatureContract({
  name: 'home',
  app: 'main',
  description: 'Main landing page and application entry point',
  validation: 'essential',
  
  // Component system
  components: {
    provides: ['HomePage', 'LandingSection', 'AppNavigation'],
    consumes: ['Button', 'Card', 'Badge', 'Separator']
  },
  
  // Routes this feature handles (Default route)
  routes: {
    handles: [
      { 
        path: '/', 
        component: 'HomePage', 
        exact: true,
        ssg: {
          enabled: true,
          revalidate: 3600
        },
        dataFetching: 'static'
      }
    ]
  },
  
  // No API integration needed for main landing page
  api: {
    service: 'main',
    endpoints: [],
    cache: {
      enabled: false,
      duration: 0,
      strategy: 'none'
    },
    retries: 0,
    timeout: 0
  },
  
  // SSG Configuration for landing page
  ssg: {
    enabled: true,
    revalidate: 3600, // 1 hour ISR
    prerender: ['/'],
    fallback: false
  },
  
  // State management
  state: {
    manages: ['navigationState'],
    subscribes: ['appTheme']
  },
  
  // Dependencies
  dependencies: {
    files: {
      'HomePage.tsx': './HomePage.tsx',
      'home.types.ts': './home.types.ts'
    },
    services: [],
    external: ['react-router-dom']
  },
  
  // Testing requirements
  tests: [
    { type: 'component', description: 'HomePage renders correctly', coverage: 95 },
    { type: 'integration', description: 'Navigation links work correctly', coverage: 90 },
    { type: 'e2e', description: 'Landing page loads and is interactive', coverage: 85 }
  ]
});

export default HomeWebContract;