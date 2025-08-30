/**
 * Admin Fallback Page  
 * Route: /admin
 * Path: main/home/pages/admin.tsx (Option 3 fallback)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '@voilajsx/uikit';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            🔧 Admin Route Fallback
          </h1>
          <p className="text-xl text-muted-foreground">
            Auto-discovered route: <code>/admin</code> → Option 3 Fallback
          </p>
          <div className="flex justify-center space-x-2">
            <Badge>main app</Badge>
            <Badge>home feature</Badge>
            <Badge>admin page</Badge>
            <Badge>Option 3 Fallback</Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button>← Home</Button>
          </Link>
          <Link to="/admin/users/edit">
            <Button>Users Edit →</Button>
          </Link>
        </div>

        {/* Explanation */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Route Discovery Analysis 🎯
          </h2>
          <p className="text-gray-600 mb-6">
            This demonstrates Option 3 fallback routing for the <code>/admin</code> route.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded">
                <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                <span className="text-red-700">❌ admin/features/admin/pages/root.tsx (no admin/admin feature)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                <span className="text-yellow-700">⚠️ admin/features/home/pages/.tsx (empty pageName bug)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                <span className="text-green-700">✅ main/features/home/pages/admin.tsx (this file!)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Issue Explanation */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">🐛 Routing Bug Identified</h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Option 2 Logic Issue:</h4>
            <div className="text-yellow-800 text-sm space-y-2">
              <p><strong>Current Logic:</strong> <code>pageSegments.join('-')</code></p>
              <p><strong>For /admin:</strong> <code>pageSegments = []</code> → <code>pageName = ""</code></p>
              <p><strong>Result:</strong> <code>admin/features/home/pages/.tsx</code> (invalid path)</p>
              <p><strong>Should be:</strong> <code>admin/features/home/pages/root.tsx</code></p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Fix Needed:</h4>
            <p className="text-blue-800 text-sm">
              Line 126-129 in app.tsx should default to 'root' when pageSegments is empty
            </p>
          </div>
        </Card>

        {/* Test Links */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Test Other Admin Routes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Working Routes:</h4>
              <div className="space-y-1">
                <Link to="/admin/users/edit" className="block">
                  <Button className="w-full justify-start">
                    /admin/users/edit (Option 2)
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Main Routes:</h4>
              <div className="space-y-1">
                <Link to="/" className="block">
                  <Button className="w-full justify-start">
                    / (Main Home)
                  </Button>
                </Link>
                <Link to="/greeting/hello" className="block">
                  <Button className="w-full justify-start">
                    /greeting/hello
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;