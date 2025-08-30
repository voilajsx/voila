/**
 * Option 3 Test Page  
 * Route: /shop/products/new
 * Path: main/home/pages/shop-products-new.tsx
 */

import React from 'react';
import { Card } from '@voilajsx/uikit';

const ShopProductsNewPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-8 text-center">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">
          ✅ Option 3 Success!
        </h1>
        <div className="space-y-2 text-sm">
          <p><strong>Route:</strong> /shop/products/new</p>
          <p><strong>Resolved to:</strong> main/home/pages/shop-products-new.tsx</p>
          <p><strong>Pattern:</strong> main/home/pages/all-segments.tsx</p>
        </div>
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-purple-700">
            🎯 This demonstrates Option 3: No shop app exists, so ultimate fallback to main/home
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ShopProductsNewPage;