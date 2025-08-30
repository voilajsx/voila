/**
 * Simple Hello Page for Greeting App
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SimpleHelloPage: React.FC = () => {
  const [helloData, setHelloData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchHello = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/greeting/hello');
      const data = await response.json();
      setHelloData(data);
    } catch (error) {
      console.error('API Error:', error);
      setHelloData({ error: 'Failed to fetch' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHello();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            👋 Greeting Hello
          </h1>
          <p className="text-xl text-gray-600">
            Hello feature from <code>/api/greeting/hello</code>
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
            ← Home
          </Link>
          <Link to="/greeting/logs" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
            📋 Logs
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">API Response</h2>
            <button
              onClick={fetchHello}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {helloData ? (
            <div className="space-y-4">
              {helloData.error ? (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <span className="text-red-600 font-medium">❌ Error: {helloData.error}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <span className="text-green-800 font-medium">✅ API Connected</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(helloData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p>Loading...</p>
            </div>
          ) : null}
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Route Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded">
              <span className="text-green-800 font-medium">✅ Frontend Route</span>
              <p className="text-green-600">/greeting/hello working</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <span className="text-green-800 font-medium">✅ API Route</span>
              <p className="text-green-600">/api/greeting/hello accessible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHelloPage;