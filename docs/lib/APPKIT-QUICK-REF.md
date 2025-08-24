# VoilaJSX AppKit - Quick Reference

**Essential patterns for Voila Framework development. Import only what you need.**

## Core Import Pattern

```typescript
import { util, logger, error, validator } from '@voilajsx/appkit';
```
**Use 80% of the time** - covers most service implementations.

## Complete Module Categories

### Infrastructure (Use First)
```typescript
import { util, logger, error, validator } from '@voilajsx/appkit';
```

### Data & Communication (Use Second)  
```typescript
import { http, data, config, auth, cache } from '@voilajsx/appkit';
```

### Developer Experience (Use Third)
```typescript
import { test, debug, types } from '@voilajsx/appkit';
```

## Essential Patterns

### 1. Service Response Pattern
```typescript
import { util, error } from '@voilajsx/appkit';

export class MyService {
  static async getData(id: string) {
    try {
      const result = await processData(id);
      return util.success(result);              // ✅ Success response
    } catch (err) {
      throw error.business('Failed to get data', err);  // ❌ Business error
    }
  }
}
```

### 2. Logging Pattern
```typescript
import { logger } from '@voilajsx/appkit';

export class MyService {
  static async processOrder(order: Order) {
    logger.info('Processing order', { orderId: order.id });
    
    try {
      const result = await process(order);
      logger.success('Order processed', { orderId: order.id, result });
      return result;
    } catch (error) {
      logger.error('Order processing failed', { orderId: order.id, error });
      throw error;
    }
  }
}
```

### 3. Validation Pattern
```typescript
import { validator } from '@voilajsx/appkit';

export class MyService {
  static async createUser(userData: unknown) {
    const validatedData = validator.validate(UserSchema, userData);
    // validatedData is now typed and validated
    return await createUser(validatedData);
  }
}
```

### 4. HTTP Client Pattern
```typescript
import { http, logger, error } from '@voilajsx/appkit';

export class ExternalService {
  static async fetchWeather(city: string) {
    try {
      const response = await http.get(`/weather/${city}`, {
        headers: { 'Authorization': 'Bearer token' }
      });
      
      logger.info('Weather data fetched', { city, status: response.status });
      return response.data;
    } catch (err) {
      throw error.external('Weather API failed', err);
    }
  }
}
```

## Module Reference

### util - Response Utilities
```typescript
import { util } from '@voilajsx/appkit';

// Success responses
util.success(data)                    // { success: true, data }
util.success(data, 'Custom message')  // { success: true, data, message }

// Pagination
util.paginate(items, page, limit)     // { data: items, pagination: {...} }

// Transformations
util.pick(obj, ['field1', 'field2']) // Extract specific fields
util.omit(obj, ['password'])          // Exclude sensitive fields
```

### logger - Structured Logging
```typescript
import { logger } from '@voilajsx/appkit';

// Log levels
logger.info('Info message', { context });
logger.warn('Warning message', { context });
logger.error('Error occurred', { error, context });
logger.debug('Debug info', { context });
logger.success('Operation completed', { result });

// Request tracking
logger.request('API call started', { method, url, userId });
logger.response('API call completed', { status, duration });
```

### error - Error Management
```typescript
import { error } from '@voilajsx/appkit';

// Business logic errors (400-level)
throw error.business('Invalid user input');
throw error.validation('Required field missing');
throw error.authorization('Access denied');
throw error.notFound('User not found');

// System errors (500-level)  
throw error.system('Database connection failed');
throw error.external('Third-party API failed');

// With original error context
throw error.business('Operation failed', originalError);
```

### validator - Data Validation
```typescript
import { validator } from '@voilajsx/appkit';

// Validate against Zod schema
const validatedData = validator.validate(UserSchema, userData);

// Validate with custom error message
const result = validator.validate(schema, data, 'Invalid user data');

// Safe validation (returns result object)
const { success, data, error } = validator.safeParse(schema, userData);
```

