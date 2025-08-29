# Voila Framework - Contract System & 4-Level Validation

**Complete guide to Voila's contract-driven development and progressive validation system.**

## Philosophy

**Contracts Drive Everything** - Every feature is defined by a contract first, ensuring consistency, documentation, and validation before implementation.

**Progressive Quality Gates** - Four validation levels provide appropriate quality controls for different development phases, from rapid prototyping to enterprise production.

## Contract Structure

### Core VoilaFeatureContract Interface

```typescript
interface VoilaFeatureContract {
  // === IDENTITY ===
  name: string;                    // Feature name (kebab-case)
  app: string;                    // Parent application name
  description: string;            // Business purpose and functionality
  validation: 'none' | 'basic' | 'essential' | 'strict';  // Validation level

  // === API DEFINITION ===
  api: {
    basePath: string;                    // Base path for all routes
    endpoints: Array<{                   // HTTP endpoint definitions
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      path: string;                     // Endpoint path (relative to basePath)
      handler: string;                  // Service method name
      summary: string;                  // Endpoint description
      requestSchema?: string;           // Request validation schema name
      responseSchema?: string;          // Response type schema name
      auth?: { type: 'public' | 'private' }; // Authentication requirement
    }>;
  };

  // === DEPENDENCIES (File-specific imports) ===
  dependencies: {
    files: Record<string, {              // Per-file dependency tracking
      appkit: string[];                  // AppKit modules needed
      external: string[];                // External npm packages
      relative: string[];                // Relative file imports
    }>;
  };

  // === BIDIRECTIONAL COMMUNICATION ===
  services: {
    provides: string[];                  // Service classes this feature provides
    consumes: string[];                  // Service dependencies this feature needs
  };

  events: {
    emits: Array<{                      // Events this feature emits
      namespace: string;                // Event namespace (app_feature format)
      event: string;                   // Event name
      payload: string;                 // Payload type name
      description: string;             // When/why this event is emitted
    }>;
    listens: Array<{                    // Events this feature listens to
      namespace: string;               // Event namespace to listen for
      event: string;                  // Event name to handle
      handler: string;                // Handler method name
    }>;
  };

  // === TEST REQUIREMENTS ===
  tests: string[];                       // Required test scenarios (human-readable)
}
```

### Contract Creation Pattern

```typescript
import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

export const MyFeatureContract: VoilaFeatureContract = createFeatureContract({
  // Contract definition...
});

export default MyFeatureContract;
```

## 4-Level Validation System

Progressive validation system that provides appropriate quality gates for different development phases.

### Validation Level Overview

| Level | Coverage | Development Phase | Validation Scope | Use Case |
|-------|----------|-------------------|------------------|----------|
| `none` | 0% | Quick testing | No validation at all | Rapid experimentation, proof of concepts |
| `basic` | ~20% | Rapid prototyping | Required fields + API endpoints | Early development, MVP building |
| `essential` | ~80% | Standard development (default) | Basic + services/events/tests | Production-ready development |
| `strict` | 100% | Enterprise production | Essential + file imports + LLM comments | Enterprise systems, critical applications |

### Detailed Validation Breakdown

#### Level 1: `none` - No Validation (0%)
```bash
npm run generate app:api myapp/feature -- --none
```

**What happens:**
- Validation completely bypassed
- Returns `{ valid: true, errors: [], warnings: [] }` immediately
- No quality gates enforced

**Use when:**
- Rapid experimentation
- Proof of concept development
- Quick testing of ideas
- Learning the framework

#### Level 2: `basic` - Minimal Validation (~20%)
```bash
npm run generate app:api myapp/feature -- --basic
```

**What gets validated:**
- ✅ Required contract fields (`name`, `app`)
- ✅ API endpoint structure (method, path, handler)
- ✅ Basic contract syntax

**Skipped validations:**
- ❌ Service communication
- ❌ Event system
- ❌ Test requirements
- ❌ File dependencies
- ❌ Implementation validation

