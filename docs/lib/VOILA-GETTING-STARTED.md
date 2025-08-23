# Getting Started with Voila Framework

## Overview

Voila Framework is a contract-driven development platform that enables seamless monolithic-to-microservices architecture evolution. It provides structured planning, automated code generation, and comprehensive testing tools for TypeScript/Express.js applications.

## Core Philosophy

- **Human-Controlled Planning**: AI-assisted but human-approved requirements
- **Contract-Driven Development**: Feature contracts define behavior before implementation  
- **Auto-Discovery Architecture**: Framework automatically discovers and loads features
- **Quality-First Approach**: 95% test coverage with multi-level validation

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Installation

```bash
git clone <voila-framework-repo>
cd voila
npm install
```

### Your First App

```bash
# 1. Planning & Approval
npm run plan start myapp "simple greeting service"
npm run plan review myapp
npm run plan approve myapp

# 2. Generate app structure
npm run generate app:api myapp

# 3. Create API specification (manual/AI-assisted)
# Edit: src/api/myapp/spec/myapp.api.spec.yml

# 4. Feature development (contract-driven, repeat for each feature)
npm run generate app:api myapp/greeting
# Define contract first: greeting.index.ts (VoilaFeatureContract)
# Implement in sequence: types.ts → services.ts → routes.ts → models.ts → test.ts
npm run validate app:api myapp/greeting
npm run test app:api myapp/greeting -- --unittest

# 5. Integration testing
npm run test app:api myapp

# 6. Start development server
npm run dev:api
```

---

## Framework Commands

### Planning Commands

| Command | Description | Example |
|---------|-------------|---------|
| `npm run plan start <app> "<description>"` | Start planning with business questions | `npm run plan start greeting "multi-language greetings"` |
| `npm run plan review <app>` | Review generated planning documents | `npm run plan review greeting` |
| `npm run plan approve <app>` | Approve plans for implementation | `npm run plan approve greeting` |

### Development Commands

| Command | Description | Example |
|---------|-------------|---------|
| `npm run generate app:api <app>` | Generate application structure | `npm run generate app:api greeting` |
| `npm run dev:api` | Start development server | `npm run dev:api` |
| `npm run validate app:api <app>` | Validate contracts and structure | `npm run validate app:api greeting` |
| `npm run test app:api <app>` | Run comprehensive test suite | `npm run test app:api greeting` |
| `npm run build:api` | Build for production | `npm run build:api` |

---

## Project Structure

```
voila/
├── src/api/                    # API applications
│   └── {app-name}/            # Individual application
│       ├── features/          # Feature modules
│       ├── spec/             # API specifications
│       ├── __apitest__/      # API test files
│       ├── {app}.config.json # App configuration
│       └── {app}.readme.md   # App documentation
├── docs/
│   ├── lib/                  # Framework documentation
│   ├── app/                  # Application documentation
│   └── planning/             # Planning documents
├── scripts/                  # Framework tools
│   ├── voila-plan.ts        # Planning assistant
│   ├── voila-generate.ts    # Code generator
│   ├── voila-validate.ts    # Contract validator
│   └── voila-test.ts        # Test runner
└── src/server.ts            # Main server entry
```

---

## Feature Development Workflow

### 1. Planning Phase

**Human-Controlled Planning with AI Assistance**

```bash
# Start planning with business questions
npm run plan start myapp "description of your app"
```

The planning assistant will ask discovery questions:
- What is the primary business purpose?
- Who are the target users?
- What are the core features needed?
- What are the key constraints?
- What defines success?

**Generated Planning Documents:**
- `docs/planning/{app}/{app}-business-requirements-v1.md`
- `docs/planning/{app}/{app}-technical-specification-v1.md`

### 2. Review & Approval

```bash
# Review generated documents
npm run plan review myapp

# Approve for implementation (required!)
npm run plan approve myapp
```

**Approval Gates:**
- ✅ Business requirements approved
- ✅ Technical specification approved
- 🔒 Plans locked for implementation

### 3. Application Structure Generation

```bash
# Generate application boilerplate structure
npm run generate app:api myapp
```

**Generated Boilerplate:**
```
src/api/myapp/
├── features/                     # Empty - features added later
├── spec/myapp.api.spec.yml      # Template OpenAPI spec  
├── __apitest__/                 # Empty - tests added later
├── myapp.config.json           # Basic configuration
└── myapp.readme.md             # Documentation template
```

### 4. API Specification Development

**CRITICAL: Create detailed API spec based on technical specification**

The API specification must be manually created (by human or AI agent) based on the approved technical specification document.

```bash
# Edit the generated spec file
# src/api/myapp/spec/myapp.api.spec.yml
```

**Required Specification Elements:**
- All endpoints from technical specification
- Request/response schemas with validation rules
- Error response definitions
- Authentication requirements
- Rate limiting specifications

### 5. Feature-by-Feature Development

**For Each Feature in Technical Specification:**

#### 5a. Generate Feature Structure
```bash
# Generate individual feature boilerplate
npm run generate app:api myapp/feature-name
```

