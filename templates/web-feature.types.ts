/**
 * {{FEATURE_NAME_PASCAL}} Frontend Feature Types
 * @file src/web/apps/{{APP_NAME}}/features/{{FEATURE_NAME}}/types/{{FEATURE_NAME}}.d.ts
 * 
 * Type definitions for {{FEATURE_NAME}} feature
 */

// Backend API response type (matching {{FEATURE_NAME}}.models.ts in backend)
export interface {{FEATURE_NAME_PASCAL}}Data {
  id: string;
  name: string;
  status: string;
  timestamp: string;
  requestId: string;
  feature: string;
}

export interface {{FEATURE_NAME_PASCAL}}Response {
  success: boolean;
  data: {{FEATURE_NAME_PASCAL}}Data;
  error?: string;
}

// API Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Frontend-specific state types
export interface {{FEATURE_NAME_PASCAL}}State {
  current{{FEATURE_NAME_PASCAL}}: {{FEATURE_NAME_PASCAL}}Response | null;
  loading: boolean;
  error: ApiError | null;
  initialized: boolean;
}

// UI Component props with type safety
export interface {{FEATURE_NAME_PASCAL}}CardProps {
  data: {{FEATURE_NAME_PASCAL}}Response;
  loading?: boolean;
  onRetry?: () => void;
  onAction?: (action: string) => void;
}

export interface {{FEATURE_NAME_PASCAL}}FormProps {
  onSubmit: (data: Partial<{{FEATURE_NAME_PASCAL}}Data>) => void;
  initialData?: Partial<{{FEATURE_NAME_PASCAL}}Data>;
  loading?: boolean;
  disabled?: boolean;
}

export interface {{FEATURE_NAME_PASCAL}}ListProps {
  items: {{FEATURE_NAME_PASCAL}}Response[];
  loading?: boolean;
  onItemSelect?: (item: {{FEATURE_NAME_PASCAL}}Response) => void;
  onRefresh?: () => void;
}

// React Query types import for actual return types
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

// Hook return types
export interface Use{{FEATURE_NAME_PASCAL}}Return {
  data: {
    list: UseQueryResult<{{FEATURE_NAME_PASCAL}}Response[], Error>;
    current: {{FEATURE_NAME_PASCAL}}Response | null;
  };
  actions: {
    create: UseMutationResult<{{FEATURE_NAME_PASCAL}}Response, Error, Partial<{{FEATURE_NAME_PASCAL}}Data>>;
    update: UseMutationResult<{{FEATURE_NAME_PASCAL}}Response, Error, { id: string; data: Partial<{{FEATURE_NAME_PASCAL}}Data> }>;
    delete: UseMutationResult<void, Error, string>;
    refresh: () => void;
    clearCache: () => void;
  };
  state: {
    isLoading: boolean;
    hasError: boolean;
    isReady: boolean;
    isEmpty: boolean;
  };
  helpers: {
    findById: (id: string) => {{FEATURE_NAME_PASCAL}}Response | undefined;
    filterByStatus: (status: string) => {{FEATURE_NAME_PASCAL}}Response[];
    getTotalCount: () => number;
  };
}