# Technical Specification
## welcome Implementation Guide

### Version: v1.0.0
### Last Updated: 2025-08-24

***

## 1. Application Overview

| Aspect | Specification |
|--------|---------------|
| **Application Name** | welcome |
| **Framework** | Voila Framework with Express.js |
| **Language** | TypeScript (strict mode) |
| **Architecture** | Contract-driven development |
| **Deployment** | Single server, microservice-ready |
| **Description** | Demo application with hello greeting and status information features |

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

All required technologies are covered by the Voila Framework stack.

***

## 3. Feature Specifications

| Feature | Endpoint Pattern | Description | Priority |
|---------|------------------|-------------|----------|
| **hello** | `GET /api/welcome/hello` | Personalized greeting with name parameter | High |
| **status** | `GET /api/welcome/status` | System status with current time and app details | High |

***

## 4. API Endpoint Requirements

| Endpoint | Method | Input | Output | Validation |
|----------|--------|-------|--------|------------|
| `/api/welcome/hello` | GET | `?name=string` | `{ success: true, data: { greeting: string, name: string, timestamp: string } }` | name: required, 1-50 chars, alphanumeric + spaces |
| `/api/welcome/status` | GET | none | `{ success: true, data: { appName: string, version: string, currentTime: string, uptime: number, status: string } }` | none |

***

## 5. Data Models & Validation

| Model | Schema | Validation Rules |
|-------|--------|------------------|
| **HelloRequest** | `{ name: string }` | name: required, string, min 1 char, max 50 chars, alphanumeric + spaces only |
| **HelloResponse** | `{ greeting: string, name: string, timestamp: string }` | All fields required, greeting must be non-empty |
| **StatusResponse** | `{ appName: string, version: string, currentTime: string, uptime: number, status: string }` | All fields required, uptime must be positive number |

***

## 6. Quality Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| **Test Coverage** | ≥95% | Automated coverage reports |
| **Response Time** | <200ms | Load testing |
| **Error Rate** | <1% | Monitoring dashboards |
| **Uptime** | 99.9% | Health check monitoring |
| **Code Quality** | TypeScript strict mode | Linting and type checking |

- **Input Validation**: All user inputs must be validated using Zod schemas
- **Error Handling**: Standardized error responses with proper HTTP status codes
- **Logging**: All requests and errors logged with structured format

***

## 7. Component Structure

```
src/api/welcome/
├── features/
│   ├── [feature-name]/
│   │   ├── [feature].routes.ts    # Express routes
│   │   ├── [feature].services.ts  # Business logic
│   │   ├── [feature].types.ts     # Zod schemas & TypeScript types
│   │   ├── [feature].test.ts      # Unit tests
│   │   └── [feature].index.ts     # Feature contract
├── spec/
│   └── welcome.api.spec.yml
├── __apitest__/
│   └── welcome-api-tests.xlsx
├── welcome.config.json
└── welcome.readme.md
```

Updated structure for welcome app:
```
src/api/welcome/
├── features/
│   ├── hello/
│   │   ├── hello.routes.ts    # GET /hello endpoint
│   │   ├── hello.services.ts  # Greeting business logic
│   │   ├── hello.types.ts     # HelloRequest/Response schemas
│   │   ├── hello.test.ts      # Unit tests
│   │   └── hello.index.ts     # Hello feature contract
│   └── status/
│       ├── status.routes.ts   # GET /status endpoint
│       ├── status.services.ts # System status logic
│       ├── status.types.ts    # StatusResponse schema
│       ├── status.test.ts     # Unit tests
│       └── status.index.ts    # Status feature contract
├── spec/
│   └── welcome.api.spec.yml
├── __apitest__/
│   └── welcome-api-tests.xlsx
├── welcome.config.json
└── welcome.readme.md
```

***

## 8. VoilaJSX AppKit Integration

| Component | Import | Usage |
|-----------|--------|-------|
| **Utilities** | `import { utilClass } from '@voilajsx/appkit/util'` | Helper functions and utilities |
| **Logging** | `import { loggerClass } from '@voilajsx/appkit/logger'` | Structured logging with request IDs |
| **Error Handling** | `import { errorClass } from '@voilajsx/appkit/error'` | Centralized error management |
| **Security** | `import { securityClass } from '@voilajsx/appkit/security'` | Input validation and sanitization |

All necessary AppKit modules are covered. Focus on:
- **util**: For success response formatting
- **logger**: For request/response logging
- **error**: For business error handling
- **validator**: For input validation with Zod schemas

***

## 9. External Integrations

No external API integrations required. All functionality uses built-in Node.js APIs:

| Service | Purpose | API Details | Error Handling |
|---------|---------|-------------|---------------|
| Node.js Date | Current time | Built-in Date API | Fallback to epoch time if Date fails |
| Process | App uptime | process.uptime() | Fallback to 0 if unavailable |

***

## 10. Development Workflow

| Phase | Command | Description |
|-------|---------|-------------|
| **Generation** | `npm run generate app:api welcome` | Create application structure |
| **Development** | `npm run dev:api` | Start development server |
| **Validation** | `npm run validate app:api welcome` | Validate contracts and structure |
| **Testing** | `npm run test app:api welcome` | Run full test suite |
| **Build** | `npm run build:api` | Build for production |

***

## 11. Implementation Notes

### Implementation Priority
1. Start with hello feature (simpler, establishes patterns)
2. Implement status feature (builds on established patterns)

### Key Implementation Notes
- Use consistent response format across both features
- Implement proper input validation for hello endpoint
- Status endpoint should be lightweight and fast
- Follow Voila Framework contract-driven development
- Ensure proper error handling and logging

### Security Considerations
- Input validation prevents injection attacks
- No authentication required for demo purposes
- Sanitize user input for name parameter
- Rate limiting not required for demo

### Performance Considerations  
- Target response time: <100ms for both endpoints
- Stateless operations for scalability
- Minimal memory footprint
- No caching required for demo

### Error Handling Strategy
- Use VoilaJSX AppKit error classes
- Return proper HTTP status codes (400 for validation, 500 for server errors)
- Log all errors with context
- Return user-friendly error messages

***

## 12. Implementation Workflow

### Feature Implementation Order
**⚠️ CRITICAL: Implement ONE feature at a time in this order:**

1. **hello** (Priority: High, Complexity: Medium)
   - User input validation and processing
   - Establishes API patterns and response formats
   - Foundation for understanding Voila contract patterns
   
2. **status** (Priority: High, Complexity: Low)
   - System information gathering
   - Builds on established response patterns
   - Simpler implementation with no user input

### Per-Feature Definition of Done
Each feature is complete when:
- [ ] Feature generated (`npm run generate app:api welcome/feature`)
- [ ] Contract implemented (VoilaFeatureContract with endpoints)
- [ ] Types implemented (Zod schemas + TypeScript interfaces)
- [ ] Services implemented (business logic with error handling)
- [ ] Routes implemented (Express endpoints with validation)
- [ ] Feature validated (`npm run validate app:api welcome/feature`)
- [ ] Feature tested (`npm run test app:api welcome/feature -- --unittest`)

### Workflow Rules
- **🛑 STOP**: Complete current feature 100% before starting next
- **✅ GATE**: All validation and tests must pass before proceeding
- **📋 TRACK**: Update workflow status after each completed feature

### LLM Development Instructions
- **@llm-rule SEQUENCE**: Follow the feature order exactly as specified
- **@llm-rule STOP**: Do not generate next feature until current is complete
- **@llm-rule VALIDATE**: Run validation and tests before proceeding
- **@llm-rule WORKFLOW**: Use `npm run context workflow:next` to get next step

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
