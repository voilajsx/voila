/**
 * Dynamic Name Greeting Page - Handles /greeting/hello/:name routes
 * @file src/web/apps/greeting/features/hello/pages/hello-name.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, Button, Alert } from '@voilajsx/uikit';

const HelloNamePage: React.FC = () => {
  const location = useLocation();
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Extract name from URL path
  const pathSegments = location.pathname.split('/').filter(s => s.length > 0);
  const name = pathSegments[2] || 'World'; // /greeting/hello/:name
  
  const fetchPersonalGreeting = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/greeting/hello/${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setGreeting(data.message || `Hello, ${name}!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch greeting');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name) {
      fetchPersonalGreeting();
    }
  }, [name]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            👋 Personal Greeting
          </h1>
          <p className="text-xl text-muted-foreground">
            Special greeting for <span className="font-semibold text-primary">{name}</span>
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button>← Home</Button>
          </Link>
          <Link to="/greeting">
            <Button>← Greeting Home</Button>
          </Link>
          <Link to="/greeting/hello">
            <Button>← Hello Feature</Button>
          </Link>
        </div>

        {/* Greeting Display */}
        <Card className="p-8">
          <div className="text-center space-y-6">
            {loading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
            {error && (
              <Alert className="text-red-600 bg-red-50 border-red-200">
                Error: {error}
              </Alert>
            )}
            
            {!loading && !error && greeting && (
              <div className="space-y-4">
                <div className="text-6xl">🎯</div>
                <h2 className="text-3xl font-bold text-foreground">
                  {greeting}
                </h2>
                <p className="text-lg text-muted-foreground">
                  Personalized greeting from <code>/api/greeting/hello/{name}</code>
                </p>
              </div>
            )}
            
            <Button 
              onClick={fetchPersonalGreeting}
              disabled={loading}
              className="mt-6"
            >
              {loading ? 'Loading...' : '🔄 Refresh Greeting'}
            </Button>
          </div>
        </Card>

        {/* API Info */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Dynamic Route Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Route Information</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Pattern:</strong> <code>/greeting/hello/:name</code></p>
                <p><strong>Current Path:</strong> <code>{location.pathname}</code></p>
                <p><strong>Extracted Name:</strong> <code>{name}</code></p>
                <p><strong>API Endpoint:</strong> <code>/api/greeting/hello/{name}</code></p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Try Different Names</h4>
              <div className="space-y-2 text-sm">
                <Link to="/greeting/hello/john" className="block text-green-700 hover:text-green-900">
                  → /greeting/hello/john
                </Link>
                <Link to="/greeting/hello/sarah" className="block text-green-700 hover:text-green-900">
                  → /greeting/hello/sarah
                </Link>
                <Link to="/greeting/hello/world" className="block text-green-700 hover:text-green-900">
                  → /greeting/hello/world
                </Link>
                <Link to="/greeting/hello/developer" className="block text-green-700 hover:text-green-900">
                  → /greeting/hello/developer
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* URL Pattern Info */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">How Dynamic Routing Works</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <p className="mb-2">
              <strong>URL Pattern:</strong> Any URL matching <code>/greeting/hello/[anything]</code> will load this component.
            </p>
            <p className="mb-2">
              <strong>Name Extraction:</strong> The component extracts the name from <code>location.pathname</code> using URL splitting.
            </p>
            <p>
              <strong>API Integration:</strong> Makes a personalized API call to <code>/api/greeting/hello/{`{name}`}</code> for dynamic responses.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelloNamePage;