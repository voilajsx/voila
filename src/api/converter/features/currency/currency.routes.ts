/**
 * Currency conversion API routes
 * @module converter/currency
 * @file src/api/converter/features/currency/currency.routes.ts
 * 
 * @llm-rule WHEN: Defining Express routes for currency conversion
 * @llm-rule AVOID: Direct response sending - use service layer
 * @llm-rule NOTE: Handles POST /api/converter/currency endpoint
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import { CurrencyService } from './currency.services.js';

const router = Router();

/**
 * POST /api/converter/currency
 * Convert between currencies of top 20 countries
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CurrencyService.convert(req.body);
    
    // Handle both success and validation error responses
    if (result.success) {
      res.status(200).json(result);
    } else {
      // This is a validation error with supported options
      res.status(400).json(result);
    }
  } catch (error) {
    // Let the error middleware handle system errors
    next(error);
  }
});

export { router as currencyRoutes };