/**
 * LogDetails Component
 * @file src/web/greeting/features/logs/components/LogDetails.tsx
 */

import React, { useState, useEffect } from 'react';
import { LogsApiService, type LogEntry } from '../logs.services.js';

interface LogDetailsProps {
  logId: string;
  className?: string;
}

export const LogDetails: React.FC<LogDetailsProps> = ({ logId, className }) => {
  const [log, setLog] = useState<LogEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLog();
  }, [logId]);

  const fetchLog = async () => {
    try {
      setLoading(true);
      const logData = await LogsApiService.getLog(logId);
      setLog(logData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch log details');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warn': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'debug': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-800">
              <h3 className="text-sm font-medium">Error loading log details</h3>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={fetchLog}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-500">Log not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Log Details</h2>
        <p className="text-gray-600">Detailed view of log entry</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(log.level)}`}
            >
              {log.level.toUpperCase()}
            </span>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {log.message}
            </h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Log ID: {log.id}
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(log.timestamp).toLocaleString()}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Level</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                  {log.level.toUpperCase()}
                </span>
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Message</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {log.message}
              </dd>
            </div>
            
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Metadata</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-x-auto border">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          ← Back to Logs
        </button>
      </div>
    </div>
  );
};