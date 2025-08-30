/**
 * HomePage Component - Main Landing Page
 * @file src/web/main/features/home/pages/root.tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Badge, 
  Card, 
  Button, 
  Separator 
} from '@voilajsx/uikit';

interface HomePageProps {
  className?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ className }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}>
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Voila Framework
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern, contract-driven full-stack framework with auto-discovery and AI-friendly architecture
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge>TypeScript</Badge>
            <Badge>React</Badge>
            <Badge>Express</Badge>
            <Badge>Prisma</Badge>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Greeting App */}
          <Card className="hover:shadow-lg transition-shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                👋 Greeting App
                <Badge>Active</Badge>
              </h3>
              <p className="text-gray-600 mt-2">
                Interactive greeting service with multi-language support and database logging
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/greeting/hello">
                <Button className="w-full justify-start">
                  🌍 Hello Feature
                </Button>
              </Link>
              <Link to="/greeting/logs">
                <Button className="w-full justify-start">
                  📋 Logs Management
                </Button>
              </Link>
            </div>
          </Card>

          {/* Climate App (Future) */}
          <Card className="opacity-60 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                🌡️ Climate App
                <Badge>Coming Soon</Badge>
              </h3>
              <p className="text-gray-600 mt-2">
                Weather data and climate information services
              </p>
            </div>
            <div className="space-y-3">
              <Button disabled className="w-full justify-start">
                🌤️ Weather Feature
              </Button>
              <Button disabled className="w-full justify-start">
                🔍 Search Feature
              </Button>
            </div>
          </Card>

          {/* Welcome App (Future) */}
          <Card className="opacity-60 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                🎉 Welcome App
                <Badge>Coming Soon</Badge>
              </h3>
              <p className="text-gray-600 mt-2">
                User onboarding and welcome experience
              </p>
            </div>
            <div className="space-y-3">
              <Button disabled className="w-full justify-start">
                👤 User Greet
              </Button>
              <Button disabled className="w-full justify-start">
                📊 Status Dashboard
              </Button>
            </div>
          </Card>
        </div>

        <Separator className="my-12" />

        {/* Framework Features */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Framework Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">🔄 Auto-Discovery</h3>
              <p className="text-gray-600">Automatic route and API discovery from file structure</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">📋 Contract-Driven</h3>
              <p className="text-gray-600">Type-safe contracts define behavior before implementation</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">🤖 AI-Friendly</h3>
              <p className="text-gray-600">Consistent patterns optimized for AI code generation</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">⚡ Full-Stack</h3>
              <p className="text-gray-600">Unified backend and frontend with shared validation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export for auto-discovery router
export default HomePage;