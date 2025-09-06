/**
 * Multi-Parameter Dynamic Route - Handles /greeting/hello/:name/:new routes
 * @file src/web/apps/greeting/features/hello/pages/[name]-[new].tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@voilajsx/uikit';
import { useHello } from '../hooks/useHello';
import { useRouteParams } from '../../../../../../lib/web-routes';

const GreetingDisplay: React.FC<{ name: string; allParams: Record<string, string> }> = ({ 
  name, 
  allParams 
}) => (
  <div className="text-center space-y-4">
    <div className="text-6xl">👋✨</div>
    <div className="space-y-2 text-muted-foreground">
      <p className="text-lg">Hello, <strong>{name}</strong>!</p>
      <div className="space-y-1">
        <p className="text-sm font-semibold">All URL Parameters:</p>
        {Object.entries(allParams).map(([key, value]) => (
          <p key={key} className="text-sm">
            <strong>{key}:</strong> {value}
          </p>
        ))}
      </div>
    </div>
  </div>
);

const HelloNameNewPage: React.FC = () => {
  const hello = useHello();
  
  // Extract all URL segments as parameters
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(s => s.length > 0);
  const greetingIndex = segments.indexOf('greeting');
  const helloIndex = segments.indexOf('hello');
  
  // Get all segments after /greeting/hello/
  const paramSegments = segments.slice(helloIndex + 1);
  const name = paramSegments[0] || 'World';
  const newParam = paramSegments[1] || 'default';
  
  
  // Create parameters object with all segments
  const allParams: Record<string, string> = {};
  paramSegments.forEach((segment, index) => {
    const paramNames = ['name', 'new', 'param3', 'param4', 'param5', 'param6'];
    const paramName = paramNames[index] || `param${index + 1}`;
    allParams[paramName] = decodeURIComponent(segment);
  });
  
  // Get personalized greeting using the name parameter
  const personalGreeting = hello.actions.getPersonalGreeting(name);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Advanced Personal Greeting</h1>
          <p className="text-muted-foreground">Multi-parameter route demo</p>
        </div>

        {/* Route Info */}
        <Card className="p-4 bg-blue-50">
          <div className="text-sm space-y-1">
            <p><strong>Current URL:</strong> {pathname}</p>
            <p><strong>Parameters Found:</strong> {paramSegments.length}</p>
            <p><strong>File:</strong> [name]-[new].tsx</p>
            <div className="mt-2">
              <p><strong>All Parameters:</strong></p>
              <div className="ml-2 space-y-1">
                {Object.entries(allParams).map(([key, value]) => (
                  <p key={key}>• <strong>{key}:</strong> {value}</p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Greeting Display */}
        <Card className="p-6">
          {personalGreeting?.isLoading && (
            <div className="text-center py-8">
              <p>Loading greeting for {name}...</p>
            </div>
          )}
          
          {personalGreeting?.error && (
            <div className="text-center py-8 text-red-600">
              <p>Failed to load greeting for {name}</p>
              <Button onClick={() => personalGreeting.refetch?.()} className="mt-2">
                Try Again
              </Button>
            </div>
          )}
          
          {personalGreeting?.data && (
            <GreetingDisplay 
              name={name} 
              allParams={allParams}
            />
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/greeting/hello">
            <Button variant="outline">← Back to Hello</Button>
          </Link>
          <Link to={`/greeting/hello/${name}`}>
            <Button variant="outline">Simple Greeting</Button>
          </Link>
          <Button onClick={() => personalGreeting?.refetch?.()} variant="outline">
            🔄 Refresh
          </Button>
        </div>

        {/* Examples */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Try These Multi-Parameter URLs:</h3>
          <div className="space-y-1 text-sm">
            <Link to="/greeting/hello/ram/sample/new/old" className="block text-blue-600 hover:underline">
              /greeting/hello/ram/sample/new/old
            </Link>
            <Link to="/greeting/hello/alice/demo/test/extra/more" className="block text-blue-600 hover:underline">
              /greeting/hello/alice/demo/test/extra/more
            </Link>
            <Link to="/greeting/hello/john/param2/param3" className="block text-blue-600 hover:underline">
              /greeting/hello/john/param2/param3
            </Link>
            <Link to="/greeting/hello/dev/one/two/three/four/five/six" className="block text-blue-600 hover:underline">
              /greeting/hello/dev/one/two/three/four/five/six
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelloNameNewPage;