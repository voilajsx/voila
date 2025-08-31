/**
 * Admin Home Feature - Dashboard with user management capabilities
 */

import { createWebFeatureContract } from '../../../../../lib/web-contracts.js';

const AdminHomeContract = createWebFeatureContract()
  .app('admin')
  .feature('home')
  .description('Admin dashboard home page with user management capabilities')
  
  .providesComponent('AdminHomePage')
  .providesComponent('UsersEditPage')
  .providesComponent('AdminDashboard')
  
  .consumesComponent('Button')
  .consumesComponent('Card')
  .consumesComponent('Table')
  .consumesComponent('Modal')
  .consumesComponent('Input')
  .consumesAPI('admin/users')
  .consumesAPI('admin/dashboard/stats')
  
  .sharedState(true)
  
  .route('/admin', 'root.tsx', { auth: 'admin' })
  .route('/admin/users', 'users.tsx', { auth: 'admin' })
  .route('/admin/users/:id', 'user-edit.tsx', { auth: 'admin' })
  
  .build();

export default AdminHomeContract;