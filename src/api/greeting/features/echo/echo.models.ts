import { z } from 'zod';

// Request validation schemas
export const EchoSchema = z.object({
  message: z.string().min(1).max(500),
});

// TypeScript types
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

// Export schema types
export type EchoRequest = z.infer<typeof EchoSchema>;