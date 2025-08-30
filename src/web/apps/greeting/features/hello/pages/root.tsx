/**
 * Hello Feature - Main Page Component
 * @file src/web/greeting/features/hello/pages/root.tsx
 * 
 * Simple greeting page for testing auto-discovery routing
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '@voilajsx/uikit';

const HelloPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            🌍 Greeting Hello Feature
          </h1>
          <p className="text-xl text-muted-foreground">
            Auto-discovered route: <code>/greeting/hello</code>
          </p>
          <div className="flex justify-center space-x-2">
            <Badge>greeting app</Badge>
            <Badge>hello feature</Badge>
            <Badge>Auto-Discovery ✅</Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button>← Home</Button>
          </Link>
          <Link to="/greeting/logs">
            <Button>View Logs →</Button>
          </Link>
        </div>

        {/* Content */}
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Hello from the Greeting App! 👋
          </h2>
          <p className="text-gray-600 mb-6">
            This page demonstrates the Voila Framework's auto-discovery routing system.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 Route Discovery</h3>
                <p className="text-gray-600">
                  URL <code>/greeting/hello</code> → <br/>
                  File <code>greeting/features/hello/pages/root.tsx</code>
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">📋 Contract System</h3>
                <p className="text-gray-600">
                  Feature contract defines routes, components, and API endpoints
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">🔄 Backend Integration</h3>
                <p className="text-gray-600">
                  Frontend connects to <code>/api/greeting/hello</code> endpoints
                </p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500">
                ✅ Auto-discovery routing is working correctly!
              </p>
            </div>
          </div>
        </Card>

        {/* API Endpoints Info */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Available API Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Backend Endpoints:</h4>
              <ul className="space-y-1 text-gray-600">
                <li><Badge>GET</Badge> <code>/api/greeting/hello</code></li>
                <li><Badge>GET</Badge> <code>/api/greeting/hello/goodday</code></li>
                <li><Badge>GET</Badge> <code>/api/greeting/hello/thankyou</code></li>
                <li><Badge>GET</Badge> <code>/api/greeting/hello/:name</code></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Frontend Routes:</h4>
              <ul className="space-y-1 text-gray-600">
                <li><Badge>Route</Badge> <code>/</code> → main/home</li>
                <li><Badge>Route</Badge> <code>/greeting/hello</code> → this page</li>
                <li><Badge>Route</Badge> <code>/greeting/logs</code> → logs page</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelloPage;