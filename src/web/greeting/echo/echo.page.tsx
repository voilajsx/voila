import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Input, Typography, Space, Spin, Alert, Radio } from '@voilajsx/uikit/components';
import { EchoService } from './echo.services';
import { type EchoComponentState } from './echo.models';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const EchoPage: React.FC = () => {
  const { message } = useParams<{ message?: string }>();
  const [state, setState] = useState<EchoComponentState>({
    message: message || '',
    echoResponse: null,
    loading: false,
    error: null,
    method: 'POST'
  });
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (message) {
      setInputMessage(message);
      handleEcho(message, 'GET');
    }
  }, [message]);

  const handleEcho = async (messageText: string, method: 'POST' | 'GET' = state.method) => {
    if (!messageText.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter a message to echo' }));
      return;
    }

    const maxLength = method === 'GET' ? 200 : 500;
    if (messageText.length > maxLength) {
      setState(prev => ({ 
        ...prev, 
        error: `Message must be ${maxLength} characters or less for ${method} requests` 
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = method === 'POST' 
        ? await EchoService.echoMessage(messageText)
        : await EchoService.echoMessageGet(messageText);
      
      setState(prev => ({
        ...prev,
        echoResponse: response.data,
        message: messageText,
        loading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to echo message'
      }));
    }
  };

  const handleSubmit = () => {
    handleEcho(inputMessage.trim(), state.method);
  };

  const handleMethodChange = (e: any) => {
    setState(prev => ({ ...prev, method: e.target.value }));
  };

  const maxLength = state.method === 'GET' ? 200 : 500;

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>Echo Feature</Title>
        <Text>Send a message and get it echoed back!</Text>
        
        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '24px' }}>
          <Space direction="vertical">
            <Text strong>Choose method:</Text>
            <Radio.Group onChange={handleMethodChange} value={state.method}>
              <Radio value="POST">POST (max 500 chars)</Radio>
              <Radio value="GET">GET (max 200 chars)</Radio>
            </Radio.Group>
          </Space>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Message:</Text>
            <TextArea
              placeholder={`Enter your message (max ${maxLength} characters)`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              maxLength={maxLength}
              showCount
              rows={4}
            />
            <Button type="primary" onClick={handleSubmit} disabled={!inputMessage.trim()}>
              Echo Message ({state.method})
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

          {!state.loading && !state.error && state.echoResponse && (
            <Card>
              <Title level={4}>Echo Response</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text><strong>Original:</strong> {state.echoResponse.original_message}</Text>
                <Text><strong>Echoed:</strong> {state.echoResponse.echoed_message}</Text>
                <Text><strong>Length:</strong> {state.echoResponse.message_length} characters</Text>
                <Text><strong>Method:</strong> {state.echoResponse.method}</Text>
                <Text><strong>Timestamp:</strong> {new Date(state.echoResponse.timestamp).toLocaleString()}</Text>
              </Space>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  );
};