import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Input, Typography, Space, Spin, Alert } from '@voilajsx/uikit/components';
import { HelloService } from './hello.services';
import { type HelloComponentState } from './hello.models';

const { Title, Text } = Typography;

export const HelloPage: React.FC = () => {
  const { name } = useParams<{ name?: string }>();
  const [state, setState] = useState<HelloComponentState>({
    greetings: [],
    name: name || '',
    loading: false,
    error: null
  });
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    if (name) {
      fetchGreeting(name);
    } else {
      fetchDefaultGreeting();
    }
  }, [name]);

  const fetchDefaultGreeting = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await HelloService.getDefaultGreeting();
      setState(prev => ({
        ...prev,
        greetings: response.data.greetings,
        name: response.data.name,
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch greeting'
      }));
    }
  };

  const fetchGreeting = async (greetingName: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await HelloService.getGreetingByName(greetingName);
      setState(prev => ({
        ...prev,
        greetings: response.data.greetings,
        name: response.data.name,
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch greeting'
      }));
    }
  };

  const handleGetGreeting = () => {
    if (inputName.trim()) {
      fetchGreeting(inputName.trim());
    } else {
      fetchDefaultGreeting();
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>Hello Feature</Title>
        <Text>Get greetings in 3 languages!</Text>
        
        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '24px' }}>
          <Space>
            <Input
              placeholder="Enter a name (optional)"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onPressEnter={handleGetGreeting}
            />
            <Button type="primary" onClick={handleGetGreeting}>
              Get Greeting
            </Button>
          </Space>

          {state.loading && <Spin size="large" />}
          
          {state.error && (
            <Alert
              message="Error"
              description={state.error}
              type="error"
              showIcon
            />
          )}

          {!state.loading && !state.error && state.greetings.length > 0 && (
            <Card>
              <Title level={4}>Greetings for: {state.name}</Title>
              <Space direction="vertical">
                {state.greetings.map((greeting, index) => (
                  <Text key={index} style={{ fontSize: '16px' }}>
                    {greeting}
                  </Text>
                ))}
              </Space>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  );
};