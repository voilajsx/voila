/**
 * Greeting Page - Fallback route demonstration
 * @file src/web/main/features/home/pages/greeting.tsx
 * 
 * This page will handle /greeting route as fallback:
 * Option 2: main/home/pages/greeting.tsx (since greeting/home/pages/root.tsx doesn't exist)
 */

import React from 'react';
import { Button, Card } from '@voilajsx/uikit';

const GreetingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🎯 Auto-Discovery Fallback Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            This page demonstrates the 3-option fallback routing system
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <code className="text-sm">
              Route: /greeting → main/home/pages/greeting.tsx (Option 2)
            </code>
          </div>
        </div>

        {/* Explanation */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">How This Route Was Discovered</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-destructive/20 text-destructive rounded-full flex items-center justify-center text-xs font-semibold">1</span>
              <span className="text-muted-foreground">❌ greeting/home/pages/root.tsx (doesn't exist)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">2</span>
              <span className="text-foreground">✅ main/home/pages/greeting.tsx (this file!)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-muted-foreground/20 text-muted-foreground rounded-full flex items-center justify-center text-xs font-semibold">3</span>
              <span className="text-muted-foreground">⏭️ main/home/pages/greeting.tsx (not needed)</span>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <h3 className="font-semibold mb-2">Root Route</h3>
            <p className="text-sm text-muted-foreground mb-4">
              main/home/pages/root.tsx
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </Card>

          <Card className="p-4 text-center">
            <h3 className="font-semibold mb-2">Hello Feature</h3>
            <p className="text-sm text-muted-foreground mb-4">
              greeting/hello/pages/root.tsx
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/greeting/hello'}>
              Go to Hello
            </Button>
          </Card>

          <Card className="p-4 text-center">
            <h3 className="font-semibold mb-2">Logs Feature</h3>
            <p className="text-sm text-muted-foreground mb-4">
              greeting/logs/pages/root.tsx
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/greeting/logs'}>
              Go to Logs
            </Button>
          </Card>
        </div>

        {/* 404 Test */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Test 404 Behavior</h2>
          <p className="text-muted-foreground mb-4">
            Try a route that doesn't exist to see the 404 page:
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/non/existent/route'}
          >
            Test 404 Page
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default GreetingPage;