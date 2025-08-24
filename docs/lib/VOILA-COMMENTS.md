# VoilaJSX - Code Documentation Standards

## Core Template

### File Documentation
```typescript
/**
 * Feature: Greeting Service
 * Purpose: Multi-language greeting API with validation
 * Dependencies: AppKit(util, logger, error, validator)
 * Exports: GreetingService, GreetingRequest, GreetingResponse
 */
```

### Function Documentation
```typescript
/**
 * Generate personalized greeting in specified language
 * @param request - User greeting parameters
 * @returns Localized greeting message with metadata
 * @throws BusinessError - Invalid language or missing name
 */
static async generateGreeting(request: GreetingRequest): Promise<GreetingResponse> {
```

### Class Documentation
```typescript
/**
 * Service: User authentication and session management
 * Methods: login, logout, validateToken, refreshSession
 * Dependencies: auth, cache, validator from AppKit
 */
export class AuthService {
```

## Quick Guidelines

### What to Document
- **File purpose** and main exports
- **Function behavior** and error conditions  
- **Class responsibilities** and key methods
- **Complex business logic** with context

### What NOT to Document
- **Obvious operations** (`getName()` gets name)
- **Framework boilerplate** (standard Express routes)
- **Simple getters/setters**
- **Self-explanatory code**

### LLM-Friendly Patterns
```typescript
// GOOD: Clear business context
/**
 * Calculate shipping cost based on weight, distance, and priority
 * Business rule: Free shipping over $100, express adds 50%
 */

// AVOID: Implementation details
/**
 * Iterates through array and applies mathematical operations
 */
```

### Standards
- **Purpose over implementation** - Why, not how
- **Business context** - Rules and constraints
- **Error conditions** - When things fail
- **Dependencies** - What AppKit modules are used

---

**For complete documentation examples**: See detailed guidelines in `VOILA-COMPLETE-GUIDE.md`.