**Use when:**
- Rapid prototyping
- MVP development
- Early-stage development
- Client demos

#### Level 3: `essential` - Standard Validation (~80%) - DEFAULT
```bash
npm run generate app:api myapp/feature              # Default level
npm run generate app:api myapp/feature -- --essential  # Explicit
```

**What gets validated:**
- ✅ All basic validations
- ✅ Service communication (`provides`/`consumes`)
- ✅ Event system (`emits`/`listens`)
- ✅ Test requirements validation
- ✅ Cross-feature dependency checks

**Skipped validations:**
- ❌ File existence validation
- ❌ Import statement verification
- ❌ LLM comments validation

**Use when:**
- Standard production development
- Team collaboration
- Balanced development speed vs quality
- Most applications (recommended default)

#### Level 4: `strict` - Full Validation (100%)
```bash
npm run generate app:api myapp/feature -- --strict
```

**What gets validated:**
- ✅ All essential validations
- ✅ File existence validation (all files in `dependencies.files`)
- ✅ Import statement verification
- ✅ LLM comments validation (file headers + method comments)
- ✅ Complete implementation consistency

**LLM Comments Validation:**
- File-level `@llm-rule` annotations in headers
- Method-level `@llm-rule WHEN/AVOID` comments
- Documentation completeness checks

**Use when:**
- Enterprise applications
- Critical production systems
- High-quality code standards required
- Documentation compliance needed

### Validation Level Selection Guide

#### Development Phase Progression
```
Prototype → MVP → Production → Enterprise
   none   → basic → essential → strict
```

#### Team Size Considerations
- **Solo developer**: `basic` or `essential`
- **Small team (2-5)**: `essential`
- **Medium team (5-15)**: `essential` or `strict`
- **Large team (15+)**: `strict`

#### Application Type Considerations
- **Personal projects**: `basic` or `essential`
- **Client projects**: `essential`
- **SaaS applications**: `essential` or `strict`
- **Enterprise systems**: `strict`
- **Compliance-required**: `strict`

## Contract Registration & Discovery

### Automatic Registration
```typescript
// src/api/myapp/features/myfeature/myfeature.index.ts
export default MyFeatureContract;

// Automatically discovered and registered by:
// 1. Server startup scans src/api/*/features/*/*.index.ts
// 2. Loads contracts into global registry
// 3. Validates during startup (development) or build (production)
```

### Contract Registry Operations
```typescript
import { contractRegistry } from '@/lib/contracts.js';

// Get contract
const contract = contractRegistry.getContract('myapp.myfeature');

// Get summary
const summary = contractRegistry.getContractSummary();

// Generate OpenAPI
const openapi = contractRegistry.generateOpenAPI();
```

## Contract-Driven Development Workflow

### 1. Contract-First Development
```bash
# Generate feature with contract template
npm run generate app:api myapp/myfeature -- --essential

# Contract is created first, implementation follows
```

### 2. Implementation Stack
```
Contract (myfeature.index.ts) →
  ├── Types (myfeature.types.ts)
  ├── Services (myfeature.services.ts)
  ├── Routes (myfeature.routes.ts)
  └── Tests (myfeature.test.ts)
```

### 3. Validation Gates
```bash
# Development validation
npm run validate app:api myapp

# Pre-commit validation
npm run git commit myapp --feat

# Pre-deployment validation
npm run deploy staging
```

## Advanced Contract Features

### Service Communication
```typescript
// Feature A provides services
services: {
  provides: ['UserService', 'AuthService'],
  consumes: []
}

// Feature B consumes services
services: {
  provides: [],
  consumes: ['UserService']  // Dependency on Feature A
}
```

### Event Communication
```typescript
// Feature emits events
events: {
  emits: [{
    namespace: 'user_auth',
    event: 'user.login.success',
    payload: 'UserLoginData',
    description: 'Emitted when user successfully logs in'
  }],
  listens: []
}

// Feature listens to events
events: {
  emits: [],
  listens: [{
    namespace: 'user_auth',
    event: 'user.login.success',
    handler: 'onUserLogin'
  }]
}
```