**Generated Files (templates only):**
- `feature-name.index.ts` - Empty contract template
- `feature-name.types.ts` - Empty types/schemas template
- `feature-name.services.ts` - Empty services template
- `feature-name.routes.ts` - Empty routes template
- `feature-name.models.ts` - Empty database models template (if needed)
- `feature-name.test.ts` - Empty test template

#### 5b. Define Feature Contract First
**CRITICAL: Start with `feature-name.index.ts`**

Implement the complete VoilaFeatureContract based on API specification:
```typescript
import type { VoilaFeatureContract } from '@/lib/contracts.js';

export const WeatherFeatureContract: VoilaFeatureContract = {
  name: 'weather',
  app: 'climate',
  description: 'Current weather conditions with external API integration',
  
  api: {
    basePath: '/api/climate/weather',
    endpoints: [
      {
        method: 'GET',
        path: '/current',
        handler: 'WeatherService.getCurrentWeather',
        summary: 'Get current weather by city or coordinates'
      }
    ]
  },
  
  dependencies: {
    files: {
      "weather.services.ts": {
        appkit: ["util", "logger", "error", "security", "cache"],
        external: ["node-fetch"]
      },
      "weather.types.ts": {
        external: ["zod"]
      }
    }
  },
  
  provides: {
    services: ['WeatherService'],
    routes: ['/api/climate/weather/current'],
    types: ['WeatherResponse', 'WeatherData']
  }
};
```

#### 5c. Implement Files in Contract-Driven Sequence

**Implementation Order (contract drives everything):**

1. **`feature-name.types.ts`** - TypeScript types and Zod validation schemas
2. **`feature-name.services.ts`** - Business logic implementing contract handlers
3. **`feature-name.routes.ts`** - Express routes implementing contract endpoints
4. **`feature-name.models.ts`** - Database models (if database interaction needed)
5. **`feature-name.test.ts`** - Unit tests for all contract functionality

#### 5d. Validate Contract Compliance
```bash
# Validate that implementation matches contract
npm run validate app:api myapp/feature-name
```

**Contract Validation Ensures:**
- ✅ Feature contract properly structured and exported
- ✅ All declared endpoints are implemented in routes
- ✅ All declared handlers exist in services
- ✅ Dependencies are correctly imported
- ✅ Provided services and types are exported

#### 5e. Run Feature Unit Tests
```bash
# Run unit tests for specific feature
npm run test app:api myapp/feature-name -- --unittest
```

**Unit Test Requirements:**
- ✅ 95% code coverage minimum
- ✅ All contract handlers tested
- ✅ All endpoint scenarios covered
- ✅ Error handling for all contract cases
- ✅ External API integration mocks

#### 5e. Repeat for All Features
**Complete steps 5a-5d for each feature before proceeding**

### 6. Application Integration Testing

**After All Features Are Complete:**

```bash
# Run comprehensive test suite for entire application
npm run test app:api myapp
```

**Test Suite Includes:**
- ✅ Unit tests for all features (95% coverage)
- ✅ API integration tests (Excel-based)
- ✅ Contract compliance validation
- ✅ Cross-feature integration tests

**Compliance Update:**
- Application configuration updated with test results
- Overall compliance status calculated
- Test results Excel files generated

### 7. Development Server & Validation

```bash
# Start development server (only after all tests pass)
npm run dev:api

# Final validation of running application
npm run validate app:api myapp

# Verify health endpoints
curl http://localhost:3001/api/myapp/health
```

---

## Contract-Driven Development

### Feature Contract Structure

Every feature must export a `VoilaFeatureContract`:

```typescript
// greeting/greeting.index.ts
import type { VoilaFeatureContract } from '@voilajsx/appkit';

export const greetingContract: VoilaFeatureContract = {
  feature: 'greeting',
  version: '1.0.0',
  
  // API endpoints
  endpoints: [
    {
      path: '/api/myapp/hello',
      method: 'GET',
      handler: 'getGreeting'
    }
  ],
  
  // Dependencies
  imports: [
    'greeting.services',
    'greeting.models'
  ],
  
  // Exports
  provides: [
    'GreetingService',
    'GreetingRequest',
    'GreetingResponse'
  ],
  
  // Test requirements
  tests: {
    unit: ['greeting.test.ts'],
    coverage: 95
  }
};
```

### Auto-Discovery

The framework automatically:
- ✅ Discovers feature contracts
- ✅ Validates contract compliance
- ✅ Mounts routes based on endpoints
- ✅ Loads dependencies in correct order
- ✅ Provides type safety across features

---

## VoilaJSX AppKit Integration

### Required Imports

```typescript
// Enterprise patterns from VoilaJSX AppKit
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
```

### Structured Logging

```typescript
// Use logger with request IDs
const logger = loggerClass.create('greeting-service');

export async function getGreeting(req: Request, res: Response) {
  const requestId = utilClass.generateId();
  
  logger.info('Processing greeting request', { 
    requestId, 
    name: req.query.name 
  });
  
  // Implementation...
}
```

### Error Handling

