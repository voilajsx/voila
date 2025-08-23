// Frontend models matching backend API contracts
export interface HelloData {
  greetings: string[];
  name: string;
  language_count: number;
  timestamp: string;
  requestId: string;
  feature: string;
}

export interface HelloResponse {
  success: boolean;
  data: HelloData;
}

// UI-specific models
export interface HelloPageProps {
  name?: string;
}

export interface HelloComponentState {
  greetings: string[];
  name: string;
  loading: boolean;
  error: string | null;
}