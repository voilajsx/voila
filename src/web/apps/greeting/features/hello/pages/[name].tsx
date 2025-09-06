/**
 * Dynamic Name Greeting Page - Handles /greeting/hello/:name routes
 * @file src/web/apps/greeting/features/hello/pages/[name].tsx
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@voilajsx/uikit';
import { useVoilaApi } from '../../../../../../lib/web-hooks';
import { GreetingApi } from '../../../greeting.web.config.js';
import { useRouteParam } from '../../../../../../lib/web-routes';
import { AuthTokenHelpers } from '../../../../../../lib/test-auth';
import type { HelloResponse } from '../types/hello';

const GreetingDisplay: React.FC<{ greeting: HelloResponse; name: string; dayMessage: string }> = ({ 
  greeting, 
  name, 
  dayMessage 
}) => (
  <div className="text-center space-y-4">
    <div className="text-6xl">👋</div>
    <div className="space-y-1">
      <p className="text-lg text-muted-foreground">Hello, <strong>{name}</strong>!</p>
      <p className="text-base text-blue-600 font-medium">{dayMessage}</p>
    </div>
  </div>
);

const HelloNamePage: React.FC = () => {
  // Extract name from route parameter using proper hook
  const name = useRouteParam('name', undefined, 'World');
  
  
  // Day selection state
  const [selectedDay, setSelectedDay] = useState('');
  const [dayError, setDayError] = useState('');
  
  // Valid days of the week
  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Direct API call for personalized greeting only
  // TODO: Replace with real user authentication in production
  const api = useVoilaApi(GreetingApi);
  const ADMIN_LOGIN_TOKEN = AuthTokenHelpers.getAdminToken(); // TEST TOKEN ONLY
  
  // Get personalized greeting using direct API call
  const personalGreeting = api.get<HelloResponse>(`/hello/${encodeURIComponent(name || 'World')}`, {
    headers: { 'Authorization': `Bearer ${ADMIN_LOGIN_TOKEN}` }
  });
  
  // Generate day message
  const dayMessage = selectedDay 
    ? `It's ${selectedDay}! Hope you have a wonderful day!`
    : 'Have a nice day!';
  
  // Validation functions
  const validateDay = (day: string): string | null => {
    if (!day) return null;
    
    // Check if input contains numbers
    if (/\d/.test(day)) {
      return 'Numeric values not allowed. Please enter a day name.';
    }
    
    // Check if it's a valid day of the week
    if (!validDays.includes(day)) {
      return 'Please enter a valid day (Monday to Sunday)';
    }
    
    return null;
  };
  
  // Handle form submission
  const handleDaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputDay = (formData.get('day') as string)?.trim();
    
    const error = validateDay(inputDay);
    if (error) {
      setDayError(error);
      return;
    }
    
    setDayError('');
    setSelectedDay(inputDay);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Personal Greeting</h1>
          <p className="text-muted-foreground">Hello {name}! Select a day for a personalized message.</p>
        </div>

        {/* Day Selection Form */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Enter Day of the Week</h3>
          
          <div className="space-y-4">
            <form onSubmit={handleDaySubmit} className="flex space-x-2">
              <input
                name="day"
                type="text"
                placeholder="Enter a day (e.g., Monday, Tuesday...)"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit">Set Day</Button>
            </form>
            
            {dayError && (
              <div className="text-red-600 text-sm mt-2">{dayError}</div>
            )}
            
            {selectedDay && (
              <div className="text-green-600 text-sm mt-2">
                ✅ Day set to: <strong>{selectedDay}</strong>
              </div>
            )}
          </div>
        </Card>

        {/* Greeting Display */}
        <Card className="p-6">
          {personalGreeting.isLoading && (
            <div className="text-center py-8">
              <p>Loading greeting for {name}...</p>
            </div>
          )}
          
          {personalGreeting.error && (
            <div className="text-center py-8 text-red-600">
              <p>Failed to load greeting for {name}</p>
              <Button onClick={() => personalGreeting.refetch?.()} className="mt-2">
                Try Again
              </Button>
            </div>
          )}
          
          {personalGreeting.data && (
            <GreetingDisplay 
              greeting={personalGreeting.data} 
              name={name} 
              dayMessage={dayMessage}
            />
          )}
        </Card>


        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/greeting/hello">
            <Button variant="outline">← Back</Button>
          </Link>
          <Button onClick={() => personalGreeting.refetch?.()} variant="outline">
            🔄 Refresh
          </Button>
          <Button 
            onClick={() => {
              setSelectedDay('');
              setDayError('');
            }}
            variant="outline"
          >
            Clear Day
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelloNamePage;