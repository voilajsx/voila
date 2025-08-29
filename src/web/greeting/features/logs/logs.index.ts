/**
 * Logs Web Feature Contract
 * @file src/web/greeting/features/logs/logs.index.ts
 */

import type { VoilaWebFeatureContract } from '../../../../lib/web-contracts.js';
import { createWebFeatureContract } from '../../../../lib/web-contracts.js';

const LogsWebContract: VoilaWebFeatureContract = createWebFeatureContract({
  app: 'greeting',
  name: 'logs',
  description: 'Logs management feature for greeting service',
  validation: 'basic',
  
  // Component system
  components: {
    provides: ['LogsPage', 'LogDetailsPage', 'LogsList', 'LogDetails', 'LogForm'],
    consumes: ['Button', 'Card', 'LoadingSpinner', 'Alert', 'Input']
  },
  
  api: {
    service: 'greeting',
    endpoints: ['/logs', '/logs/create', '/logs/search', '/logs/:id'],
    cache: {
      enabled: true,
      duration: 60000,
      strategy: 'memory'
    },
    retries: 2,
    timeout: 10000
  },
  
  ssg: {
    enabled: false
  },
  
  routes: {
    handles: [
      {
        path: '/greeting/logs', // Will be auto-generated, but explicit for clarity
        component: 'LogsPage',
        exact: true,
        ssg: {
          enabled: false
        },
        dataFetching: 'client'
      },
      {
        path: '/greeting/logs/:id', // Will be auto-generated as /greeting/logs with dynamic routing
        component: 'LogDetailsPage',
        exact: true,
        ssg: {
          enabled: false
        },
        dataFetching: 'client'
      }
    ],
    redirects: [
      { from: '/logs', to: '/greeting/logs' },
      { from: '/logs/:id', to: '/greeting/logs/:id' }
    ]
  },
  
  // State management
  state: {
    manages: ['logsState', 'logsFilter'],
    subscribes: ['appTheme']
  },
  
  // Dependencies
  dependencies: {
    files: {
      'logs.services.ts': './logs.services.ts',
      'LogsPage.tsx': './LogsPage.tsx',
      'LogDetailsPage.tsx': './LogDetailsPage.tsx'
    },
    services: ['ApiService'],
    external: ['react-router-dom']
  },
  
  // Testing requirements
  tests: [
    { type: 'component', description: 'LogsPage renders correctly', coverage: 90 },
    { type: 'component', description: 'LogDetails shows log data', coverage: 85 },
    { type: 'integration', description: 'API calls work with backend', coverage: 80 }
  ]
});

export default LogsWebContract;