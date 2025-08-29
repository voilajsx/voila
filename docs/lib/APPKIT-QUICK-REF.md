# VoilaJSX AppKit - Quick Reference

**Essential patterns for Voila Framework development. Import only what you need.**

## Core Import Pattern

```typescript
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';

const utils = utilClass.get();
const log = loggerClass.get('feature.service');
const err = errorClass.get();
const secure = securityClass.get();
```
**Use 80% of the time** - covers most service implementations.

## AppKit Module Pattern

**ALWAYS use the `.get()` pattern for AppKit modules:**

```typescript
import { authClass } from '@voilajsx/appkit/auth';
const auth = authClass.get();

// ❌ NEVER do this:
new authClass();

// ✅ ALWAYS do this:
const auth = authClass.get();
```

## Complete Module Categories

### Infrastructure (Use First)
```typescript
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
```

### Data & Communication (Use Second)  
```typescript
import { configClass } from '@voilajsx/appkit/config';
import { authClass } from '@voilajsx/appkit/auth';
// Note: All AppKit modules use class pattern with .get()
```

### Developer Experience (Use Third)
```typescript
// Additional modules follow same class pattern
// import { testClass } from '@voilajsx/appkit/test';
// import { debugClass } from '@voilajsx/appkit/debug';
```

## Essential Patterns

### 1. Service Response Pattern
```typescript
import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { errorClass } from '@voilajsx/appkit/error';

const utils = utilClass.get();
const err = errorClass.get();

export class MyService {
  static async getData(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const result = await processData(req.params.id);
      
      res.json({
        success: true,
        data: result,
        requestId,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      throw err.business('Failed to get data', error);
    }
  }
}
```

### 2. Logging Pattern
```typescript
import { loggerClass } from '@voilajsx/appkit/logger';

const log = loggerClass.get('myservice');

export class MyService {
  static async processOrder(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    const order = req.body;
    
    log.info('Processing order', { requestId, orderId: order.id });
    
    try {
      const result = await process(order);
      log.info('Order processed', { requestId, orderId: order.id, result });
      
      res.json({
        success: true,
        data: result,
        requestId
      });
    } catch (error: any) {
      log.error('Order processing failed', { requestId, orderId: order.id, error });
      throw error;
    }
  }
}
```

### 3. Validation Pattern
```typescript
import { securityClass } from '@voilajsx/appkit/security';
import { UserSchema } from './types.js';

const secure = securityClass.get();

export class MyService {
  static async createUser(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      // Validate with Zod schema (built into templates)
      const validatedData = UserSchema.parse(req.body);
      // Sanitize input for security
      const sanitizedData = secure.input(validatedData);
      
      const result = await createUser(sanitizedData);
      
      res.json({
        success: true,
        data: result,
        requestId
      });
    } catch (error: any) {
      throw err.business('User creation failed', error);
    }
  }
}
```