### File Dependencies
```typescript
dependencies: {
  files: {
    "myfeature.services.ts": {
      appkit: ["util", "logger", "error", "security"],
      external: ["express", "zod"],
      relative: ["./myfeature.types", "../shared/utils"]
    },
    "myfeature.routes.ts": {
      appkit: [],
      external: ["express"],
      relative: ["./myfeature.services"]
    }
  }
}
```

## Validation Commands

### Manual Validation
```bash
# Validate all apps
npm run validate app:api

# Validate specific app
npm run validate app:api myapp

# Validate with debug output
DEBUG=1 npm run validate app:api myapp
```

### Automatic Validation Triggers
```bash
# Pre-commit validation
npm run git commit myapp --feat

# Pre-push validation
npm run git push myapp

# Pre-deployment validation
npm run deploy staging
npm run deploy production
```

### Validation Output
```
✅ Contract validation passed
📊 Validation Summary:
   - Apps: 3
   - Features: 12
   - Validation Level: essential
   - Contracts Valid: 12/12
   - Dependencies Valid: 45/45
   - Services Valid: 8/8
   - Events Valid: 6/6

⚠️  Warnings: 2
   - [weather] Service 'WeatherCache' not consumed by any feature
   - [user] Event 'user.profile.updated' emitted but not consumed

🚀 Ready for deployment
```

## Integration with Development Tools

### TypeScript Integration
- Contracts provide type safety across feature boundaries
- OpenAPI generation ensures API consistency
- Import validation prevents runtime errors

### Testing Integration
- Contract tests validate implementation matches specification
- Cross-feature integration testing
- API endpoint testing from contract definitions

### Documentation Integration
- Contracts serve as living documentation
- Auto-generated API documentation
- OpenAPI/Swagger specification generation

### Git Integration
- Pre-commit validation prevents broken contracts
- Contract changes tracked in version control
- Breaking changes detected automatically

## Best Practices

### Contract Design
- **Start Simple**: Begin with basic contract, add complexity gradually
- **Be Specific**: Use detailed descriptions and clear naming
- **Document Business Context**: Explain why features exist, not just what they do
- **Version Carefully**: Track breaking changes in contract modifications

### Validation Strategy
- **Development**: Use `essential` for balanced speed and quality
- **CI/CD**: Enforce `strict` validation in deployment pipelines  
- **Prototyping**: Use `basic` for rapid iteration
- **Production**: Always validate before deployment

### Team Collaboration
- **Contract Reviews**: Review contract changes as carefully as code changes
- **Breaking Changes**: Coordinate breaking changes across team
- **Documentation**: Keep contract descriptions current and accurate
- **Standards**: Establish team conventions for contract structure

## Troubleshooting

### Common Contract Errors
```bash
# Missing contract export
Error: Contract export not found in myfeature.index.ts
Fix: Ensure 'export default MyFeatureContract;' is present

# Invalid validation level
Error: Unknown validation level 'medium'
Fix: Use one of: none, basic, essential, strict

# Missing dependencies
Error: Service 'UserService' consumed but not provided
Fix: Add UserService to provides array in user feature contract

# API endpoint mismatch
Error: Handler 'UserService.getUsers' not found
Fix: Ensure service method exists and matches contract handler
```

### Validation Failures
```bash
# Fix validation errors systematically:
npm run validate app:api myapp          # See specific errors
# Address each error in contract or implementation
npm run validate app:api myapp          # Verify fixes
```

### Performance Issues
```bash
# Large codebases with many contracts:
# - Use 'none' validation during development
# - Use 'strict' validation only in CI/CD
# - Cache validation results where possible
```

---

**The Result**: Contract-driven development ensures every feature is documented, validated, and consistent before implementation, leading to higher quality applications and better team collaboration.