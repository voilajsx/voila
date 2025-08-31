/**
 * Good Day Greeting Page - Special greeting for goodday route
 * @file src/web/apps/greeting/features/hello/pages/goodday.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Alert } from '@voilajsx/uikit';

const GoodDayPage: React.FC = () => {
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchGoodDayGreeting = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/greeting/hello/goodday');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setGreeting(data.message || 'Good day to you!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch greeting');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoodDayGreeting();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            ☀️ Good Day Greeting
          </h1>
          <p className="text-xl text-muted-foreground">
            Special greeting for a good day!
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
                <div className="text-6xl">🌟</div>
                <h2 className="text-3xl font-bold text-foreground">
                  {greeting}
                </h2>
                <p className="text-lg text-muted-foreground">
                  From the greeting service goodday endpoint
                </p>
              </div>
            )}
            
            <Button 
              onClick={fetchGoodDayGreeting}
              disabled={loading}
              className="mt-6"
            >
              {loading ? 'Loading...' : '🔄 Refresh Greeting'}
            </Button>
          </div>
        </Card>

        {/* API Info */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">API Integration</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              <strong>Endpoint:</strong> <code>/api/greeting/hello/goodday</code>
            </p>
            <p className="text-blue-800">
              <strong>Method:</strong> GET
            </p>
            <p className="text-blue-800">
              <strong>Response:</strong> JSON with good day message
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GoodDayPage;