### 4. HTTP Client Pattern
```typescript
// Note: HTTP client usage depends on specific AppKit version
// Generally external APIs are called using fetch or external libraries
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';

const log = loggerClass.get('external.service');
const err = errorClass.get();

export class ExternalService {
  static async fetchWeather(req: Request, res: Response): Promise<void> {
    const city = req.params.city;
    const requestId = utils.uuid();
    
    try {
      const response = await fetch(`https://api.weather.com/weather/${city}`, {
        headers: { 'Authorization': 'Bearer token' }
      });
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      log.info('Weather data fetched', { requestId, city, status: response.status });
      
      res.json({
        success: true,
        data,
        requestId
      });
    } catch (error: any) {
      log.error('Weather API failed', { requestId, city, error: error.message });
      throw err.external('Weather API failed', error);
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

### auth - Authentication (Dual Token System)
```typescript
import { authClass } from '@voilajsx/appkit/auth';
const auth = authClass.get();

// LOGIN TOKENS - For user authentication (mobile/web)
const loginToken = auth.generateLoginToken({
  userId: 123,     // REQUIRED - unique user identifier  
  role: 'admin',   // REQUIRED - role name (admin, user, moderator)
  level: 'tenant', // REQUIRED - level within role (basic, tenant, org, system)
}, '7d');

// API TOKENS - For service authentication (webhooks/integrations)
const apiToken = auth.generateApiToken({
  keyId: 'webhook_service', // REQUIRED - service identifier
  role: 'service',          // REQUIRED - role name
  level: 'external',        // REQUIRED - level within role
}, '1y');

// Token verification (works with both types)
const payload = auth.verifyToken(token);

// Password operations
const hashed = await auth.hashPassword(password);
const isValid = await auth.comparePassword(password, hashed);

// Route protection
app.get('/profile', auth.requireLoginToken(), handler);      // Login tokens only
app.post('/webhook', auth.requireApiToken(), handler);       // API tokens only
app.get('/admin', auth.requireUserRoles(['admin.tenant']), handler);  // Role check

// User extraction (works with both token types)
const user = auth.user(req);
if (!user) throw error.unauthorized('Authentication required');

// Role hierarchy checking
const userRoleLevel = `${user.role}.${user.level}`;
if (!auth.hasRole(userRoleLevel, 'admin.tenant')) {
  throw error.forbidden('Admin access required');
}

// Permission checking (action:scope format)
if (!auth.can(user, 'manage:tenant')) {
  throw error.forbidden('Insufficient permissions');
}
```

#### Built-in Role Hierarchy
```
admin.system > admin.org > admin.tenant >
moderator.manage > moderator.approve > moderator.review >
user.max > user.pro > user.basic
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
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';

const utils = utilClass.get();
const log = loggerClass.get('feature.service');
const err = errorClass.get();
const secure = securityClass.get();
```

### Service with External API calls
```typescript
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
// Use native fetch or external HTTP libraries
```

### Service with Database Operations
```typescript
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
// Use Prisma client generated per app
```

### Service with Authentication
```typescript
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { authClass } from '@voilajsx/appkit/auth';

const auth = authClass.get();
```

### Service with Configuration
```typescript
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { configClass } from '@voilajsx/appkit/config';

const config = configClass.get();
```

### Complex Service (Multiple needs)
```typescript
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { authClass } from '@voilajsx/appkit/auth';
import { configClass } from '@voilajsx/appkit/config';

const utils = utilClass.get();
const log = loggerClass.get('feature.service');
const err = errorClass.get();
const secure = securityClass.get();
const auth = authClass.get();
const config = configClass.get();
```

## Common Patterns

### Service Template
```typescript
import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { MyRequestSchema } from './types.js';

const utils = utilClass.get();
const log = loggerClass.get('myservice');
const err = errorClass.get();
const secure = securityClass.get();

export class MyService {
  static async processRequest(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    // 1. Log request
    log.info('Processing request', { requestId, input: req.body });
    
    try {
      // 2. Validate and sanitize input
      const validated = MyRequestSchema.parse(req.body);
      const sanitized = secure.input(validated);
      
      // 3. Business logic
      const result = await doBusinessLogic(sanitized);
      
      // 4. Log success & return
      log.info('Request processed', { requestId, result });
      
      res.json({
        success: true,
        data: result,
        requestId,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      // 5. Log error & throw
      log.error('Request failed', { requestId, input: req.body, error: error.message });
      throw err.business('Processing failed', error);
    }
  }
}
```

### Route Handler Template
```typescript
import express from 'express';
import { authClass } from '@voilajsx/appkit/auth';
import { MyService } from './myfeature.services.js';

const router = express.Router();
const auth = authClass.get();

// Simple route delegation to service
router.post('/endpoint', MyService.processRequest);

// Route with authentication
router.post('/protected', 
  auth.requireLoginToken(),                    // Require user authentication
  auth.requireUserRoles(['admin.tenant']),    // Require specific role
  MyService.processProtectedRequest
);

// Route with validation middleware (validation done in service)
router.get('/data/:id', MyService.getData);

export default router;
```

---

**For complete documentation**: See `APPKIT-COMPLETE.md` for full API reference, advanced patterns, and detailed examples.