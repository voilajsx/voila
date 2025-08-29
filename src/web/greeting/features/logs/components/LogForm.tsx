/**
 * LogForm Component - Create new log entries
 * @file src/web/greeting/features/logs/components/LogForm.tsx
 */

import React, { useState } from 'react';
import { LogsApiService, type CreateLogRequest } from '../logs.services.js';

interface LogFormProps {
  onLogCreated?: (log: any) => void;
  className?: string;
}

export const LogForm: React.FC<LogFormProps> = ({ onLogCreated, className }) => {
  const [formData, setFormData] = useState<CreateLogRequest>({
    message: '',
    level: 'info',
    metadata: {}
  });
  const [metadataJson, setMetadataJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Parse metadata JSON if provided
      let metadata = {};
      if (metadataJson.trim()) {
        try {
          metadata = JSON.parse(metadataJson);
        } catch (jsonError) {
          setError('Invalid JSON in metadata field');
          setLoading(false);
          return;
        }
      }

      const logData: CreateLogRequest = {
        ...formData,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined
      };

      const createdLog = await LogsApiService.createLog(logData);
      
      setSuccess(true);
      setFormData({ message: '', level: 'info', metadata: {} });
      setMetadataJson('');
      
      if (onLogCreated) {
        onLogCreated(createdLog);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create log');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`bg-white shadow sm:rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Create New Log Entry
        </h3>
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-green-800">
              <p className="text-sm">Log entry created successfully!</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter log message..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="metadata" className="block text-sm font-medium text-gray-700">
              Metadata (JSON)
            </label>
            <textarea
              id="metadata"
              value={metadataJson}
              onChange={(e) => setMetadataJson(e.target.value)}
              rows={4}
              placeholder='{"key": "value", "userId": 123}'
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono text-xs"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional JSON object with additional log context
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !formData.message.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Log Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};