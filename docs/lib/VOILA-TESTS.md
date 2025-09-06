# Voila Testing Architecture

Complete guide to the unified testing framework in VoilaJSX - from unit tests to Excel-driven E2E workflows.

## Overview

VoilaJSX provides a comprehensive testing ecosystem with 4 distinct layers:
- **Unit Tests** - Individual function/hook testing with mocks
- **API Tests** - Backend endpoint testing with authentication layers
- **Web Tests** - React component and hook integration testing
- **E2E Tests** - End-to-end workflows with Excel-driven business validation

## Testing Commands

### Basic Testing
```bash
# API Testing (Backend)
npm run test app:api greeting                    # All API tests
npm run test app:api greeting -- --unittest     # Unit tests only
npm run test app:api greeting -- --apitest      # API endpoint tests only
npm run test app:api greeting/hello             # Feature-specific tests

# Web Testing (Frontend)
npm run test app:web greeting                    # All web tests
npm run test app:web greeting -- --e2e          # E2E flows only
npm run test app:web greeting -- --excel        # Excel workflows only

# Comprehensive Testing
npm run test app:regression greeting             # API + Web + E2E all together
```

### Excel-Driven E2E Testing
```bash
# Generate Excel test specifications
npm run generate app:web greeting --excel

# Run Excel-driven tests with Playwright
npm run test app:web greeting -- --excel

# View Excel test results (timestamped files)
ls src/web/apps/greeting/__e2etest__/*.xlsx
```

## Architecture Components

### 1. Test Authentication System (`src/lib/test-auth.ts`)

**Purpose**: Provides development/testing JWT tokens with proper browser/server compatibility.

**Key Features**:
- Browser-safe conditional imports (prevents fs module errors in frontend)
- Environment variable fallback with `VITE_` prefix for browser
- Multiple authentication tiers: ADMIN, MODERATOR, USER, SERVICE tokens
- Integration with `npm run generate tokens` for test token generation

**Usage Example**:
```typescript
import { AuthTokenHelpers } from '../lib/test-auth';

// Get specific tokens for testing
const adminToken = AuthTokenHelpers.getAdminToken();        // ADMIN_TENANT
const userToken = AuthTokenHelpers.getUserToken();          // USER_BASIC
const apiToken = AuthTokenHelpers.getApiToken();            // WEBHOOK_SERVICE_API_TOKEN
```

**Authentication Tiers**:
- **PUBLIC**: No authentication required
- **API_KEY**: Service-to-service authentication
- **LOGIN**: User authentication required
- **ADMIN**: Admin-level authentication with role validation

### 2. AppKit Mocking System (`src/lib/test-appkit-mocks.ts`)

**Purpose**: Centralized mock factories for VoilaJSX AppKit dependencies.

**Mock Types**:
- **AppKit Utils**: UUID generation, date formatting, sanitization
- **AppKit Logger**: Structured logging (info, error, warn, debug, trace)
- **AppKit Errors**: Standardized error handling
- **AppKit Auth**: Authentication middleware mocking

**Usage Example**:
```typescript
import { setupAppKitMocks, createSimpleAuthMocks } from '../lib/test-appkit-mocks';

// Framework-level setup (once per test file)
setupAppKitMocks({
  mockApiToken: { keyId: 'test-service', role: 'service' },
  mockUser: { userId: 'test-user-123', role: 'user', level: 'basic' },
  mockAdminUser: { userId: 'test-admin-123', role: 'admin', level: 'tenant' }
});

// Create auth middleware for Express testing
const mockAuth = createSimpleAuthMocks({
  apiToken: { keyId: 'test-service', role: 'service' },
  user: { userId: 'test-user-123', role: 'user', level: 'basic' }
});
```

### 3. Unified Test Runner (`scripts/voila-test.ts`)

**Purpose**: Single CLI interface for all testing operations across the framework.

