/**
 * Option 1 Test Page
 * Route: /greeting/hello/new/sample
 * Path: greeting/hello/pages/new-sample.tsx
 */

import React from 'react';
import { Card } from '@voilajsx/uikit';

const NewSamplePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Option 1 Success!
        </h1>
        <div className="space-y-2 text-sm">
          <p><strong>Route:</strong> /greeting/hello/new/sample</p>
          <p><strong>Resolved to:</strong> greeting/hello/pages/new-sample.tsx</p>
          <p><strong>Pattern:</strong> app/feature/pages/remaining-segments.tsx</p>
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-700">
            🎯 This demonstrates Option 1: Direct app/feature match
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NewSamplePage;