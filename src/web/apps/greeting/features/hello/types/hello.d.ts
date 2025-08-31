/**
 * Hello Frontend Feature Types
 * @file src/web/apps/greeting/features/hello/types/hello.d.ts
 * 
 * Type definitions matching backend API responses
 */

// Backend API response type (matching hello.models.ts in backend)
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

// Frontend-specific state types
export interface GreetingState {
  currentGreeting: HelloResponse | null;
  loading: boolean;
  error: string | null;
  selectedLanguage: 'english' | 'spanish' | 'french';
}

export interface AuthDemoState {
  apiKey: string;
  isLoggedIn: boolean;
  userRole: 'user' | 'admin' | null;
  loginToken: string | null;
}

// UI Component props
export interface GreetingCardProps {
  greeting: HelloResponse;
  language: 'english' | 'spanish' | 'french';
  loading?: boolean;
}

export interface LanguageSelectorProps {
  selectedLanguage: 'english' | 'spanish' | 'french';
  onLanguageChange: (language: 'english' | 'spanish' | 'french') => void;
}

export interface AuthDemoProps {
  authState: AuthDemoState;
  onAuthChange: (state: Partial<AuthDemoState>) => void;
}

// API service types
export interface ApiService {
  getDefaultGreeting(): Promise<HelloResponse>;
  getGoodDayGreeting(apiKey: string): Promise<HelloResponse>;
  getThankYouGreeting(token: string): Promise<HelloResponse>;
  getPersonalizedGreeting(name: string, token: string): Promise<HelloResponse>;
}