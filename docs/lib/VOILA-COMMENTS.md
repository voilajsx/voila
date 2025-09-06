# VoilaJSX - Code Documentation Standards

## Unified Header Template

All files should use this consistent header format with LLM-optimized guidance:

### Backend Files (APIs, Services, Routes, Models)
```typescript
/**
 * Greeting Service - Multi-language greeting API with auth integration
 * @file src/api/greeting/features/hello/hello.services.ts
 * @llm-rule WHEN: Building greeting endpoints with authentication and validation
 * @llm-rule AVOID: Business logic in routes - use service layer pattern  
 * @llm-rule PATTERN: Static methods for Express handlers, AppKit integration
 */
```

### Frontend Hooks & Contracts (Full LLM Guidance)
```typescript
/**
 * Hello Feature Hook - Greeting API integration with caching and validation
 * @file src/web/apps/greeting/features/hello/hooks/useHello.ts
 * @llm-rule WHEN: Need greeting functionality with multi-language support
 * @llm-rule AVOID: Direct API calls - use this hook for consistency
 * @llm-rule PATTERN: Returns {greetings, auth, actions} structure with React Query
 */
```

### Frontend TSX Components (Minimal)
```typescript
/**
 * Hello Feature Root Page - Interactive greeting demo with authentication
 * @file src/web/apps/greeting/features/hello/pages/root.tsx
 */
```

## File Type Guidelines

### Detailed Documentation (with @llm-rule)
- **Backend**: Services, routes, models, complex business logic
- **Frontend**: Hooks, contracts, complex utilities
- **When to use**: Files containing architectural decisions or patterns

### Minimal Documentation (description + @file only)
- **Backend**: Simple types, basic models, test files
- **Frontend**: TSX components, pages, simple utilities
- **When to use**: Files focused on presentation or simple data structures

## LLM-Specific Tags

### @llm-rule Patterns
- `@llm-rule WHEN:` - When to use this pattern/file
- `@llm-rule AVOID:` - What not to do, anti-patterns
- `@llm-rule PATTERN:` - Expected structure/return format
- `@llm-rule NOTE:` - Important context for AI understanding

### Backend Focus Areas
```typescript
// Business rules and AppKit integration
@llm-rule WHEN: Need user authentication with session management
@llm-rule AVOID: Raw database access - use models and proper validation
@llm-rule PATTERN: Express middleware -> Service -> Model -> Database
```

### Frontend Focus Areas  
```typescript
// React patterns and hook integration
@llm-rule WHEN: Need data fetching with pagination and caching
@llm-rule AVOID: Direct API calls in components - use custom hooks
@llm-rule PATTERN: Returns {data, loading, error, actions} object structure
```

## What to Document

### Always Document
- **File purpose** and main exports
- **Function behavior** and error conditions  
- **Class responsibilities** and key methods
- **Complex business logic** with context
- **API endpoints** and authentication requirements
- **Hook patterns** and return structures

### Never Document
- **Obvious operations** (`getName()` gets name)
- **Framework boilerplate** (standard Express/React patterns)
- **Simple getters/setters**
- **Self-explanatory code**
- **Generated files** (Prisma client, build artifacts)

## LLM-Friendly Patterns

### Good Examples
```typescript
// BACKEND: Clear business context
/**
 * Calculate shipping cost based on weight, distance, and priority
 * @llm-rule WHEN: Processing e-commerce orders with shipping calculation
 * @llm-rule PATTERN: Business rule - Free shipping over $100, express adds 50%
 */

// FRONTEND: React pattern clarity
/**
 * User Profile Hook - Profile management with optimistic updates
 * @llm-rule WHEN: Need user profile CRUD operations with caching
 * @llm-rule PATTERN: Returns {profile, actions, loading, error} with React Query
 */
```

### Avoid These
```typescript
// BAD: Implementation details without context
/**
 * Iterates through array and applies mathematical operations
 */

// BAD: Obvious statements
/**
 * React component that renders JSX
 */
```

## Standards Summary

- **@file**: Always include full path for LLM context
- **Purpose over implementation**: Why, not how
- **Business context**: Rules, constraints, and decisions
- **Error conditions**: When and why things fail
- **Dependencies**: What external systems/modules are used
- **Consistent formatting**: Same header template across backend/frontend
- **TSX simplicity**: Components get minimal docs, hooks get full guidance

---

**Key Principle**: Provide LLM guidance where architectural decisions matter, keep presentation layer documentation minimal and focused.