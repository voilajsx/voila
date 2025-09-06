# VoilaJSX - Code Documentation Standards

## TSDoc Integration with Voila-Specific Extensions

VoilaJSX follows **TSDoc standard** as the base documentation format, enhanced with framework-specific tags for AI-assisted development. This hybrid approach provides excellent IDE integration while maintaining LLM guidance.

### Core Documentation Philosophy

- **Base Format**: TSDoc-compliant JSDoc comments
- **Extensions**: Custom `@llm-rule` and `@file` tags for AI guidance
- **Tool Support**: Compatible with TypeDoc, VS Code IntelliSense, and documentation generators
- **AI Integration**: Structured guidance for LLM understanding and code generation

## Unified Header Template

All files should use this consistent TSDoc-compliant format with Voila extensions:

### Backend Files (APIs, Services, Routes, Models)
```typescript
/**
 * Greeting Service - Multi-language greeting API with auth integration
 * @file src/api/greeting/features/hello/hello.services.ts
 * 
 * @llm-rule WHEN: Building greeting endpoints with authentication and validation
 * @llm-rule AVOID: Business logic in routes - use service layer pattern  
 * @llm-rule PATTERN: Static methods for Express handlers, AppKit integration
 * @llm-rule NOTE: Integrates with VoilaJSX AppKit for consistent error handling
 * 
 * Provides greeting services with multi-language support and authentication.
 * Follows the service layer pattern for clean separation of concerns.
 */
```

### Frontend Hooks & Contracts (Full LLM Guidance)
```typescript
/**
 * Hello Feature Hook - Greeting API integration with caching and validation
 * @file src/web/apps/greeting/features/hello/hooks/useHello.ts
 * 
 * @llm-rule WHEN: Need greeting functionality with multi-language support
 * @llm-rule AVOID: Direct API calls - use this hook for consistency
 * @llm-rule PATTERN: Returns {greetings, auth, actions} structure with React Query
 * @llm-rule NOTE: Automatically handles caching, error states, and loading indicators
 * 
 * Custom hook for greeting functionality with built-in API client integration.
 * Provides caching, error handling, and consistent state management.
 */
```

### Frontend TSX Components (Minimal TSDoc)
```typescript
/**
 * Hello Feature Root Page - Interactive greeting demo with authentication
 * @file src/web/apps/greeting/features/hello/pages/root.tsx
 * 
 * Main entry point for the Hello feature, providing an interactive greeting
 * interface with authentication and personalization capabilities.
 */
```

## TSDoc Standard Tags + Voila Extensions

### Standard TSDoc Tags (Use These)
- `@param` - Parameter descriptions
- `@returns` - Return value descriptions
- `@throws` - Exception conditions
- `@example` - Usage examples
- `@see` - Cross-references
- `@since` - Version information
- `@deprecated` - Deprecation warnings

### Voila-Specific Extensions
- `@file` - Full file path for LLM context and navigation
- `@llm-rule WHEN:` - When to use this pattern/file
- `@llm-rule AVOID:` - What not to do, anti-patterns
- `@llm-rule PATTERN:` - Expected structure/return format
- `@llm-rule NOTE:` - Important context for AI understanding

## File Type Guidelines

### Detailed Documentation (TSDoc + @llm-rule)
- **Backend**: Services, routes, models, complex business logic
- **Frontend**: Hooks, contracts, complex utilities, framework components
- **When to use**: Files containing architectural decisions or patterns
- **Format**: Full TSDoc header with all relevant tags

### Minimal Documentation (TSDoc basic)
- **Backend**: Simple types, basic models, test files
- **Frontend**: TSX components, pages, simple utilities
- **When to use**: Files focused on presentation or simple data structures
- **Format**: Brief description + `@file` tag

## Function and Method Documentation

### Complete TSDoc Example
```typescript
/**
 * Calculate shipping cost based on weight, distance, and priority
 * 
 * @param weight - Package weight in kilograms
 * @param distance - Shipping distance in kilometers
 * @param priority - Shipping priority level
 * @returns Calculated shipping cost in cents
 * @throws {ValidationError} When weight or distance is negative
 * 
 * @llm-rule WHEN: Processing e-commerce orders with shipping calculation
 * @llm-rule PATTERN: Business rule - Free shipping over $100, express adds 50%
 * @llm-rule NOTE: Returns cost in cents to avoid floating-point precision issues
 * 
 * @example
 * ```typescript
 * const cost = calculateShipping(2.5, 150, 'standard');
 * console.log(`Shipping: $${cost / 100}`);
 * ```
 */
function calculateShipping(
  weight: number,
  distance: number, 
  priority: 'standard' | 'express'
): number {
  // Implementation...
}
```

