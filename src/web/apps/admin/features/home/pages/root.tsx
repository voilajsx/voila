/**
 * Admin Home Page
 * Route: /admin
 * Path: admin/home/pages/root.tsx (Option 2)
 */

import React from 'react';

const AdminHomePage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Admin Dashboard</h1>
      <p>Route: /admin</p>
      <p>File: admin/home/pages/root.tsx</p>
      <p>This is Option 2 - admin app exists, home feature</p>
      <div style={{ marginTop: '1rem' }}>
        <a href="/admin/users/edit" style={{ color: 'blue', marginRight: '1rem' }}>Users Edit</a>
        <a href="/" style={{ color: 'blue' }}>← Home</a>
      </div>
    </div>
  );
};

export default AdminHomePage;