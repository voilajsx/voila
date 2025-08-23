// Frontend models matching backend API contracts
export interface EchoRequest {
  message: string;
}

export interface EchoData {
  original_message: string;
  echoed_message: string;
  message_length: number;
  timestamp: string;
  requestId: string;
  feature: string;
  method: string;
}

export interface EchoResponse {
  success: boolean;
  data: EchoData;
}

// UI-specific models
export interface EchoPageProps {
  message?: string;
}

export interface EchoComponentState {
  message: string;
  echoResponse: EchoData | null;
  loading: boolean;
  error: string | null;
  method: 'POST' | 'GET';
}