**Core Functions**:
- **API Testing**: Vitest-based backend testing with compliance reporting
- **Web Testing**: React Testing Library + Playwright integration
- **Excel Workflows**: Business-friendly test specification and results
- **Regression Testing**: Combined API + Web validation pipeline

**Key Features**:
- Excel-based test case generation from YAML specifications
- Timestamped results files with PASS/FAIL/SUSPENDED status tracking
- Cross-browser testing (Chromium, Firefox, WebKit, Mobile Chrome/Safari)
- Workflow failure management with automatic suspension of dependent steps

## Test Types and Structure

### Unit Tests (API)
**Location**: `src/api/{app}/features/{feature}/{feature}.test.ts`

**Focus**: Individual service functions with comprehensive AppKit mocking.

**Example Structure**:
```typescript
// src/api/greeting/features/hello/hello.test.ts
describe('Hello Feature Authentication Tests', () => {
  it('should return default greeting (PUBLIC - no auth)', async () => {
    const response = await request(app)
      .get('/api/greeting/hello')
      .expect(200);
    // Test public endpoint
  });

  it('should return personalized greeting (ADMIN required)', async () => {
    const response = await request(app)
      .get('/api/greeting/hello/john')
      .expect(200);
    // Test admin-protected endpoint
  });
});
```

### Web Tests (Frontend)
**Location**: `src/web/apps/{app}/features/{feature}/tests/{feature}.test.ts`

**Focus**: React hooks, component integration, and state management.

**Example Structure**:
```typescript
// src/web/apps/greeting/features/hello/tests/hello.test.ts
describe('useHello Hook - Core Tests', () => {
  it('should return correct initial structure with hardcoded tokens', async () => {
    const { useHello } = await import('../hooks/useHello');
    const { result } = renderHook(() => useHello(), { wrapper: createWrapper() });
    
    // Test hook structure
    expect(result.current).toHaveProperty('greetings');
    expect(result.current).toHaveProperty('auth');
    expect(result.current).toHaveProperty('actions');
  });
});
```

### E2E Tests (End-to-End)
**Location**: `src/web/apps/{app}/__e2etest__/`

**Dual Approach**:
1. **Excel Workflows** (`{app}-excel-workflows.spec.ts`) - Business stakeholder validation
2. **E2E Flows** (`{app}-e2e-flows.spec.ts`) - Technical integration flows

**Workflow Structure**:
- **Workflow ID**: Unique identifier (WF001, WF002, etc.)
- **Test Cases**: Sequential steps with action/input/expected validation
- **Status Tracking**: PASS/FAIL/SUSPENDED with failure cascade handling
- **Screenshots**: Automatic capture for Excel reporting

## Excel-Driven Testing Workflow

### 1. Specification Definition
Define test workflows in `src/web/apps/{app}/spec/{app}.web.spec.yml`:

```yaml
excel_workflows:
  - workflow_id: "WF001"
    name: "Basic Hello Page Loading"
    test_cases:
      - test_id: "TC001"
        flow_step: "navigate"
        route: "/greeting/hello"
        action: "navigate"
        input: "-"
        expected: "Page loads with correct SEO title"
        type: "navigation"
```

### 2. Excel Generation
```bash
npm run generate app:web greeting --excel
```
**Creates**:
- `greeting-excel-workflows-{timestamp}.xlsx` - Business-friendly test specification
- `greeting-excel-workflows.spec.ts` - Corresponding Playwright tests

### 3. Test Execution
```bash
npm run test app:web greeting -- --excel
```
**Produces**:
- `greeting.excel-workflows-results-{timestamp}.xlsx` - Results with PASS/FAIL status
- Screenshots in `test-results/` directory for each test case
- Workflow failure cascade (if TC001 fails, mark TC002-TC005 as SUSPENDED)

### 4. Business Review
Stakeholders can:
- Review Excel files with clear PASS/FAIL status
- View screenshots for visual validation
- Update Expected Results column for test case refinement
- Add Notes for failed test cases

