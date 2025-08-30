/**
 * Option 2 Test Page
 * Route: /admin/users/edit
 * Path: admin/home/pages/users-edit.tsx
 */

import React from 'react';
import { Card } from '@voilajsx/uikit';

const UsersEditPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          ✅ Option 2 Success!
        </h1>
        <div className="space-y-2 text-sm">
          <p><strong>Route:</strong> /admin/users/edit</p>
          <p><strong>Resolved to:</strong> admin/home/pages/users-edit.tsx</p>
          <p><strong>Pattern:</strong> app/home/pages/all-remaining-segments.tsx</p>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700">
            🎯 This demonstrates Option 2: App exists but no users feature, so fallback to home
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UsersEditPage;