/**
 * Currency conversion TypeScript types and validation schemas
 * @module converter/currency
 * @file src/api/converter/features/currency/currency.types.ts
 * 
 * @llm-rule WHEN: Need TypeScript types and Zod validation for currency conversion endpoints
 * @llm-rule AVOID: Using plain objects without validation - always use CurrencyRequestSchema
 * @llm-rule NOTE: Supports top 20 country currencies with clear error handling
 */

import { z } from 'zod';

// Top 20 supported currencies
export const SUPPORTED_CURRENCIES = [
  'USD', // United States Dollar
  'EUR', // Euro
  'GBP', // British Pound Sterling
  'JPY', // Japanese Yen
  'AUD', // Australian Dollar
  'CAD', // Canadian Dollar
  'CHF', // Swiss Franc
  'CNY', // Chinese Yuan
  'SEK', // Swedish Krona
  'NZD', // New Zealand Dollar
  'MXN', // Mexican Peso
  'SGD', // Singapore Dollar
  'HKD', // Hong Kong Dollar
  'NOK', // Norwegian Krone
  'INR', // Indian Rupee
  'KRW', // South Korean Won
  'TRY', // Turkish Lira
  'RUB', // Russian Ruble
  'BRL', // Brazilian Real
  'ZAR'  // South African Rand
] as const;

// Request validation schema
export const CurrencyRequestSchema = z.object({
  from: z.enum(SUPPORTED_CURRENCIES as [string, ...string[]], {
    errorMap: () => ({ message: `Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}` })
  }),
  to: z.enum(SUPPORTED_CURRENCIES as [string, ...string[]], {
    errorMap: () => ({ message: `Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}` })
  }),
  amount: z.number().positive({
    message: "Amount must be a positive number"
  }).max(1000000, {
    message: "Amount cannot exceed 1,000,000"
  })
});

// Currency conversion data structure
export interface CurrencyConversionData {
  converted_amount: number;
  rate: number;
  timestamp: string;
  from_currency: string;
  to_currency: string;
  original_amount: number;
}

// Successful currency conversion response
export interface CurrencyResponse {
  success: true;
  data: CurrencyConversionData;
  requestId: string;
}

// Error response structure for currency conversion
export interface CurrencyErrorResponse {
  success: false;
  error: string;
  supported_options?: {
    currencies: typeof SUPPORTED_CURRENCIES;
    message: string;
  };
  requestId: string;
}

// Static exchange rates (for demo - in production would come from API)
export const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.85, GBP: 0.73, JPY: 110.0, AUD: 1.35, CAD: 1.25, CHF: 0.92, CNY: 6.45,
    SEK: 8.5, NZD: 1.42, MXN: 20.5, SGD: 1.35, HKD: 7.8, NOK: 8.2, INR: 74.5,
    KRW: 1180.0, TRY: 8.5, RUB: 73.5, BRL: 5.2, ZAR: 14.5
  },
  EUR: {
    USD: 1.18, GBP: 0.86, JPY: 129.5, AUD: 1.59, CAD: 1.47, CHF: 1.08, CNY: 7.59,
    SEK: 10.0, NZD: 1.67, MXN: 24.1, SGD: 1.59, HKD: 9.18, NOK: 9.65, INR: 87.7,
    KRW: 1388.0, TRY: 10.0, RUB: 86.5, BRL: 6.12, ZAR: 17.1
  },
  GBP: {
    USD: 1.37, EUR: 1.16, JPY: 150.7, AUD: 1.85, CAD: 1.71, CHF: 1.26, CNY: 8.83,
    SEK: 11.6, NZD: 1.95, MXN: 28.1, SGD: 1.85, HKD: 10.7, NOK: 11.2, INR: 102.1,
    KRW: 1616.0, TRY: 11.6, RUB: 100.7, BRL: 7.13, ZAR: 19.9
  },
  // Add other base currencies as needed - for demo, we'll calculate inverse rates
};

// Helper function to get exchange rate
export function getExchangeRate(from: string, to: string): number {
  if (from === to) return 1.0;
  
  // Direct rate
  if (EXCHANGE_RATES[from]?.[to]) {
    return EXCHANGE_RATES[from][to];
  }
  
  // Inverse rate
  if (EXCHANGE_RATES[to]?.[from]) {
    return 1 / EXCHANGE_RATES[to][from];
  }
  
  // Convert via USD
  if (from !== 'USD' && to !== 'USD') {
    const fromUsdRate = getExchangeRate(from, 'USD');
    const toUsdRate = getExchangeRate('USD', to);
    return fromUsdRate * toUsdRate;
  }
  
  // Fallback rate (should not happen with supported currencies)
  return 1.0;
}

// Export schema-inferred types
export type CurrencyRequest = z.infer<typeof CurrencyRequestSchema>;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];