## Testing Best Practices

### Authentication Testing
```typescript
// Test all authentication tiers
describe('Authentication Layers', () => {
  it('PUBLIC endpoints (no auth)', () => { /* test */ });
  it('API_KEY endpoints (service auth)', () => { /* test */ });
  it('LOGIN endpoints (user auth)', () => { /* test */ });
  it('ADMIN endpoints (admin auth)', () => { /* test */ });
});
```

### Mock Strategy
```typescript
// Use centralized mocks
import { setupAppKitMocks } from '../lib/test-appkit-mocks';

// Set up once per test file
setupAppKitMocks({ /* configuration */ });

// Create specific mocks for individual tests
const mockAuth = createSimpleAuthMocks({ /* test-specific config */ });
```

### Excel Test Design
```yaml
# Keep workflows focused (3-5 test cases per workflow)
# Use sequential flow_step numbering
# Include both positive and negative test cases
# Provide clear expected outcomes for business validation
```

## Regression Testing

**Command**: `npm run test app:regression greeting`

**Phases**:
1. **API Phase**: Run all API tests (unit + integration + compliance)
2. **Web Phase**: Run all web tests (unit + E2E workflows)
3. **Reporting**: Combined results with overall PASS/FAIL status

**Use Cases**:
- Pre-deployment validation
- Feature branch testing
- Continuous integration pipelines
- Release candidate validation

## Integration with Development Workflow

### 1. Feature Development
```bash
# Start with unit tests
npm run test app:api greeting/hello -- --unittest

# Add API integration tests
npm run test app:api greeting/hello -- --apitest

# Create web tests for hooks/components
npm run test app:web greeting

# Generate E2E specifications
npm run generate app:web greeting --excel
```

### 2. Quality Assurance
```bash
# Run comprehensive testing
npm run test app:regression greeting

# Business stakeholder validation
# Review Excel results files
# Update specifications based on feedback
```

### 3. Production Readiness
```bash
# Final regression testing
npm run test app:regression greeting

# Compliance validation
npm run test app:api greeting -- --compliance

# Cross-browser E2E validation
npm run test app:web greeting -- --excel
```

## File Structure Overview

```
src/
├── api/
│   └── greeting/
│       └── features/
│           └── hello/
│               └── hello.test.ts              # API unit tests
├── web/
│   └── apps/
│       └── greeting/
│           ├── __e2etest__/
│           │   ├── greeting-excel-workflows.spec.ts
│           │   ├── greeting-e2e-flows.spec.ts
│           │   └── *.xlsx                     # Excel results files
│           ├── features/
│           │   └── hello/
│           │       └── tests/
│           │           └── hello.test.ts      # Web unit tests
│           └── spec/
│               └── greeting.web.spec.yml      # E2E specifications
├── lib/
│   ├── test-auth.ts                          # Authentication system
│   └── test-appkit-mocks.ts                  # Mock utilities
└── scripts/
    └── voila-test.ts                         # Unified test runner
```

## Advanced Features

### Cross-Browser Testing
Tests run on multiple browsers automatically:
- Chromium (Desktop)
- Firefox (Desktop)  
- WebKit (Safari)
- Mobile Chrome (Android)
- Mobile Safari (iOS)

### Workflow Failure Management
When a test case fails:
- Mark current step as FAILED
- Mark subsequent dependent steps as SUSPENDED
- Continue with next independent workflow
- Provide failure cascade reporting in Excel results

### Screenshot Integration
- Automatic screenshot capture for each test case
- Screenshots saved with test case ID naming
- Excel results include screenshot file references
- Visual regression detection capability

### Dynamic Route Testing
Support for parameterized routes:
- `/greeting/hello/:name` - Single parameter
- `/greeting/hello/:name/:new` - Multiple parameters
- Dynamic parameter extraction and validation

This testing architecture provides comprehensive coverage from unit-level isolation to business-stakeholder validation, ensuring both technical correctness and user acceptance.