```typescript
// Centralized error management
try {
  const result = await greetingService.process(request);
  res.json(result);
} catch (error) {
  errorClass.handleApiError(error, res, {
    requestId,
    context: 'greeting-processing'
  });
}
```

---

## Testing Strategy

### Multi-Level Testing

1. **Unit Tests** (Vitest)
   - Feature-specific business logic
   - Minimum 95% coverage

2. **API Tests** (Excel-based)
   - End-to-end API validation
   - Request/response testing

3. **Contract Tests**
   - Contract compliance validation
   - Feature integration testing

### Example Unit Test

```typescript
// greeting.test.ts
import { describe, it, expect } from 'vitest';
import { greetingService } from './greeting.services';

describe('GreetingService', () => {
  it('should return greeting in English by default', async () => {
    const result = await greetingService.getGreeting({ name: 'World' });
    
    expect(result.message).toBe('Hello, World!');
    expect(result.language).toBe('en');
  });
  
  it('should support multiple languages', async () => {
    const result = await greetingService.getGreeting({ 
      name: 'Mundo', 
      language: 'es' 
    });
    
    expect(result.message).toBe('¡Hola, Mundo!');
    expect(result.language).toBe('es');
  });
});
```

---

## Production Deployment

### Build Process

```bash
# Build application
npm run build:api

# Start production server
npm start
```

### Health Monitoring

Every app automatically gets:
- ✅ Health check endpoint: `GET /api/{app}/health`
- ✅ Structured request/response logging
- ✅ Performance metrics collection
- ✅ Error tracking and reporting

### Production Checklist

- [ ] All tests passing (95% coverage)
- [ ] Contract validation successful
- [ ] API tests completed
- [ ] Performance requirements met (<200ms)
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Health checks working

---

## Best Practices

### Code Organization

- ✅ One feature per directory
- ✅ Contracts define all interfaces and dependencies
- ✅ Types define TypeScript types and Zod validation schemas
- ✅ Services contain business logic and external API calls
- ✅ Routes handle HTTP concerns and request/response mapping
- ✅ Models handle database interactions (when needed)

### Development Workflow

- ✅ Always start with planning (`npm run plan start`)
- ✅ Create detailed API specification before features
- ✅ **Contract-first implementation**: Define VoilaFeatureContract before coding
- ✅ Follow strict implementation order: contract → types → services → routes → models → tests
- ✅ Validate contracts after each feature (`npm run validate`)
- ✅ Maintain 95% test coverage per feature
- ✅ Use structured logging throughout

### API Design

- ✅ Follow RESTful patterns: `/api/{app}/{feature}`
- ✅ Use proper HTTP status codes
- ✅ Validate all inputs with Zod schemas
- ✅ Return consistent JSON structures
- ✅ Handle errors gracefully

---

## Troubleshooting

### Common Issues

**Planning not approved:**
```bash
# Error: Cannot generate - planning not approved
npm run plan approve myapp
```

**Contract validation fails:**
```bash
# Check contract structure and exports
npm run validate app:api myapp
```

**Tests failing:**
```bash
# Run specific test suite
npm run test app:api myapp
```

**Development server issues:**
```bash
# Check port conflicts
npm run dev:api
# Default: http://localhost:3000
```

### Debug Mode

```bash
# Enable detailed logging
DEBUG=voila:* npm run dev:api
```

---

## Learning Path

### 1. Start Simple

Create a basic greeting service following the complete workflow:
```bash
# Complete planning cycle
npm run plan start hello "simple greeting app"
npm run plan approve hello
npm run generate app:api hello

# Create API spec manually
# Edit: src/api/hello/spec/hello.api.spec.yml

# Implement single feature (contract-first)
npm run generate app:api hello/greeting
# 1. Define contract: greeting.index.ts (VoilaFeatureContract)
# 2. Implement: types.ts → services.ts → routes.ts → models.ts → test.ts  
npm run validate app:api hello/greeting
npm run test app:api hello/greeting -- --unittest
```

### 2. Multi-Feature Development

Practice feature-by-feature workflow:
```bash
# Add second feature (contract-first)
npm run generate app:api hello/echo
# 1. Define contract: echo.index.ts
# 2. Implement: types.ts → services.ts → routes.ts → models.ts → test.ts
npm run validate app:api hello/echo
npm run test app:api hello/echo -- --unittest

# Integration testing after all features
npm run test app:api hello
npm run dev:api
```

### 3. Advanced Topics

- Contract validation strategies
- External API integration patterns  
- Caching and performance optimization
- Microservice extraction planning
- Production monitoring setup

---

## Next Steps

- 📖 Read [VOILA-ARCHITECTURE.md](./VOILA-ARCHITECTURE.md) for deep architecture insights
- 🛠️ Check [APPKIT_LLM_GUIDE.md](./APPKIT_LLM_GUIDE.md) for VoilaJSX AppKit patterns
- 💬 Review [VOILA-COMMENT-GUIDELINES.md](./VOILA-COMMENT-GUIDELINES.md) for code standards

## Support

- Framework issues: Create GitHub issue
- Feature requests: Discussion forum
- Documentation: Submit PR for improvements

---

**Welcome to contract-driven development with Voila Framework!** 🎉