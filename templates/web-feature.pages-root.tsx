/**
 * {{FEATURE_NAME_PASCAL}} Feature Root Page - Main interface for {{FEATURE_NAME}} functionality
 * @file src/web/apps/{{APP_NAME}}/features/{{FEATURE_NAME}}/pages/root.tsx
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, Input } from '@voilajsx/uikit';
import { use{{FEATURE_NAME_PASCAL}} } from '../hooks/use{{FEATURE_NAME_PASCAL}}';
import { ErrorDisplay, LoadingDisplay } from '@web/shared/components';
import type { {{FEATURE_NAME_PASCAL}}Response } from '../types/{{FEATURE_NAME}}';

const {{FEATURE_NAME_PASCAL}}Card: React.FC<{ 
  data: {{FEATURE_NAME_PASCAL}}Response; 
  loading: boolean; 
  error?: any; 
  title: string 
}> = React.memo(({ data, loading, error, title }) => {
  if (loading) {
    return <LoadingDisplay title={`Loading ${title}...`} lines={2} />;
  }

  if (error) {
    return <ErrorDisplay error={error} title={`Failed to load ${title}`} />;
  }

  if (!data?.data) {
    return (
      <Card className="p-4 border-gray-200">
        <h4 className="font-medium text-gray-500 mb-2">{title}</h4>
        <p className="text-gray-400">No data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-blue-200">
      <h4 className="font-medium text-blue-700 mb-2">{title}</h4>
      <div className="space-y-2">
        <p className="text-sm"><strong>Name:</strong> {data.data.name}</p>
        <p className="text-sm"><strong>Status:</strong> {data.data.status}</p>
        <div className="text-xs text-gray-500 pt-2">
          ID: {data.data.id} | Feature: {data.data.feature}
        </div>
      </div>
    </Card>
  );
});

const {{FEATURE_NAME_PASCAL}}Form: React.FC<{
  onSubmit: (name: string) => void;
  loading?: boolean;
}> = React.memo(({ onSubmit, loading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{{FEATURE_NAME_PASCAL}} Action</h3>
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <Input
          type="text"
          placeholder="Enter value..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={!inputValue.trim() || loading}>
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </form>
    </Card>
  );
});

const {{FEATURE_NAME_PASCAL}}Page: React.FC = () => {
  const {{FEATURE_NAME}} = use{{FEATURE_NAME_PASCAL}}();
  const [actionValue, setActionValue] = useState('');

  const handleFormSubmit = (value: string) => {
    setActionValue(value);
    // Trigger any actions with the hook here
    {{FEATURE_NAME}}.actions.refresh();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            🔧 {{FEATURE_NAME_PASCAL}} Feature
          </h1>
          <p className="text-xl text-muted-foreground">
            {{FEATURE_NAME_PASCAL}} functionality for {{APP_NAME}} application
          </p>
          <div className="flex justify-center space-x-2">
            <Badge variant={{{FEATURE_NAME}}.state.isReady ? "default" : "secondary"}>
              {{{FEATURE_NAME}}.state.isReady ? "✅ Ready" : "⏳ Loading"}
            </Badge>
            <Badge variant={{{FEATURE_NAME}}.state.hasError ? "destructive" : "outline"}>
              {{{FEATURE_NAME}}.state.hasError ? "❌ Error" : "✅ OK"}
            </Badge>
            <Badge variant={{{FEATURE_NAME}}.state.isEmpty ? "outline" : "default"}>
              {{{FEATURE_NAME}}.state.isEmpty ? "Empty" : `${{{FEATURE_NAME}}.helpers.getTotalCount()} items`}
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button variant="outline">← Home</Button>
          </Link>
          <Link to="/{{APP_NAME}}">
            <Button variant="outline">← {{APP_NAME}} Home</Button>
          </Link>
        </div>

        {/* Action Form */}
        <{{FEATURE_NAME_PASCAL}}Form
          onSubmit={handleFormSubmit}
          loading={{{FEATURE_NAME}}.state.isLoading}
        />

        {/* Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <{{FEATURE_NAME_PASCAL}}Card
            title="Current Data"
            data={{{FEATURE_NAME}}.data.current}
            loading={{{FEATURE_NAME}}.data.list.isLoading}
            error={{{FEATURE_NAME}}.data.list.error}
          />
          
          {/* Additional data cards can be added here */}
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button onClick={{{FEATURE_NAME}}.actions.refresh} variant="outline">
            Refresh Data
          </Button>
          <Button onClick={{{FEATURE_NAME}}.actions.clearCache} variant="outline">
            Clear Cache
          </Button>
        </div>

        {/* Framework Info */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Framework Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">🎯 Contract-Based</h4>
              <p className="text-gray-600">
                Route <code>/{{APP_NAME}}/{{FEATURE_NAME}}</code> defined in contract,
                automatically discovered and mounted
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">🔧 Type-Safe Hooks</h4>
              <p className="text-gray-600">
                use{{FEATURE_NAME_PASCAL}} hook with React Query integration,
                memoization, and TypeScript typing
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">🔄 API Integration</h4>
              <p className="text-gray-600">
                Seamless backend integration with error handling,
                caching, and state management
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default {{FEATURE_NAME_PASCAL}}Page;