### http - HTTP Client
```typescript
import { http } from '@voilajsx/appkit';

// Basic requests
const response = await http.get('/api/users');
const user = await http.post('/api/users', userData);
const updated = await http.put('/api/users/123', updateData);
await http.delete('/api/users/123');

// With options
const response = await http.get('/api/data', {
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000,
  params: { page: 1, limit: 10 }
});
```

### config - Configuration Management
```typescript
import { config } from '@voilajsx/appkit';

// Environment variables
const apiKey = config.env('API_KEY');                    // Required
const port = config.env('PORT', '3000');                // With default
const dbUrl = config.env('DATABASE_URL');

// Type-safe config
const dbConfig = config.require({
  host: 'DB_HOST',
  port: 'DB_PORT',
  name: 'DB_NAME'
});
```

### auth - Authentication
```typescript
import { auth } from '@voilajsx/appkit';

// JWT operations
const token = auth.generateToken(payload, secret);
const decoded = auth.verifyToken(token, secret);
const refreshed = auth.refreshToken(oldToken, secret);

// Password operations  
const hashed = await auth.hashPassword(password);
const isValid = await auth.comparePassword(password, hashed);
```

### cache - Caching Operations
```typescript
import { cache } from '@voilajsx/appkit';

// Basic operations
await cache.set('key', data, 3600);          // Set with TTL (seconds)
const cached = await cache.get('key');        // Get value
await cache.delete('key');                    // Delete
await cache.clear();                          // Clear all

// Pattern-based operations
await cache.deletePattern('user:*');         // Delete by pattern
const exists = await cache.exists('key');    // Check existence
```

### data - Database Utilities
```typescript
import { data } from '@voilajsx/appkit';

// Query building
const query = data.queryBuilder()
  .select('id', 'name', 'email')
  .from('users')
  .where('status', 'active')
  .limit(10);

// Pagination helpers
const paginated = await data.paginate(query, page, limit);

// Transaction helpers
await data.transaction(async (trx) => {
  await trx('users').insert(userData);
  await trx('profiles').insert(profileData);
});
```

## Quick Decision Tree

**Choose imports based on what you're building:**

### Simple Service (80% of cases)
```typescript
import { util, logger, error, validator } from '@voilajsx/appkit';
```

### Service with External API calls
```typescript
import { util, logger, error, http } from '@voilajsx/appkit';
```

### Service with Database Operations
```typescript
import { util, logger, error, data, validator } from '@voilajsx/appkit';
```

### Service with Authentication
```typescript
import { util, logger, error, auth, validator } from '@voilajsx/appkit';
```

### Service with Caching
```typescript
import { util, logger, error, cache, validator } from '@voilajsx/appkit';
```

### Complex Service (Multiple needs)
```typescript
import { 
  util, logger, error, validator,    // Core
  http, data, config, auth, cache     // Extended
} from '@voilajsx/appkit';
```

## Common Patterns

### Service Template
```typescript
import { util, logger, error, validator } from '@voilajsx/appkit';

export class MyService {
  static async processRequest(input: unknown): Promise<ServiceResponse> {
    // 1. Log request
    logger.info('Processing request', { input });
    
    try {
      // 2. Validate input
      const validated = validator.validate(MySchema, input);
      
      // 3. Business logic
      const result = await doBusinessLogic(validated);
      
      // 4. Log success & return
      logger.success('Request processed', { result });
      return util.success(result);
      
    } catch (err) {
      // 5. Log error & throw
      logger.error('Request failed', { input, error: err });
      throw error.business('Processing failed', err);
    }
  }
}
```

### Route Handler Template
```typescript
import { util, error, validator } from '@voilajsx/appkit';

router.post('/endpoint', async (req, res, next) => {
  try {
    const validated = validator.validate(RequestSchema, req.body);
    const result = await MyService.processRequest(validated);
    res.json(result);
  } catch (err) {
    next(err);  // Let error middleware handle it
  }
});
```

---

**For complete documentation**: See `APPKIT-COMPLETE.md` for full API reference, advanced patterns, and detailed examples.