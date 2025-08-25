# Technical Specification
## converter Implementation Guide

### Version: v1.0.0
### Last Updated: 2025-08-25

***

## 1. Application Overview

| Aspect | Specification |
|--------|---------------|
| **Application Name** | converter |
| **Framework** | Voila Framework with Express.js |
| **Language** | TypeScript (strict mode) |
| **Architecture** | Contract-driven development |
| **Deployment** | Single server, microservice-ready |
| **Description** | An application to convert temperatures between Celsius and Fahrenheit |

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

***

## 3. Feature Specifications

| Feature | Endpoint Pattern | Description | Priority |
|---------|------------------|-------------|----------|
| Celsius to Fahrenheit | `POST /celsius-to-fahrenheit` | Converts a temperature from Celsius to Fahrenheit. | High |
| Fahrenheit to Celsius | `POST /fahrenheit-to-celsius` | Converts a temperature from Fahrenheit to Celsius. | High |

***

## 4. API Endpoint Requirements

| Endpoint | Method | Input | Output | Validation |
|----------|--------|-------|--------|------------|
| `/api/converter/celsius-to-fahrenheit` | POST | `{"temperature": number}` | `{"temperature": number}` | Input must be a valid number. |
| `/api/converter/fahrenheit-to-celsius` | POST | `{"temperature": number}` | `{"temperature": number}` | Input must be a valid number. |

***

## 5. Data Models & Validation

| Model | Schema | Validation Rules |
|-------|--------|------------------|
| **TemperatureRequest** | `{ "temperature": z.number() }` | `temperature` must be a number. |
| **TemperatureResponse** | `{ "temperature": z.number() }` | `temperature` must be a number. |

***

## 6. Quality Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| **Test Coverage** | ≥95% | Automated coverage reports |
| **Response Time** | <200ms | Load testing |
| **Error Rate** | <1% | Monitoring dashboards |
| **Uptime** | 99.9% | Health check monitoring |
| **Code Quality** | TypeScript strict mode | Linting and type checking |

***

## 7. Component Structure

```
src/api/converter/
├── features/
│   ├── celsius-to-fahrenheit/
│   │   ├── celsius-to-fahrenheit.routes.ts
│   │   ├── celsius-to-fahrenheit.services.ts
│   │   ├── celsius-to-fahrenheit.types.ts
│   │   ├── celsius-to-fahrenheit.test.ts
│   │   └── celsius-to-fahrenheit.index.ts
│   ├── fahrenheit-to-celsius/
│   │   ├── fahrenheit-to-celsius.routes.ts
│   │   ├── fahrenheit-to-celsius.services.ts
│   │   ├── fahrenheit-to-celsius.types.ts
│   │   ├── fahrenheit-to-celsius.test.ts
│   │   └── fahrenheit-to-celsius.index.ts
├── spec/
│   └── converter.api.spec.yml
├── __apitest__/
│   └── converter-api-tests.xlsx
├── converter.config.json
└── converter.readme.md
```

***

## 8. VoilaJSX AppKit Integration

| Component | Import | Usage |
|-----------|--------|-------|
| **Utilities** | `import { util } from '@voilajsx/appkit'` | Helper functions and utilities |
| **Logging** | `import { logger } from '@voilajsx/appkit'` | Structured logging with request IDs |
| **Error Handling** | `import { error } from '@voilajsx/appkit'` | Centralized error management |
| **Validation** | `import { validator } from '@voilajsx/appkit'` | Input validation and sanitization |

***

## 9. External Integrations

There are no external API integrations for this application.

***

## 10. Development Workflow

| Phase | Command | Description |
|-------|---------|-------------|
| **Generation** | `npm run generate app:api converter` | Create application structure |
| **Development** | `npm run dev:api` | Start development server |
| **Validation** | `npm run validate app:api converter` | Validate contracts and structure |
| **Testing** | `npm run test app:api converter` | Run full test suite |
| **Build** | `npm run build:api` | Build for production |

***

## 11. Implementation Notes

### Security Considerations
- All input will be validated to ensure it is of the correct type.

### Performance Considerations
- The conversion logic is simple and should not have any performance issues.

### Error Handling Strategy
- Errors will be handled by the Voila framework and returned as JSON objects with a 400 status code.

***

## 12. Implementation Workflow

### Feature Implementation Order
**⚠️ CRITICAL: Implement ONE feature at a time in this order:**

1. **celsius-to-fahrenheit** (Priority: High, Complexity: Low)
   - Implement the Celsius to Fahrenheit conversion.
2. **fahrenheit-to-celsius** (Priority: High, Complexity: Low)
   - Implement the Fahrenheit to Celsius conversion.

### Per-Feature Definition of Done
Each feature is complete when:
- [ ] Feature generated (`npm run generate app:api converter/feature`)
- [ ] Contract implemented (VoilaFeatureContract with endpoints)
- [ ] Types implemented (Zod schemas + TypeScript interfaces)
- [ ] Services implemented (business logic with error handling)
- [ ] Routes implemented (Express endpoints with validation)
- [ ] Feature validated (`npm run validate app:api converter/feature`)
- [ ] Feature tested (`npm run test app:api converter/feature -- --unittest`)

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
- 📋 Architecture design approved
- 📋 Technology stack confirmed
- 📋 Quality requirements defined
- 📋 Implementation approach validated

### Development Ready
**STATUS: APPROVED**

**Note:** Complete all [FILL_IN] sections, then change STATUS to APPROVED and run generation.

***