/**
 * LogsList Component
 * @file src/web/greeting/features/logs/components/LogsList.tsx
 */

import React, { useState, useEffect } from 'react';
import { LogsApiService, type LogEntry } from '../logs.services.js';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  Button 
} from '@voilajsx/uikit';

interface LogsListProps {
  className?: string;
}

export const LogsList: React.FC<LogsListProps> = ({ className }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [editingLog, setEditingLog] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ message: string; endpoint: string; userName: string }>({ message: '', endpoint: '', userName: '' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; log: LogEntry | null }>({ open: false, log: null });
  const [clearAllDialog, setClearAllDialog] = useState(false);

  useEffect(() => {
    setRetryCount(0); // Reset retry count when page changes
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await LogsApiService.getLogs(page, 10);
      setLogs(response.logs);
      setTotal(response.total);
    } catch (err) {
      console.error('[LogsList] Failed to fetch logs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch logs';
      
      // Check if this looks like a server restart scenario
      const isServerUnavailable = errorMessage.includes('ECONNREFUSED') || 
                                 errorMessage.includes('fetch failed') ||
                                 errorMessage.includes('network error');
      
      if (isServerUnavailable && retryCount < 2) {
        console.log('[LogsList] Server appears to be restarting, retrying in 2 seconds...');
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchLogs(), 2000);
        return; // Don't set error state, keep trying
      }
      
      setError(errorMessage);
      setRetryCount(0); // Reset retry count on final error
      
      // Keep previous logs if this was just a refresh failure
      if (logs.length === 0) {
        setLogs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warn': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'debug': return 'text-gray-600 bg-gray-50';
      default: return 'text-blue-600 bg-blue-50'; // Default to info style
    }
  };

  const getDisplayLevel = (log: LogEntry) => {
    // If no level provided, infer from endpoint or default to 'info'
    if (log.level) return log.level;
    if (log.endpoint?.includes('error')) return 'error';
    return 'info';
  };

  const handleEdit = (log: LogEntry) => {
    setEditingLog(log.id);
    setEditData({
      message: log.message,
      endpoint: log.endpoint,
      userName: log.userName
    });
  };

  const handleSaveEdit = async (log: LogEntry) => {
    try {
      await LogsApiService.updateLog(log.id, editData);
      setEditingLog(null);
      fetchLogs(); // Refresh the logs
    } catch (error) {
      console.error('Failed to update log:', error);
      alert(`Failed to update log: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingLog(null);
    setEditData({ message: '', endpoint: '', userName: '' });
  };

  const handleDelete = (log: LogEntry) => {
    setDeleteDialog({ open: true, log });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.log) return;
    
    try {
      await LogsApiService.deleteLog(deleteDialog.log.id);
      console.log('Log deleted successfully:', deleteDialog.log.id);
      setDeleteDialog({ open: false, log: null });
      // Refresh the logs after deletion
      fetchLogs();
    } catch (error) {
      console.error('Failed to delete log:', error);
      alert(`Failed to delete log: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClearAll = () => {
    setClearAllDialog(true);
  };

  const confirmClearAll = async () => {
    try {
      await LogsApiService.clearAllLogs();
      console.log('All logs cleared successfully');
      setClearAllDialog(false);
      setLogs([]);
      setTotal(0);
      fetchLogs(); // Refresh to confirm
    } catch (error) {
      console.error('Failed to clear all logs:', error);
      alert(`Failed to clear all logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
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
              <h3 className="text-sm font-medium">Error loading logs</h3>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={fetchLogs}
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

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Greeting Logs</h2>
            <p className="text-gray-600">View and search through greeting service logs</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchLogs()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {!logs || logs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {loading ? 'Loading logs...' : 'No logs found'}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {logs.map((log) => (
                <li key={log.id}>
                  <div className="px-4 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(getDisplayLevel(log))}`}
                        >
                          {getDisplayLevel(log).toUpperCase()}
                        </span>
                        {editingLog === log.id ? (
                          <input
                            type="text"
                            value={editData.message}
                            onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                            className="text-sm text-gray-900 font-medium bg-white border border-gray-300 rounded px-2 py-1 flex-1"
                            placeholder="Log message"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 font-medium">
                            {log.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-1">
                          {editingLog === log.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(log)}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                title="Save changes"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                                title="Cancel editing"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(log)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit log"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(log)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete log"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <div className="flex items-center">
                        Endpoint: {editingLog === log.id ? (
                          <input
                            type="text"
                            value={editData.endpoint}
                            onChange={(e) => setEditData({ ...editData, endpoint: e.target.value })}
                            className="ml-1 text-xs bg-white border border-gray-300 rounded px-1 py-0.5 font-mono flex-1"
                            placeholder="Endpoint"
                          />
                        ) : (
                          <span className="font-mono ml-1">{log.endpoint}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        User: {editingLog === log.id ? (
                          <input
                            type="text"
                            value={editData.userName}
                            onChange={(e) => setEditData({ ...editData, userName: e.target.value })}
                            className="ml-1 text-xs bg-white border border-gray-300 rounded px-1 py-0.5 flex-1"
                            placeholder="User name"
                          />
                        ) : (
                          <span className="ml-1">{log.userName} {log.userRole && `(${log.userRole})`}</span>
                        )}
                      </div>
                      <div>IP: <span className="font-mono">{log.ipAddress}</span></div>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-2">
                          <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {logs.length} of {total} logs
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {page}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={logs.length < 10}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, log: open ? deleteDialog.log : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Log Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this log entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteDialog.log && (
            <div className="py-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-900">{deleteDialog.log.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {deleteDialog.log.endpoint} • {deleteDialog.log.userName} • {new Date(deleteDialog.log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, log: null })}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearAllDialog} onOpenChange={setClearAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Logs</DialogTitle>
            <DialogDescription>
              ⚠️ WARNING: This will permanently delete ALL {total} log entries. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 p-3 rounded-md">
              <p className="text-sm text-red-800 font-medium">
                This will remove all {total} log entries from the database permanently.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setClearAllDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmClearAll}
            >
              Clear All Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};