### Frontend Hook Example
```typescript
/**
 * User Profile Hook - Profile management with optimistic updates
 * 
 * @param userId - User identifier for profile operations
 * @returns Profile data, actions, and loading states
 * 
 * @llm-rule WHEN: Need user profile CRUD operations with caching
 * @llm-rule PATTERN: Returns {profile, actions, loading, error} with React Query
 * @llm-rule AVOID: Direct API calls - always use the provided actions
 * 
 * @example
 * ```tsx
 * const { profile, updateProfile, loading } = useProfile(userId);
 * 
 * const handleUpdate = (data) => {
 *   updateProfile.mutate(data);
 * };
 * ```
 */
export function useProfile(userId: string) {
  // Implementation...
}
```

## TypeDoc Generation

### Compatible Tags
All TSDoc tags work with TypeDoc generation:
```bash
# Generate documentation
npx typedoc --out docs/api src/lib --excludeExternals
```

### Custom Tag Support
Configure `typedoc.json` for custom tags:
```json
{
  "customTags": [
    "llm-rule",
    "file"
  ],
  "excludeExternals": true,
  "plugin": ["typedoc-plugin-markdown"]
}
```

## LLM-Friendly Patterns

### Backend Focus Areas
```typescript
/**
 * User authentication middleware with session management
 * 
 * @param req - Express request object
 * @param res - Express response object  
 * @param next - Express next function
 * @throws {UnauthorizedError} When authentication fails
 * 
 * @llm-rule WHEN: Need user authentication with session management
 * @llm-rule AVOID: Raw database access - use models and proper validation
 * @llm-rule PATTERN: Express middleware -> Service -> Model -> Database
 * @llm-rule NOTE: Integrates with VoilaJSX AppKit auth system
 */
```

### Frontend Focus Areas  
```typescript
/**
 * Data fetching hook with pagination and caching
 * 
 * @param endpoint - API endpoint to fetch from
 * @param options - Query options including pagination
 * @returns Query result with data, loading, error, and actions
 * 
 * @llm-rule WHEN: Need data fetching with pagination and caching
 * @llm-rule AVOID: Direct API calls in components - use custom hooks
 * @llm-rule PATTERN: Returns {data, loading, error, actions} object structure
 * @llm-rule NOTE: Automatically handles React Query caching and invalidation
 */
```

## What to Document

### Always Document (TSDoc Required)
- **File purpose** and main exports (file header)
- **Function parameters** and return values (`@param`, `@returns`)
- **Error conditions** and exceptions (`@throws`)
- **Complex business logic** with context and rules
- **API endpoints** and authentication requirements
- **Hook patterns** and return structures
- **Usage examples** for complex functions (`@example`)

### Document When Helpful
- **Class responsibilities** and key methods
- **Interface properties** that aren't self-explanatory
- **Configuration objects** and their options
- **Cross-references** to related functionality (`@see`)

### Never Document
- **Obvious operations** (`getName()` gets name)
- **Framework boilerplate** (standard Express/React patterns)
- **Simple getters/setters** without business logic
- **Self-explanatory code** with clear variable names
- **Generated files** (Prisma client, build artifacts)

## Standards Summary

- **Base Format**: TSDoc-compliant JSDoc comments for tool compatibility
- **Extensions**: `@file` and `@llm-rule` tags for AI guidance
- **File Headers**: Always include purpose, file path, and appropriate rules
- **Function Docs**: Use standard TSDoc tags (`@param`, `@returns`, `@throws`)
- **Examples**: Include `@example` blocks for complex functionality
- **Tool Support**: Compatible with TypeDoc, VS Code, and documentation generators
- **Consistency**: Same header template structure across backend/frontend
- **AI Guidance**: LLM rules where architectural decisions matter
- **TSX Simplicity**: Components get minimal docs, hooks get full guidance

---

**Key Principle**: Follow TSDoc standard for tool compatibility, enhanced with Voila-specific tags for AI-assisted development. Provide comprehensive guidance where architectural decisions matter, keep presentation layer documentation focused and minimal.