/**
 * Hello Feature - Interactive greeting UI with multi-language support
 */

import { createWebFeatureContract } from '@lib/web-contracts.js';

const HelloContract = createWebFeatureContract()
  .app('greeting')
  .feature('hello')
  .description('Interactive greeting UI with multi-language support and backend integration')
  
  .route('/greeting/hello', 'root.tsx', { auth: 'public' })
  .route('/greeting/hello/:name', '[name].tsx', { auth: 'public' })

  .providesHook('useHello')
  
  .build();

export default HelloContract;