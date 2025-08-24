/**
 * Currency conversion business logic
 * @module converter/currency
 * @file src/api/converter/features/currency/currency.services.ts
 * 
 * @llm-rule WHEN: Need to convert between top 20 country currencies
 * @llm-rule AVOID: Direct currency API calls - use static rates for demo
 * @llm-rule NOTE: Provides clear error messages for unsupported currencies
 */

import { util, logger, error, validator } from '@voilajsx/appkit';
import { 
  CurrencyRequestSchema, 
  CurrencyResponse, 
  CurrencyErrorResponse,
  CurrencyConversionData,
  SUPPORTED_CURRENCIES,
  getExchangeRate,
  type CurrencyRequest 
} from './currency.types.js';

/**
 * Currency conversion service
 * Handles conversion between top 20 country currencies
 */
export class CurrencyService {
  
  /**
   * Convert amount from one currency to another
   * @param request - Currency conversion parameters
   * @returns Promise<CurrencyResponse> - Converted amount with rate and timestamp
   * @throws BusinessError - Invalid currency or amount
   */
  static async convert(request: unknown): Promise<CurrencyResponse | CurrencyErrorResponse> {
    const requestId = crypto.randomUUID();
    
    try {
      logger.info('Processing currency conversion', { request, requestId });
      
      // Validate input
      const validatedRequest = validator.validate(CurrencyRequestSchema, request, 
        'Invalid currency conversion request');
      
      const { from, to, amount } = validatedRequest;
      
      // Log the conversion attempt
      logger.info('Currency conversion request', { 
        from, 
        to, 
        amount, 
        requestId 
      });
      
      // Get exchange rate
      const rate = getExchangeRate(from, to);
      const convertedAmount = Number((amount * rate).toFixed(4));
      const timestamp = new Date().toISOString();
      
      // Build response data
      const conversionData: CurrencyConversionData = {
        converted_amount: convertedAmount,
        rate: Number(rate.toFixed(4)),
        timestamp,
        from_currency: from,
        to_currency: to,
        original_amount: amount
      };
      
      logger.success('Currency conversion completed', { 
        ...conversionData, 
        requestId 
      });
      
      return util.success(conversionData, requestId);
      
    } catch (err: any) {
      // Handle validation errors with helpful messages
      if (err.name === 'ZodError' || err.message?.includes('Currency must be one of')) {
        logger.warn('Invalid currency conversion request', { request, error: err.message, requestId });
        
        return {
          success: false,
          error: 'Invalid currency or amount. Please check your input.',
          supported_options: {
            currencies: SUPPORTED_CURRENCIES,
            message: `Supported currencies: ${SUPPORTED_CURRENCIES.join(', ')}`
          },
          requestId
        };
      }
      
      // Handle other business errors
      logger.error('Currency conversion failed', { 
        request, 
        error: err.message, 
        requestId 
      });
      
      throw error.business('Currency conversion failed', err);
    }
  }
  
  /**
   * Get list of supported currencies
   * @returns Array of supported currency codes
   */
  static getSupportedCurrencies(): readonly string[] {
    return SUPPORTED_CURRENCIES;
  }
  
  /**
   * Check if currency is supported
   * @param currency - Currency code to check
   * @returns boolean - True if currency is supported
   */
  static isCurrencySupported(currency: string): boolean {
    return SUPPORTED_CURRENCIES.includes(currency as any);
  }
}