/**
 * LogsPage - Main logs page component
 * @file src/web/greeting/features/logs/pages/root.tsx
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '@voilajsx/uikit';

const LogsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            📋 Greeting Logs Feature
          </h1>
          <p className="text-xl text-muted-foreground">
            Auto-discovered route: <code>/greeting/logs</code>
          </p>
          <div className="flex justify-center space-x-2">
            <Badge>greeting app</Badge>
            <Badge>logs feature</Badge>
            <Badge>Auto-Discovery ✅</Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button>← Home</Button>
          </Link>
          <Link to="/greeting/hello">
            <Button>← Hello Feature</Button>
          </Link>
        </div>

        {/* Content */}
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Logs Management System 📊
          </h2>
          <p className="text-gray-600 mb-6">
            Monitor and manage logs from the greeting service with real-time updates.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 Route Discovery</h3>
                <p className="text-gray-600">
                  URL <code>/greeting/logs</code> → <br/>
                  File <code>greeting/features/logs/pages/root.tsx</code>
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">📋 Contract System</h3>
                <p className="text-gray-600">
                  Feature contract defines CRUD operations and real-time updates
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">🔄 Backend Integration</h3>
                <p className="text-gray-600">
                  Frontend connects to <code>/api/greeting/logs</code> endpoints
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

        {/* Log Management Demo */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Log Management Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">📊 Available Actions:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">View All Logs</span>
                  <Badge>GET /api/greeting/logs</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Create Log Entry</span>
                  <Badge>POST /api/greeting/logs</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Search Logs</span>
                  <Badge>GET /api/greeting/logs/search</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">View Log Details</span>
                  <Badge>GET /api/greeting/logs/:id</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">🔗 Related Routes:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Main Page</span>
                  <Badge>/ → main/home</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Hello Feature</span>
                  <Badge>/greeting/hello</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">This Page</span>
                  <Badge>/greeting/logs</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Log Details</span>
                  <Badge>/greeting/logs/:id</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Event System Info */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Event-Driven Architecture</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📥 Event Listeners</h4>
            <p className="text-blue-800 text-sm mb-2">
              This logs feature listens to events from other services:
            </p>
            <div className="text-sm text-blue-700">
              <p><strong>Namespace:</strong> <code>climate_weather</code></p>
              <p><strong>Event:</strong> <code>weather.data.fetched</code></p>
              <p><strong>Handler:</strong> <code>createWeatherLog</code></p>
              <p><strong>Purpose:</strong> Auto-creates log entries when weather data is fetched</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LogsPage;