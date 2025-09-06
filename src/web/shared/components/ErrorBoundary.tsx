/**
 * Error Boundary Component for Greeting App
 * @file src/web/apps/greeting/shared/components/ErrorBoundary.tsx
 * 
 * Standardized error handling across all greeting features
 */

import React from 'react';
import { Card, Button, Alert } from '@voilajsx/uikit';
// API Error types - defined locally since this is a shared component
interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorDisplayProps {
  error: ApiError | Error | any;
  title?: string;
  onRetry?: () => void;
  showDetails?: boolean;
}

// Standardized error display component
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  title = "Something went wrong", 
  onRetry,
  showDetails = false
}) => {
  const getErrorMessage = (error: any): string => {
    if (!error) return 'Unknown error occurred';
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unexpected error occurred';
  };

  const getErrorCode = (error: any): string | undefined => {
    if (error?.status) return `HTTP ${error.status}`;
    if (error?.code) return error.code;
    return undefined;
  };

  return (
    <Card className="p-6 border-red-200">
      <div className="text-center space-y-4">
        <div className="text-6xl">❌</div>
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">{title}</h3>
          <Alert variant="destructive">
            <div className="space-y-2">
              <p>{getErrorMessage(error)}</p>
              {getErrorCode(error) && (
                <p className="text-sm text-red-600">Code: {getErrorCode(error)}</p>
              )}
              {showDetails && error?.stack && (
                <details className="text-xs text-red-500 mt-2">
                  <summary className="cursor-pointer">Show Details</summary>
                  <pre className="mt-2 p-2 bg-red-50 rounded text-left overflow-auto">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </Alert>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

// React Error Boundary class component
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error!} retry={this.retry} />;
      }

      return (
        <ErrorDisplay
          error={this.state.error}
          title="Application Error"
          onRetry={this.retry}
          showDetails={process.env.NODE_ENV === 'development'}
        />
      );
    }

    return this.props.children;
  }
}

// Loading component with skeleton
export const LoadingDisplay: React.FC<{ title?: string; lines?: number }> = ({ 
  title = "Loading...", 
  lines = 3 
}) => (
  <Card className="p-6">
    <div className="text-center space-y-4">
      <div className="text-4xl">⏳</div>
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-200 rounded animate-pulse ${
              i === 0 ? 'w-3/4' : i === lines - 1 ? 'w-1/2' : 'w-full'
            } mx-auto`}
          />
        ))}
      </div>
    </div>
  </Card>
);

// Empty state component
export const EmptyState: React.FC<{ 
  title?: string; 
  description?: string; 
  action?: React.ReactNode 
}> = ({ 
  title = "No data available", 
  description = "There's nothing to show right now.", 
  action 
}) => (
  <Card className="p-8">
    <div className="text-center space-y-4">
      <div className="text-6xl text-gray-300">📭</div>
      <div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
      {action}
    </div>
  </Card>
);