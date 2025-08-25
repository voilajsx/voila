# Technical Specification
## helloworld Implementation Guide

### Version: v1.0.0
### Last Updated: 2025-08-25

***

## 1. Application Overview

| Aspect | Specification |
|--------|---------------|
| **Application Name** | helloworld |
| **Framework** | Voila Framework with Express.js |
| **Language** | TypeScript (strict mode) |
| **Architecture** | Contract-driven development |
| **Deployment** | Single server, microservice-ready |
| **Description** | Simple demo app that prints hello world |

***

## 2. Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Backend Framework** | Express.js | Web application framework |
| **Language** | TypeScript | Type safety and development experience |
| **Validation** | Zod schemas | Runtime type validation |
| **Testing Framework** | Vitest | Unit and integration testing |
| **API Testing** | Excel-based | Comprehensive API validation |
| **Logging** | VoilaJSX AppKit | Structured application logging |
| **Security** | VoilaJSX AppKit | Input validation and sanitization |

No additional technologies required - using core framework stack only.

***

## 3. Feature Specifications

| Feature | Endpoint Pattern | Description | Priority |
|---------|------------------|-------------|----------|
| **Hello** | `GET /api/helloworld/hello` | Returns simple "Hello World" message | High |
| **Greeting** | `GET /api/helloworld/greeting` | Returns personalized greeting with optional name | High |
| **Status** | `GET /api/helloworld/status` | Health check endpoint | Medium |

***

## 4. API Endpoint Requirements

| Endpoint | Method | Input | Output | Validation |
|----------|--------|-------|-----------|------------|
| `/api/helloworld/hello` | GET | None | `{ success: true, data: { message: "Hello World" } }` | None |
| `/api/helloworld/greeting` | GET | `?name=string` | `{ success: true, data: { message: "Hello, {name}!" } }` | Name: 1-50 chars, alphanumeric |
| `/api/helloworld/status` | GET | None | `{ success: true, data: { status: "healthy", timestamp: string } }` | None |

***

## 5. Data Models & Validation

| Model | Schema | Validation Rules |
|-------|--------|------------------|
| **GreetingRequest** | `{ name?: string }` | Optional name, 1-50 characters, letters/numbers only |
| **HelloResponse** | `{ message: string }` | Always "Hello World" |
| **GreetingResponse** | `{ message: string }` | "Hello, {name}!" or "Hello World" if no name |
| **StatusResponse** | `{ status: string, timestamp: string }` | Status always "healthy", timestamp in ISO format |

***

## 6. Quality Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| **Test Coverage** | ≥95% | Automated coverage reports |
| **Response Time** | <200ms | Load testing |
| **Error Rate** | <1% | Monitoring dashboards |
| **Uptime** | 99.9% | Health check monitoring |
| **Code Quality** | TypeScript strict mode | Linting and type checking |

- **Documentation**: Comprehensive JSDoc comments for all functions
- **Contract validation**: All endpoints must match VoilaFeatureContract
- **Error handling**: Graceful handling of invalid inputs

***

## 7. Component Structure

```
src/api/helloworld/
├── features/
│   ├── [feature-name]/
│   │   ├── [feature].routes.ts    # Express routes
│   │   ├── [feature].services.ts  # Business logic
│   │   ├── [feature].types.ts     # Zod schemas & TypeScript types
│   │   ├── [feature].test.ts      # Unit tests
│   │   └── [feature].index.ts     # Feature contract
├── spec/
│   └── helloworld.api.spec.yml
├── __apitest__/
│   └── helloworld-api-tests.xlsx
├── helloworld.config.json
└── helloworld.readme.md
```

Updated structure for helloworld features:
```
src/api/helloworld/
├── features/
│   ├── hello/
│   │   ├── hello.routes.ts      # Hello World endpoint
│   │   ├── hello.services.ts    # Hello World service logic
│   │   ├── hello.types.ts       # Hello World schemas
│   │   ├── hello.test.ts        # Hello World tests
│   │   └── hello.index.ts       # Hello World contract
│   ├── greeting/
│   │   ├── greeting.routes.ts   # Personalized greeting endpoint
│   │   ├── greeting.services.ts # Greeting service with name validation
│   │   ├── greeting.types.ts    # Greeting request/response schemas
│   │   ├── greeting.test.ts     # Greeting tests
│   │   └── greeting.index.ts    # Greeting contract
│   └── status/
│       ├── status.routes.ts     # Health check endpoint
│       ├── status.services.ts   # Status service logic
│       ├── status.types.ts      # Status response schema
│       ├── status.test.ts       # Status tests
│       └── status.index.ts      # Status contract
```

