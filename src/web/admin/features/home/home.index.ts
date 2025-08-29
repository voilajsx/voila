/**
 * Admin Home Frontend Feature Contract
 * @file src/web/admin/features/home/home.index.ts
 * 
 * Frontend contract for admin dashboard home feature
 */

import { createWebFeatureContract } from '../../../../lib/web-contracts.js';
import type { VoilaWebFeatureContract } from '../../../../lib/web-contracts.js';

const AdminHomeWebContract: VoilaWebFeatureContract = createWebFeatureContract({
  name: 'home',
  app: 'admin',
  description: 'Admin dashboard home page with user management capabilities',
  validation: 'basic',
  
  // Component system
  components: {
    provides: ['AdminHomePage', 'UsersEditPage', 'AdminDashboard'],
    consumes: ['Button', 'Card', 'Table', 'Modal', 'Input']
  },
  
  // Routes this feature handles
  routes: {
    handles: [
      { 
        path: '/admin', 
        component: 'AdminHomePage', 
        exact: true,
        ssg: {
          enabled: false
        },
        dataFetching: 'client'
      },
      {
        path: '/admin/users/edit',
        component: 'UsersEditPage', 
        exact: true,
        ssg: {
          enabled: false
        },
        dataFetching: 'client'
      }
    ],
    redirects: [
      { from: '/admin/dashboard', to: '/admin' },
      { from: '/dashboard', to: '/admin' }
    ]
  },
  
  // API integration (if admin features need backend)
  api: {
    service: 'admin',
    endpoints: [
      '/users',
      '/users/:id',
      '/dashboard/stats'
    ],
    cache: {
      enabled: true,
      duration: 300000, // 5 minutes
      strategy: 'memory'
    },
    retries: 2,
    timeout: 10000
  },
  
  // SSG Configuration
  ssg: {
    enabled: false, // Admin pages shouldn't be pre-rendered
    revalidate: 0,
    prerender: [],
    fallback: false
  },
  
  // State management
  state: {
    manages: ['adminState', 'usersData', 'dashboardStats'],
    subscribes: ['appTheme', 'userAuth']
  },
  
  // Dependencies
  dependencies: {
    files: {
      'AdminHomePage.tsx': './AdminHomePage.tsx',
      'UsersEditPage.tsx': './UsersEditPage.tsx'
    },
    services: ['ApiService', 'AuthService'],
    external: ['react-router-dom']
  },
  
  // Testing requirements
  tests: [
    { type: 'component', description: 'AdminHomePage renders correctly', coverage: 90 },
    { type: 'component', description: 'UsersEditPage shows user management interface', coverage: 85 },
    { type: 'integration', description: 'Admin routes work correctly', coverage: 80 }
  ]
});

export default AdminHomeWebContract;