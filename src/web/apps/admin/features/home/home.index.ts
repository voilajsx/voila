/**
 * Admin Home Feature - Dashboard with user management capabilities
 */

import { createWebFeatureContract } from '../../../../../lib/web-contracts.js';

const AdminHomeContract = createWebFeatureContract()
  .app('admin')
  .feature('home')
  .description('Admin dashboard home page with user management capabilities')
  
  .route('/admin', 'root.tsx', { auth: 'admin' })
  .route('/admin/users', 'users.tsx', { auth: 'admin' })
  .route('/admin/users/:id', 'user-edit.tsx', { auth: 'admin' })
  
  .validation('basic')
  
  .build();

export default AdminHomeContract;