# Voila Framework Architecture
**Contract-Driven Development Framework with Auto-Discovery and Enterprise Integration**

## Table of Contents
- [Core Philosophy](#core-philosophy)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [App-Centric Organization](#app-centric-organization)
- [Feature-Based Development](#feature-based-development)
- [Contract System](#contract-system)
- [Development Workflow](#development-workflow)
- [Testing Strategy](#testing-strategy)
- [Developer Experience](#developer-experience)
- [Framework Benefits](#framework-benefits)
- [Current Implementation Status](#current-implementation-status)

---

## Core Philosophy

Voila is a **production-ready framework** for teams who need:

### 1. **Contract-Driven Development**
- VoilaFeatureContract system ensures API consistency
- Validation levels: strict/basic/none for different development phases
- Auto-generated OpenAPI specifications from contracts
- Breaking change prevention through contract validation

### 2. **Auto-Discovery Architecture**
- Zero-configuration route mounting based on filesystem conventions
- Automatic feature detection and loading
- Contract validation during route mounting
- Clean separation between API and web layers

### 3. **Enterprise-Ready Patterns**
- VoilaJSX AppKit integration for logging, security, error handling
- Excel-based API testing for business-friendly test management
- Feature flagging and environment-based configuration
- Comprehensive testing pipeline (unit → API → compliance)

### 4. **Developer Productivity**
- Code generation with consistent templates
- Familiar routes/models/services structure  
- TypeScript type safety throughout
- Unified command interface for all operations

---

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│     (React)     │    │  (Express/      │
│                 │    │  VoilaJSX       │
│                 │    │   AppKit)       │
│  web/           │    │  api/           │
│  ├── greeting/  │◄──►│  ├── greeting/  │
│  │   ├── hello/  │    │  │   └── hello/ │
│  │   └── echo/   │    │  ├── climate/   │
│  └── vite.config│    │  └── testapp/   │
└─────────────────┘    └─────────────────┘
          │                      │
          └──────────────────────┘
                   │
       ┌─────────────────────────────┐
       │ lib/contracts.ts        │
       │ (Unified Contract       │
       │  System + Validation)   │
       └─────────────────────────────┘
```

### Key Principles
- **App-level isolation**: Each app can become a microservice when needed
- **Feature-level isolation**: No dependencies between features (even within apps)
- **Contract-driven development**: VoilaFeatureContract system with validation levels
- **Auto-discovery**: Automatic route mounting based on filesystem conventions
- **Enterprise-ready**: Built-in logging, security, error handling via VoilaJSX AppKit
- **Excel-based testing**: Business-friendly API test case management

---

## File Structure

### Complete Project Structure
```
voila-project/
├── src/                           # Source code layer
│   ├── web/                       # Frontend Layer (renamed from app/)
│   │   ├── {appname}/            # Individual app (e.g., greeting)
│   │   │   ├── {feature}/        # Feature module (isolated)
│   │   │   │   ├── {feature}.page.tsx       # React page component
│   │   │   │   ├── {feature}.routes.tsx     # React Router routes
│   │   │   │   ├── {feature}.services.ts    # API calls + business logic
│   │   │   │   ├── {feature}.types.ts       # TypeScript types
│   │   │   │   └── {feature}.contract.json  # Frontend contract
│   │   │   └── vite.config.ts    # Vite configuration
│   │
│   └── api/                      # Backend Layer (VoilaJSX AppKit)
│       ├── {appname}/           # ⭐ App-level folder (microservice-ready)
│       │   ├── features/{feature}/  # Feature module (completely isolated)
│       │   │   ├── {feature}.routes.ts         # Express routes
│       │   │   ├── {feature}.services.ts       # Business logic (VoilaJSX AppKit)
│       │   │   ├── {feature}.types.ts          # TypeScript types + Zod validation
│       │   │   ├── {feature}.models.ts         # Database models (optional)
│       │   │   ├── {feature}.test.ts           # Unit tests (Vitest)
│       │   │   ├── {feature}.helper.ts         # Utility functions (optional)
│       │   │   └── {feature}.index.ts          # VoilaFeatureContract
│       │   │
│       │   ├── spec/{app}.api.spec.yml         # OpenAPI specifications
│       │   ├── __apitest__/                    # Excel test files & results
│       │   ├── {app}.config.json               # App & feature configuration
│       │   └── {app}.readme.md                 # App documentation
│
│       ├── greeting/           # Greeting backend app
│       │   ├── features/
│       │   │   ├── hello/     # Hello feature
│       │   │   │   ├── hello.routes.ts
│       │   │   │   ├── hello.services.ts
│       │   │   │   ├── hello.types.ts
│       │   │   │   ├── hello.test.ts
│       │   │   │   ├── hello.helper.ts
│       │   │   │   └── hello.index.ts         # VoilaFeatureContract
│       │   │   └── echo/      # Echo feature (disabled)
│       │   │       ├── echo.routes.ts
│       │   │       ├── echo.services.ts
│       │   │       ├── echo.types.ts
│       │   │       └── echo.index.ts
│       │   ├── spec/greeting.api.spec.yml
│       │   ├── __apitest__/   # Excel test files
│       │   ├── greeting.config.json
│       │   └── greeting.readme.md
│       │
│       ├── climate/           # Climate backend app
│       │   ├── features/
│       │   │   └── weather/   # Weather feature
│       │   │       ├── weather.routes.ts
│       │   │       ├── weather.services.ts
│       │   │       ├── weather.types.ts
│       │   │       ├── weather.test.ts
│       │   │       └── weather.index.ts
│       │   ├── spec/climate.api.spec.yml
│       │   ├── __apitest__/
│       │   ├── climate.config.json
│       │   └── climate.readme.md
│       │
│       └── testapp/           # Test backend app
│           ├── features/
│           │   └── weather/   # Weather feature
│           │       ├── weather.routes.ts
│           │       ├── weather.services.ts
│           │       ├── weather.types.ts
│           │       ├── weather.test.ts
│           │       └── weather.index.ts
│           ├── spec/testapp.api.spec.yml
│           ├── __apitest__/
│           ├── testapp.config.json
│           └── testapp.readme.md
│
├── lib/                      # Framework libraries
│   ├── contracts.ts         # Unified contract system & validation
│   └── discovery.ts         # API auto-discovery engine
│
├── docs/                     # Framework documentation
│   ├── lib/
│   │   ├── voila.architecture.md    # This document
│   │   ├── APPKIT_LLM_GUIDE.md      # VoilaJSX AppKit guide
│   │   └── VOILA-COMMENT-GUIDELINES.md # Code comment standards
│   └── app/                 # App-specific documentation
│
├── scripts/                  # Build and development scripts
│   ├── voila-generate.ts    # App & feature generator
│   ├── voila-test.ts        # Unified testing interface
│   ├── voila-validate.ts    # Contract validation
│   └── voila-server.ts      # Server management
│
├── templates/               # Code generation templates
│   ├── feature.routes.ts    # Route template
│   ├── feature.services.ts  # Service template
│   ├── feature.types.ts     # Types & schemas template
│   ├── feature.models.ts    # Database models template (optional)
│   ├── feature.test.ts      # Test template
│   ├── feature.index.ts     # Contract template
│   ├── app.config.json      # App config template
│   ├── app.readme.md        # App readme template
│   └── app.api.spec.yml     # API spec template
│
├── server.ts                # Main server entry point
├── package.json             # Root dependencies
├── tsconfig.json            # TypeScript configuration
├── tsconfig.api.json        # API TypeScript config
├── tsconfig.dev.json        # Development TypeScript config
├── vitest.config.ts         # Testing configuration
└── README.md               # Project overview
```

---

## App-Centric Organization

### App Isolation Benefits
```
src/api/
├── greeting/               # Greeting business domain
│   ├── features/
│   │   ├── hello/          # Hello greeting (isolated)
│   │   └── echo/           # Echo service (isolated, disabled)
│   ├── spec/greeting.api.spec.yml
│   ├── __apitest__/        # Excel test files
│   ├── greeting.config.json
│   └── greeting.readme.md
│
├── climate/                # Climate data domain
│   ├── features/
│   │   └── weather/        # Weather data (isolated)
│   ├── spec/climate.api.spec.yml
│   ├── __apitest__/
│   ├── climate.config.json
│   └── climate.readme.md
│
└── testapp/                # Testing domain
    ├── features/
    │   └── weather/        # Weather testing (isolated)
    ├── spec/testapp.api.spec.yml
    ├── __apitest__/
    ├── testapp.config.json
    └── testapp.readme.md
```

### Team Autonomy
- **App-level ownership**: Teams own entire app (frontend + backend)
- **Independent development**: No cross-app dependencies
- **Feature isolation**: Complete separation even within apps
- **Clear boundaries**: Business domain separation

---

## Feature-Based Development

### Feature Structure
Each feature follows a consistent **routes/models/services** pattern:

#### Backend Feature (api/greeting/features/hello/)

```typescript
// hello.routes.ts - Express routes
import express from 'express';
import { HelloService } from './hello.services.js';

const router = express.Router();

// GET /api/greeting/hello
router.get('/', HelloService.greetDefault);

// GET /api/greeting/hello/:name
router.get('/:name', HelloService.greetByName);

export default router;

// hello.services.ts - Business logic (VoilaJSX AppKit)
import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';
import { HelloSchema, type HelloResponse } from './hello.models.js';

const utils = utilClass.get();
const log = loggerClass.get('hello.service');
const err = errorClass.get();
const secure = securityClass.get();

export class HelloService {
  static async greetByName(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const name = secure.input(req.params.name);
      
      if (!name || name.length === 0) {
        throw err.badRequest('Name parameter is required');
      }
      
      const greetings = [
        `Hello, ${name}!`,
        `Hola, ${name}!`,
        `Bonjour, ${name}!`
      ];

      const response: HelloResponse = {
        success: true,
        data: {
          greetings,
          name,
          language_count: 3,
          timestamp: new Date().toISOString(),
          requestId,
          feature: 'hello'
        }
      };
      
      log.info('Hello greeting completed', { requestId, name });
      res.json(response);
      
    } catch (error: any) {
      log.error('Hello greeting failed', { requestId, error: error.message });
      throw error;
    }
  }
  
  static async greetDefault(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const greetings = [
        'Hello, World!',
        'Hola, Mundo!',
        'Bonjour, Monde!'
      ];

      const response: HelloResponse = {
        success: true,
        data: {
          greetings,
          name: 'World',
          language_count: 3,
          timestamp: new Date().toISOString(),
          requestId,
          feature: 'hello'
        }
      };
      
      log.info('Default hello greeting completed', { requestId });
      res.json(response);
      
    } catch (error: any) {
      log.error('Default hello greeting failed', { requestId, error: error.message });
      throw err.serverError('Failed to generate greeting');
    }
  }
}

// hello.types.ts - TypeScript types + Zod validation
import { z } from 'zod';

export const HelloSchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

export interface HelloData {
  greetings: string[];
  name: string;
  language_count: number;
  timestamp: string;
  requestId: string;
  feature: string;
}

export interface HelloResponse {
  success: boolean;
  data: HelloData;
}

export type HelloRequest = z.infer<typeof HelloSchema>;

// hello.index.ts - VoilaFeatureContract
import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

const HelloFeatureContract: VoilaFeatureContract = createFeatureContract({
  name: 'hello',
  app: 'greeting',
  description: 'Multi-language greeting service with AppKit integration',
  contract_validation: 'none',
  llm_comments: 'none',
  
  api: {
    basePath: '/api/greeting/hello',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'HelloService.greetDefault',
        summary: 'Get default greeting in 3 languages',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      },
      {
        method: 'GET',
        path: '/:name',
        handler: 'HelloService.greetByName',
        summary: 'Get personalized greeting for specific name',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      }
    ]
  },

  dependencies: {
    files: {
      "hello.services.ts": {
        appkit: ["util", "logger", "error", "security"]
      },
      "hello.routes.ts": {
        external: ["express"]
      },
      "hello.types.ts": {
        external: ["zod"]
      }
    }
  },

  provides: {
    services: ['HelloService'],
    routes: ['/api/greeting/hello', '/api/greeting/hello/:name'],
    types: ['HelloResponse', 'HelloData', 'HelloRequest'],
    schemas: ['HelloSchema']
  },

  consumes: {
    services: [],
    state: [],
    events: []
  },

  tests: [
    'should return default greeting',
    'should return personalized greeting'
  ]
});

export default HelloFeatureContract;
```

#### Frontend Feature (web/greeting/features/hello/)

```typescript
// hello.routes.tsx - React Router routes
import { Routes, Route } from 'react-router-dom';
import { HelloPage } from './hello.page';

export function HelloRoutes() {
  return (
    <Routes>
      <Route path="/hello" element={<HelloPage />} />
      <Route path="/hello/:name" element={<HelloPage />} />
    </Routes>
  );
}

// hello.services.ts - API calls
import { HelloResponse } from './hello.models';

// API service for hello operations
export const HelloService = {
  async getDefaultGreeting(): Promise<HelloResponse> {
    const response = await fetch('/api/greeting/hello', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch default greeting');
    }
    
    return response.json();
  },
  
  async getPersonalizedGreeting(name: string): Promise<HelloResponse> {
    const response = await fetch(`/api/greeting/hello/${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch personalized greeting');
    }
    
    return response.json();
  }
};

// hello.types.ts - Frontend types
export interface HelloData {
  greetings: string[];
  name: string;
  language_count: number;
  timestamp: string;
  requestId: string;
  feature: string;
}

export interface HelloResponse {
  success: boolean;
  data: HelloData;
}

export interface HelloPageState {
  greeting: HelloResponse | null;
  loading: boolean;
  error: string | null;
  currentName?: string;
}
```

---

## Contract System

### VoilaFeatureContract Structure

```typescript
// Real contract from hello.index.ts
const HelloFeatureContract: VoilaFeatureContract = {
  name: 'hello',
  app: 'greeting',
  description: 'Multi-language greeting service with AppKit integration',
  contract_validation: 'none', // strict | basic | none
  llm_comments: 'none',        // strict | basic | none
  
  api: {
    basePath: '/api/greeting/hello',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'HelloService.greetDefault',
        summary: 'Get default greeting in 3 languages',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      },
      {
        method: 'GET',
        path: '/:name',
        handler: 'HelloService.greetByName',
        summary: 'Get personalized greeting for specific name',
        requestSchema: null,
        responseSchema: 'HelloResponse'
      }
    ]
  },

  // File-level dependencies for validation
  dependencies: {
    files: {
      "hello.services.ts": {
        appkit: ["util", "logger", "error", "security"]
      },
      "hello.routes.ts": {
        external: ["express"]
      },
      "hello.types.ts": {
        external: ["zod"]
      },
      "hello.test.ts": {
        external: ["vitest"]
      }
    }
  },

  // What this feature provides
  provides: {
    services: ['HelloService'],
    routes: ['/api/greeting/hello', '/api/greeting/hello/:name'],
    types: ['HelloResponse', 'HelloData', 'HelloRequest'],
    schemas: ['HelloSchema']
  },

  // What this feature consumes
  consumes: {
    services: [],
    state: [],
    events: []
  },

  // Test specifications
  tests: [
    'should return default greeting',
    'should return personalized greeting'
  ],

  // Optional: Quality requirements, security, observability
  quality?: {
    testCoverage: number;
    typeStrictness: number;
    securityLevel: 'low' | 'medium' | 'high';
  },
  
  security?: {
    inputValidation: boolean;
    outputSanitization: boolean;
    rateLimiting: boolean;
    authRequired: boolean;
    permissions: string[];
  }
};
```

### App Configuration Structure

```json
// Real config from greeting.config.json
{
  "app": "greeting",
  "enabled": true,
  "environments": ["development", "staging", "production"],

  "features": {
    "hello": {
      "enabled": true,
      "environments": ["development", "staging", "production"],
      "description": "Simple greeting service for customer engagement"
    },
    "echo": {
      "enabled": false,
      "environments": ["development"],
      "description": "Echo service for testing and debugging"
    }
  },

  "metadata": {
    "owner": "Greeting Team",
    "created": "2025-08-21"
  },

  "api_compliance": {
    "last_test_run": "2025-08-22T01:09:56.633Z",
    "total_tests": 6,
    "passed_tests": 6,
    "failed_tests": 0,
    "success_rate": "100%",
    "overall_status": "COMPLIANT",
    "requirements_met": true,
    "test_results_file": "greeting.testresults-2025-08-22T01-09-56.xlsx",
    "updated_at": "2025-08-22T04:11:58.448Z"
  }
}
```

### Contract Validation Commands

```bash
# Validate specific app
npm run validate app:api greeting

# Validate all apps  
npm run validate app:api

# Validation includes:
# ✅ Contract structure validation
# ✅ File existence checks
# ✅ Import/dependency validation
# ✅ Handler implementation checks
# ✅ Route definition validation
# ✅ Test coverage requirements
# ✅ LLM comment compliance (if strict mode)
```

---

## Development Workflow

### 1. Code Generation Commands

```bash
# Generate new app
npm run generate app:api myapp

# Generate new feature
npm run generate app:api myapp/feature

# Generate API test cases from specification
npm run generate app:api myapp -- --testcases

# Example app structure generated:
src/api/myapp/
├── features/                   # Feature modules directory
├── spec/                       # API specifications
│   └── myapp.api.spec.yml     # OpenAPI/test specifications
├── __apitest__/               # Generated API test results & testcases
├── myapp.config.json          # App configuration
└── myapp.readme.md            # Documentation

# Feature structure generated:
src/api/myapp/features/feature/
├── feature.types.ts           # TypeScript types & Zod schemas
├── feature.routes.ts          # Express route definitions
├── feature.services.ts        # Business logic & service layer
├── feature.models.ts          # Database models (optional)
├── feature.test.ts            # Unit tests (Vitest)
└── feature.index.ts           # VoilaFeatureContract definition
```

### 2. Testing Commands

```bash
# Run all tests for an app
npm run test app:api greeting

# Run specific test types
npm run test app:api greeting -- --unittest     # Unit tests only
npm run test app:api greeting -- --apitest      # API tests only  
npm run test app:api greeting -- --compliance   # Compliance only

# Feature-specific testing
npm run test app:api greeting/hello -- --unittest

# Test types include:
# 🔬 Unit Tests - Vitest-based feature testing
# 📋 API Tests - Excel-driven integration testing
# ✅ Compliance - Contract validation and requirements checking
```

### 3. Server Management

```bash
# Start development server
npm run dev:api                # Auto-restart on file changes
npm run server api:start       # Manual start (foreground)

# Server management
npm run server api:stop         # Stop running server
npm run server api:restart      # Restart (picks up new features)
npm run server api:status       # Check server health

# Server features:
# 🚀 Auto-discovery - Finds and mounts features automatically
# 📋 Contract validation - Validates contracts before mounting
# 🏥 Health checks - Built-in health endpoint
# 🔄 Hot reload - Restarts on file changes (dev mode)
```

### 4. Real-World Example

```bash
# Current working example in the codebase
# 1. Generated greeting app with hello feature:
npm run generate app:api greeting
npm run generate app:api greeting/hello

# 2. Test the implementation:
npm run test app:api greeting
# Result: Unit tests ✅, API tests ✅, Compliance ✅

# 3. Start and verify server:
npm run dev:api
# Server auto-discovers and mounts:
# ✅ /api/greeting/hello (default greeting)
# ✅ /api/greeting/hello/:name (personalized)

# 4. API endpoints working:
# GET /api/greeting/hello -> "Hello, World!" in 3 languages
# GET /api/greeting/hello/John -> "Hello, John!" in 3 languages
```

---

## Testing Strategy

### Multi-Level Testing Pipeline

1. **Unit Tests** (Vitest)
   - Feature-specific test files (`*.test.ts`)
   - Business logic validation
   - TypeScript type checking
   - Zod schema validation

2. **API Integration Tests** (Excel-based)
   - Excel files in `__apitest__/` directories
   - Business-friendly test case format
   - Automated API endpoint testing
   - Response validation and comparison

3. **Compliance Testing**
   - Contract validation enforcement
   - File structure verification
   - Import dependency checking
   - Test coverage requirements

### Excel-Based API Testing

```bash
# Generate test cases from API specifications
npm run generate app:api greeting -- --testcases

# Creates Excel file: greeting.testcases-TIMESTAMP.xlsx
# Columns: Test ID | Description | Method | Path | Input | Expected | Status | Actual | Response Time | Notes

# Run API tests
npm run test app:api greeting -- --apitest

# Creates results file: greeting.testresults-TIMESTAMP.xlsx
# Updates compliance status in app config
```

---

## Microservices Migration

### 1. Current Development Setup

```bash
# Start development server
npm run dev:api             # API server on http://localhost:3001
  ├── Health: http://localhost:3001/health
  ├── API Docs: http://localhost:3001/api
  └── Apps: greeting, climate, testapp

# Features auto-discovered and mounted:
# ✅ /api/greeting/hello
# ✅ /api/climate/weather
# ✅ /api/testapp/weather
# ⏭️ /api/greeting/echo (disabled via config)

# Single server, shared resources
# Fast development, easy debugging
# Perfect for current phase
```

### 2. Future Microservice Extraction

```bash
# When ready to scale/distribute (future feature)
# Each app is already isolated and can become a microservice:

src/api/greeting/         # Ready for extraction
├── features/            # All greeting features
├── spec/               # API specifications  
├── __apitest__/        # Test cases and results
├── greeting.config.json # App configuration
└── greeting.readme.md   # Documentation

# Extraction would create:
# ├── package.json        # Independent dependencies
# ├── Dockerfile         # Container configuration
# ├── server.ts          # Microservice entry point
# └── features/          # All greeting features
```

### 3. Current Architecture Benefits

```typescript
// Complete feature isolation - no inter-feature dependencies
// VoilaJSX AppKit provides enterprise utilities:

import { utilClass } from '@voilajsx/appkit/util';      // UUID, helpers
import { loggerClass } from '@voilajsx/appkit/logger';  // Structured logging
import { errorClass } from '@voilajsx/appkit/error';    // Error handling
import { securityClass } from '@voilajsx/appkit/security'; // Input validation

// Contract system ensures API consistency:
const contract = createFeatureContract({
  name: 'hello',
  api: { basePath: '/api/greeting/hello', endpoints: [...] },
  dependencies: { files: {...} },
  provides: { services: [...], routes: [...] }
});

// Auto-discovery mounts routes automatically
// Excel-based testing for business-friendly test management
```

### 4. Current Production Readiness

```yaml
# The framework is ready for production with:
# ✅ Contract validation preventing breaking changes
# ✅ Comprehensive testing (unit + API + compliance)
# ✅ Enterprise logging and error handling
# ✅ Security input validation and sanitization
# ✅ Health checks and monitoring endpoints
# ✅ TypeScript type safety throughout
# ✅ Excel-based test case management
# ✅ Feature flagging and environment control

# Example production deployment (single server currently):
server:
  port: 3001
  apps: [greeting, climate, testapp]
  features_discovered: 3
  contracts_validated: true
  health_check: /health
  api_docs: /api
```

---

## Developer Experience

### Actual Available Commands

```bash
# Generation Commands
npm run generate app:api myapp                    # Generate new app
npm run generate app:api myapp/feature           # Add feature to app
npm run generate app:api myapp -- --testcases    # Generate API test cases

# Testing Commands  
npm run test app:api greeting                     # All tests
npm run test app:api greeting -- --unittest      # Unit tests only
npm run test app:api greeting -- --apitest       # API tests only
npm run test app:api greeting -- --compliance    # Compliance only
npm run test app:api greeting/hello -- --unittest # Feature-specific

# Validation Commands
npm run validate app:api greeting                # Validate specific app
npm run validate app:api                         # Validate all apps

# Server Management
npm run dev:api                                  # Development server
npm run server api:start                         # Start server
npm run server api:stop                          # Stop server
npm run server api:restart                       # Restart server
npm run server api:status                        # Check status

# Working Examples
npm run dev:api                                  # Starts server
# curl http://localhost:3001/api/greeting/hello    # Test endpoint
# curl http://localhost:3001/api/greeting/hello/John # Personalized
```

### Development Integration

```json
// TypeScript configurations available:
// ├── tsconfig.json            # Root TypeScript config
// ├── tsconfig.api.json        # API-specific config
// ├── tsconfig.dev.json        # Development config
// └── vitest.config.ts         # Testing configuration

// File associations:
{
  "files.associations": {
    "*.index.ts": "typescript",     // Feature contracts
    "*.config.json": "jsonc",      // App configurations
    "*.api.spec.yml": "yaml"       // API specifications
  }
}

// VoilaJSX comment standards for AI assistance
// Contract validation during development
// Excel-based test case management
```

### Current Development Workflow

```
1. Generate app structure
   npm run generate app:api myapp
   ↓
2. Add features with business logic
   npm run generate app:api myapp/feature
   ↓  
3. Validation pipeline runs
   npm run validate app:api myapp
   ↓
4. Comprehensive testing
   npm run test app:api myapp
   ↓
5. Deploy with confidence
   npm run dev:api (development)
```

---

## Framework Benefits

### For Development Teams (Current Implementation)
- **Fast development**: Scaffolding generates complete feature structures
- **Low learning curve**: Familiar routes/models/services patterns with TypeScript
- **Monolithic simplicity**: Single server, auto-discovery, easy debugging
- **Contract-driven**: Strong typing and validation prevents breaking changes

### For Enterprise Development
- **App-level isolation**: Each app can become microservice when needed
- **Enterprise features**: VoilaJSX AppKit provides logging, security, error handling
- **Excel-based testing**: Business-friendly test case management and results
- **Feature flagging**: Environment-based feature control via configuration

### For Quality Assurance
- **Multi-level testing**: Unit → API → Compliance test pipeline
- **Contract validation**: Ensures implementation matches specifications
- **Compliance tracking**: Automated compliance status in app configurations
- **Real-time monitoring**: Health checks, structured logging, error tracking

### Technical Implementation
- **Type safety**: Full TypeScript with Zod validation schemas
- **Auto-discovery**: Zero-configuration route mounting based on filesystem
- **Security**: VoilaJSX AppKit input sanitization and validation
- **Comprehensive testing**: Vitest unit tests + Excel API tests + compliance checks

---

## Current Implementation Status

### ✅ Completed Features
- [x] Project scaffolding and CLI tools (voila-generate.ts)
- [x] File structure generation with templates
- [x] Complete contract system (VoilaFeatureContract)
- [x] Routes/models/services templates
- [x] Auto-discovery system (discovery.ts)
- [x] Contract validation pipeline
- [x] Multi-level testing system (unit/API/compliance)
- [x] VoilaJSX AppKit integration
- [x] Excel-based API testing
- [x] Feature flagging and environment control
- [x] Server management tools
- [x] TypeScript integration throughout
- [x] Health monitoring and structured logging

### 🚀 Working Examples
- [x] Greeting app with hello feature (3-language greetings)
- [x] Climate app with weather feature
- [x] Testapp with weather feature
- [x] Complete test suites passing
- [x] Contract validation working
- [x] Auto-discovery mounting routes
- [x] Excel test case generation and execution

### 📈 Next Phase Opportunities
- [ ] Frontend web integration enhancements
- [ ] Microservice extraction tooling
- [ ] Advanced monitoring and analytics
- [ ] CI/CD pipeline integration
- [ ] Database integration patterns
- [ ] Authentication app template

---

**Voila Framework**: A production-ready contract-driven development framework combining enterprise-grade patterns with developer productivity. Features auto-discovery, comprehensive testing, and scalable architecture - currently powering real applications with robust validation and monitoring capabilities.