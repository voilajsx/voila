/**
 * LogDetailsPage - Individual log details page component
 * @file src/web/greeting/features/logs/pages/details.tsx
 */

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Badge } from '@voilajsx/uikit';

const LogDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Log ID</h1>
          <p className="text-muted-foreground mb-6">No log ID provided in the URL</p>
          <Link to="/greeting/logs">
            <Button>← Back to Logs</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            📄 Log Details
          </h1>
          <p className="text-xl text-muted-foreground">
            Auto-discovered route: <code>/greeting/logs/details</code>
          </p>
          <div className="flex justify-center space-x-2">
            <Badge>greeting app</Badge>
            <Badge>logs feature</Badge>
            <Badge>details page</Badge>
            <Badge>Auto-Discovery ✅</Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button>← Home</Button>
          </Link>
          <Link to="/greeting/logs">
            <Button>← All Logs</Button>
          </Link>
          <Link to="/greeting/hello">
            <Button>Hello Feature</Button>
          </Link>
        </div>

        {/* Log Details Simulation */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Log Entry Details 📋
          </h2>
          <p className="text-gray-600 mb-6">
            This page would display detailed information for a specific log entry.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Log Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Log ID:</span>
                    <Badge>{id}</Badge>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Status:</span>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Created:</span>
                    <span className="text-gray-600">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Service:</span>
                    <span className="text-gray-600">greeting-service</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Route Discovery</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">URL Pattern:</p>
                    <code className="text-gray-600">/greeting/logs/details</code>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">File Path:</p>
                    <code className="text-gray-600">greeting/features/logs/pages/details.tsx</code>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">Discovery Option:</p>
                    <span className="text-green-600 font-medium">Option 1 - Direct match</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500 text-center">
                ✅ Auto-discovery routing is working correctly for log details!
              </p>
            </div>
          </div>
        </Card>

        {/* Mock Log Content */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Log Content</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
            <div className="space-y-1">
              <div className="text-green-400">[2025-01-29 09:39:32] INFO: Greeting service started</div>
              <div className="text-blue-400">[2025-01-29 09:39:33] DEBUG: API discovery completed - 7 features found</div>
              <div className="text-yellow-400">[2025-01-29 09:39:34] WARN: Event subscription orphaned - climate_weather:weather.data.fetched</div>
              <div className="text-green-400">[2025-01-29 09:39:35] INFO: Server listening on port 3000</div>
              <div className="text-purple-400">[2025-01-29 09:39:36] EVENT: Log entry {id} created successfully</div>
            </div>
          </div>
        </Card>

        {/* Related Actions */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Available Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="justify-start" disabled>
              📥 Download Log
            </Button>
            <Button className="justify-start" disabled>
              🔄 Refresh Data  
            </Button>
            <Button className="justify-start" disabled>
              🗑️ Delete Log
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Actions are disabled in demo mode
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LogDetailsPage;