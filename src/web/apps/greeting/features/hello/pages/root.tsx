/**
 * Hello Feature Root Page - Interactive greeting demo with authentication
 * @file src/web/apps/greeting/features/hello/pages/root.tsx
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '@voilajsx/uikit';
import { useHello } from '../hooks/useHello';
import { ErrorDisplay, LoadingDisplay } from '@web/shared/components';

const GreetingCard: React.FC<{ greeting: any; loading: boolean; error?: any; title: string }> = React.memo(({ 
  greeting, 
  loading, 
  error, 
  title 
}) => {
  if (loading) {
    return <LoadingDisplay title={`Loading ${title}...`} lines={2} />;
  }

  if (error) {
    return <ErrorDisplay error={error} title={`Failed to load ${title}`} />;
  }

  if (!greeting?.data) {
    return (
      <Card className="p-4 border-gray-200">
        <h4 className="font-medium text-gray-500 mb-2">{title}</h4>
        <p className="text-gray-400">No data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-green-200">
      <h4 className="font-medium text-green-700 mb-2">{title}</h4>
      <div className="space-y-2">
        {greeting.data.data.greetings.map((msg: string, i: number) => (
          <p key={i} className="text-sm">{msg}</p>
        ))}
        <div className="text-xs text-gray-500 pt-2">
          Language count: {greeting.data.data.language_count} | 
          Name: {greeting.data.data.name}
        </div>
      </div>
    </Card>
  );
});

const AuthForm: React.FC<{ 
  apiKey: string; 
  authToken: string; 
  onApiKeyChange: (key: string) => void;
  onAuthTokenChange: (token: string) => void;
}> = React.memo(({ apiKey, authToken, onApiKeyChange, onAuthTokenChange }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Authentication Demo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">API Key (for Good Day greeting)</label>
          <input data-testid="root-text-input"
            type="text"
            placeholder="Enter API key..."
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Auth Token (for Thank You greeting)</label>
          <input data-testid="root-text-input"
            type="text"
            placeholder="Enter auth token..."
            value={authToken}
            onChange={(e) => onAuthTokenChange(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
});

const HelloPage: React.FC = () => {
  const hello = useHello();
  
  const [personName, setPersonName] = useState('');

  // Always call the hook, but conditionally enable it
  const personalGreeting = hello.actions.getPersonalGreeting(personName.trim());

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            🌍 Interactive Greeting Demo
          </h1>
          <p className="text-xl text-muted-foreground">
            Showcasing useHello hook with real API integration
          </p>
          <div className="flex justify-center space-x-2">
            <Badge variant={hello.isReady ? "default" : "secondary"}>
              {hello.isReady ? "✅ Ready" : "⏳ Loading"}
            </Badge>
            <Badge variant={hello.hasApiKey ? "default" : "outline"}>API Key</Badge>
            <Badge variant={hello.hasAuthToken ? "default" : "outline"}>Auth Token</Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button data-testid="root-button" variant="outline">← Home</Button>
          </Link>
          <Link to="/greeting/logs">
            <Button data-testid="root-button" variant="outline">View Logs →</Button>
          </Link>
          <Link to="/greeting/hello/World">
            <Button data-testid="root-button">Personal Greeting →</Button>
          </Link>
        </div>

        {/* Authentication Form */}
        <AuthForm
          apiKey={hello.auth.apiKey}
          authToken={hello.auth.authToken}
          onApiKeyChange={hello.auth.setApiKey}
          onAuthTokenChange={hello.auth.setAuthToken}
        />

        {/* Personal Greeting Input */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Greeting</h3>
          <div className="flex space-x-4">
            <input data-testid="root-text-input"
              type="text"
              placeholder="Enter your name..."
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="flex-1"
            />
            <Button data-testid="root-button" 
              onClick={() => personalGreeting?.refetch?.()}
              disabled={!personName.trim()}
            >
              Get Greeting
            </Button>
          </div>
        </Card>

        {/* Greeting Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GreetingCard
            title="Default Greeting"
            greeting={hello.greetings.default}
            loading={hello.greetings.default.isLoading}
            error={hello.greetings.default.error}
          />
          
          <GreetingCard
            title="Good Day (API Key)"
            greeting={hello.greetings.goodDay}
            loading={hello.greetings.goodDay.isLoading}
            error={hello.greetings.goodDay.error}
          />
          
          <GreetingCard
            title="Thank You (Auth)"
            greeting={hello.greetings.thankYou}
            loading={hello.greetings.thankYou.isLoading}
            error={hello.greetings.thankYou.error}
          />

          {personName.trim() && hello.hasAuthToken && personalGreeting && (
            <GreetingCard
              title={`Personal (${personName}) - Admin Only`}
              greeting={personalGreeting}
              loading={personalGreeting.isLoading}
              error={personalGreeting.error}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button data-testid="root-button" onClick={hello.actions.refresh} variant="outline">
            Refresh All
          </Button>
          <Button data-testid="root-button" onClick={hello.actions.clearCache} variant="outline">
            Clear Cache
          </Button>
          <Button data-testid="root-button" 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }} 
            variant="destructive"
          >
            Clear Storage & Reload
          </Button>
        </div>

        {/* Framework Info */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Framework Features Demonstrated</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">🎯 Contract-Based Routing</h4>
              <p className="text-gray-600">
                Route <code>/greeting/hello</code> defined in contract, 
                automatically discovered and mounted
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">🔧 Optimized Hooks</h4>
              <p className="text-gray-600">
                useHello hook with React Query integration, 
                memoization, and proper TypeScript typing
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">🔄 API Integration</h4>
              <p className="text-gray-600">
                Seamless backend integration with auth, 
                error handling, and caching
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelloPage;