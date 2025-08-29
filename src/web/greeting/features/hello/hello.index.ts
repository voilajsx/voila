/**
 * Hello Frontend Feature Contract
 * @file src/web/greeting/features/hello/hello.index.ts
 * 
 * Frontend contract for greeting hello feature connecting to backend API
 */

import { createWebFeatureContract } from '../../../../lib/web-contracts.js';
import type { VoilaWebFeatureContract } from '../../../../lib/web-contracts.js';

const HelloWebContract: VoilaWebFeatureContract = createWebFeatureContract({
  name: 'hello',
  app: 'greeting',
  description: 'Interactive greeting UI with multi-language support and real-time backend integration',
  validation: 'essential',
  
  // Component system
  components: {
    provides: ['HelloPage', 'GreetingCard', 'LanguageSelector', 'AuthDemo'],
    consumes: ['Button', 'Card', 'LoadingSpinner', 'Alert', 'Input']
  },
  
  // Routes this feature handles (auto-generated as /greeting/hello)
  routes: {
    handles: [
      { 
        path: '/greeting/hello', // Will be auto-generated, but explicit for clarity
        component: 'HelloPage', 
        exact: true,
        ssg: {
          enabled: true,
          revalidate: 3600
        },
        dataFetching: 'hybrid'
      }
    ],
    redirects: [
      { from: '/hello', to: '/greeting/hello' },
      { from: '/greeting', to: '/greeting/hello' },
      { from: '/greet', to: '/greeting/hello' }
    ]
  },
  
  // API integration with backend (Enhanced)
  api: {
    service: 'greeting',  // References greeting.config.json
    endpoints: [
      '/hello',          // Relative paths only
      '/hello/goodday',  
      '/hello/thankyou', 
      '/hello/:name'     
    ],
    cache: {
      enabled: true,
      duration: 300000, // 5 minutes
      strategy: 'memory'
    },
    retries: 3,
    timeout: 15000
  },
  
  // SSG Configuration (New)
  ssg: {
    enabled: true,
    revalidate: 3600, // 1 hour ISR
    prerender: ['/', '/hello', '/greeting'],
    dynamic: {
      '/hello/:name': async () => {
        // Pre-generate pages for popular names
        return [
          { name: 'world' },
          { name: 'user' },
          { name: 'guest' }
        ];
      }
    },
    fallback: 'blocking'
  },
  
  // State management
  state: {
    manages: ['greetingState', 'authState', 'languagePreference'],
    subscribes: ['appTheme', 'userAuth']
  },
  
  // Dependencies
  dependencies: {
    files: {
      'hello.components.tsx': './hello.components.tsx',
      'hello.services.ts': './hello.services.ts',
      'hello.types.ts': './hello.types.ts'
    },
    services: ['ApiService', 'AuthService'],
    external: ['@tanstack/react-query', 'react-router-dom']
  },
  
  // Testing requirements
  tests: [
    { type: 'component', description: 'HelloPage renders correctly', coverage: 95 },
    { type: 'component', description: 'GreetingCard shows greeting data', coverage: 90 },
    { type: 'integration', description: 'API calls work with backend', coverage: 85 },
    { type: 'e2e', description: 'Complete greeting flow works', coverage: 80 }
  ]
});

export default HelloWebContract;