***

## 8. VoilaJSX AppKit Integration

| Component | Import | Usage |
|-----------|--------|-------|
| **Utilities** | `import { utilClass } from '@voilajsx/appkit/util'` | Helper functions and utilities |
| **Logging** | `import { loggerClass } from '@voilajsx/appkit/logger'` | Structured logging with request IDs |
| **Error Handling** | `import { errorClass } from '@voilajsx/appkit/error'` | Centralized error management |
| **Security** | `import { securityClass } from '@voilajsx/appkit/security'` | Input validation and sanitization |

Primary modules needed:
- **util**: For success responses and data formatting
- **validator**: For input validation using Zod schemas
- **logger**: For request logging and debugging
- **error**: For consistent error handling

***

## 9. External Integrations

No external integrations required - this is a self-contained demo application.

***

## 10. Development Workflow

| Phase | Command | Description |
|-------|---------|-------------|
| **Generation** | `npm run generate app:api helloworld` | Create application structure |
| **Development** | `npm run dev:api` | Start development server |
| **Validation** | `npm run validate app:api helloworld` | Validate contracts and structure |
| **Testing** | `npm run test app:api helloworld` | Run full test suite |
| **Build** | `npm run build:api` | Build for production |

***

## 11. Implementation Notes

### Key Implementation Points
- Use VoilaJSX AppKit patterns consistently
- Follow contract-driven development approach
- Implement proper error handling for all endpoints
- Ensure all responses follow standard format
- Write comprehensive unit tests for each feature

### Security Considerations
- Input sanitization for greeting names
- No sensitive data in responses
- Standard Express.js security headers
- Input length validation to prevent DoS

### Performance Considerations  
- Sub-100ms response times for all endpoints
- Minimal memory usage (stateless operations)
- No caching required for simple responses

### Error Handling Strategy
- Use VoilaJSX error classes for consistent error handling
- Return proper HTTP status codes (400, 500)
- Log all errors with context for debugging
- Never expose internal error details to clients

***

## 12. Implementation Workflow

### Feature Implementation Order
**⚠️ CRITICAL: Implement ONE feature at a time in this order:**

1. **hello** (Priority: High, Complexity: Low)
   - Simplest endpoint to establish basic patterns
   - Foundation for understanding Voila contract structure
   - No input validation required
   
2. **status** (Priority: Medium, Complexity: Low)  
   - Health check endpoint with timestamp generation
   - Builds on hello patterns with dynamic data
   - Introduces time-based responses
   
3. **greeting** (Priority: High, Complexity: Medium)
   - Personalized greeting with input validation
   - Most complex feature with parameter handling
   - Demonstrates Zod validation and error handling

### Per-Feature Definition of Done
Each feature is complete when:
- [ ] Feature generated (`npm run generate app:api helloworld/feature`)
- [ ] Contract implemented (VoilaFeatureContract with endpoints)
- [ ] Types implemented (Zod schemas + TypeScript interfaces)
- [ ] Services implemented (business logic with error handling)
- [ ] Routes implemented (Express endpoints with validation)
- [ ] Feature validated (`npm run validate app:api helloworld/feature`)
- [ ] Feature tested (`npm run test app:api helloworld/feature -- --unittest`)

### Workflow Rules
- **🛑 STOP**: Complete current feature 100% before starting next
- **✅ GATE**: All validation and tests must pass before proceeding
- **📋 TRACK**: Update workflow status after each completed feature

### LLM Development Instructions
- **@llm-rule SEQUENCE**: Follow the feature order exactly as specified
- **@llm-rule STOP**: Do not generate next feature until current is complete
- **@llm-rule VALIDATE**: Run validation and tests before proceeding
- **@llm-rule WORKFLOW**: Use `npm run context next` to get next step

***

## 13. Implementation Approval

### Technical Review Status
- 📋 Architecture design under review
- 📋 Technology stack pending confirmation  
- 📋 Quality requirements being defined
- 📋 Implementation approach pending validation

### Development Ready
**STATUS: APPROVED**

**Note:** Complete all [FILL_IN] sections, then change STATUS to APPROVED and run generation.

***
