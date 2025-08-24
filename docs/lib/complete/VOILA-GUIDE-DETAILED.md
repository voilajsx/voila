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

### Complete App Development Workflow

Follow these steps in order. Each step includes validation, error handling, and next actions.

#### **Phase 1: Planning & Requirements (Human-Controlled)**

**Step 1a: Start Planning Session**
```bash
npm run plan start myapp "simple greeting service"
```
- **What it does**: Creates planning documents with discovery questions
- **Generated files**: 
  - `docs/planning/myapp/myapp-business-requirements-v1.md`
  - `docs/planning/myapp/myapp-technical-specification-v1.md`
- **Next action**: Complete all `[FILL_IN]` sections in both documents

**Step 1b: Review Planning Completion**
```bash
npm run plan review myapp
```
- **What it does**: Shows planning status and remaining `[FILL_IN]` sections
- **Success criteria**: All `[FILL_IN]` sections completed
- **If incomplete**: Edit the markdown files to complete missing sections
- **Next action**: Approve planning when complete

**Step 1c: Approve Planning for Implementation**
```bash
npm run plan approve myapp
```
- **What it does**: Changes `STATUS: UNDER_REVIEW` to `STATUS: APPROVED`
- **Success criteria**: Both documents show `STATUS: APPROVED`
- **If fails**: Complete remaining `[FILL_IN]` sections first
- **Why required**: Generation is blocked without approval

**Step 1d: Initialize Git Repository**
```bash
npm run git init https://github.com/user/myapp.git
```
- **What it does**: Sets up Git repository with Voila-optimized configuration
- **Creates**: 
  - Git repository with main/dev branches
  - .gitignore file for Voila projects
  - Initial commit with planning documents
  - Remote repository connection
- **Alternative**: `npm run git init` for local-only repository
- **Next action**: Proceed to application structure generation

---

#### **Phase 2: Application Structure Setup**

**Step 2a: Generate Application Structure**
```bash
npm run generate app:api myapp
```
- **What it does**: Creates boilerplate app structure from approved planning
- **Generated structure**:
  ```
  src/api/myapp/
  ├── features/                   # Empty (add features later)
  ├── spec/myapp.api.spec.yml    # Template spec (must edit)
  ├── __apitest__/               # Empty (tests generated later)
  ├── myapp.config.json         # Basic app configuration
  └── myapp.readme.md           # Documentation template
  ```
- **If fails with "planning not approved"**: Run `npm run plan approve myapp`
- **If fails with app exists**: Add `-- --overwrite` to replace
- **Next action**: Create detailed API specification

**Step 2b: Create Detailed API Specification**
```bash
# Edit this file manually based on technical specification
src/api/myapp/spec/myapp.api.spec.yml
```
- **What it does**: Defines all endpoints, schemas, and test cases for the app
- **Required elements**:
  - All endpoints from technical specification document
  - Complete request/response schemas with validation
  - Error response definitions for each endpoint
  - Authentication and rate limiting specs
  - Test case specifications for each endpoint
- **Template structure**: Basic YAML template is generated
- **Critical**: This drives all feature development and testing
- **Validation**: No automatic validation at this step
- **Next action**: Begin feature-by-feature development

---

#### **Phase 3: Feature Development (Repeat for Each Feature)**

**Step 3a: Start Feature Branch**
```bash
npm run git branch myapp/greeting
```
- **What it does**: Creates feature branch with auto-pull of latest dev branch
- **Created branch**: `feature/myapp-greeting-username` (uses your Git username)
- **For bug fixes**: Add `--fix` flag: `npm run git branch myapp/greeting --fix`
- **Git safety**: Automatically pulls latest dev branch to prevent conflicts
- **Next action**: Generate feature structure

**Step 3b: Generate Feature Structure**
```bash
npm run generate app:api myapp/greeting
```
- **What it does**: Creates template files for the feature
- **Generated files**:
  - `greeting.index.ts` - Empty contract template
  - `greeting.types.ts` - Empty types/schemas template  
  - `greeting.services.ts` - Empty business logic template
  - `greeting.routes.ts` - Empty Express routes template
  - `greeting.models.ts` - Empty database models template
  - `greeting.test.ts` - Empty unit tests template
- **If fails**: App must exist first (run step 2a)
- **If feature exists**: Add `-- --overwrite` to replace
- **Next action**: Define feature contract first

**Step 3c: Define Feature Contract (CRITICAL FIRST STEP)**
```bash
# Edit: src/api/myapp/features/greeting/greeting.index.ts
```
- **What it does**: Defines the complete contract that drives all implementation
- **Required contract elements**:
  ```typescript
  export const GreetingFeatureContract: VoilaFeatureContract = {
    name: 'greeting',
    app: 'myapp', 
    description: 'Multi-language greeting service',
    
    api: {
      basePath: '/api/myapp',
      endpoints: [
        {
          method: 'GET',
          path: '/hello',
          handler: 'GreetingService.getHello',
          summary: 'Get greeting message'
        }
      ]
    },
    
    dependencies: {
      files: {
        "greeting.services.ts": {
          appkit: ["util", "logger", "error"],
          external: []
        }
      }
    },
    
    provides: {
      services: ['GreetingService'],
      routes: ['/api/myapp/hello'],
      types: ['GreetingResponse']
    }
  };
  ```
- **Contract drives**: All subsequent implementation decisions
- **Must match**: API specification from step 2b
- **Next action**: Implement files in contract-driven order

**Step 3c: Implement Feature Files (Contract-Driven Order)**

**3c.1: Types and Schemas**
```bash
# Edit: greeting.types.ts
```
- **What to implement**: TypeScript interfaces and Zod validation schemas
- **Required patterns**:
  ```typescript
  import { z } from 'zod';
  
  // Request schema (if needed)
  export const GreetingRequestSchema = z.object({
    name: z.string().optional(),
    language: z.enum(['en', 'es', 'fr']).default('en')
  });
  
  // Response schema
  export const GreetingResponseSchema = z.object({
    message: z.string(),
    language: z.string(),
    timestamp: z.string()
  });
  
  // TypeScript types
  export type GreetingRequest = z.infer<typeof GreetingRequestSchema>;
  export type GreetingResponse = z.infer<typeof GreetingResponseSchema>;
  ```
- **Must match**: Contract's declared types
- **Validation**: Schemas will be used in routes for request validation

**3c.2: Business Logic Services**
```bash
# Edit: greeting.services.ts
```
- **What to implement**: Core business logic for contract handlers
- **Required patterns**:
  ```typescript
  import { utilClass } from '@voilajsx/appkit/util';
  import { loggerClass } from '@voilajsx/appkit/logger';
  import type { GreetingRequest, GreetingResponse } from './greeting.types.js';
  
  const util = utilClass.get();
  const logger = loggerClass.get();
  
  export class GreetingService {
    static async getHello(request: GreetingRequest): Promise<GreetingResponse> {
      const requestId = util.uuid();
      logger.info('Processing greeting request', { requestId, request });
      
      // Business logic implementation
      const messages = {
        en: `Hello, ${request.name || 'World'}!`,
        es: `¡Hola, ${request.name || 'Mundo'}!`,
        fr: `Bonjour, ${request.name || 'le Monde'}!`
      };
      
      return {
        message: messages[request.language],
        language: request.language,
        timestamp: new Date().toISOString()
      };
    }
  }
  ```
- **Must implement**: All handlers declared in contract
- **Must use**: VoilaJSX AppKit utilities (util, logger, error, security)
- **Error handling**: Use `errorClass` for consistent error responses

**3c.3: Express Routes**
```bash
# Edit: greeting.routes.ts  
```
- **What to implement**: HTTP endpoints implementing contract endpoints
- **Required patterns**:
  ```typescript
  import express from 'express';
  import { securityClass } from '@voilajsx/appkit/security';
  import { errorClass } from '@voilajsx/appkit/error';
  import { GreetingRequestSchema } from './greeting.types.js';
  import { GreetingService } from './greeting.services.js';
  
  const router = express.Router();
  const security = securityClass.get();
  const error = errorClass.get();
  
  router.get('/hello', async (req, res) => {
    try {
      // Validate and sanitize input
      const validatedInput = security.input(req.query);
      const request = GreetingRequestSchema.parse(validatedInput);
      
      // Call business logic
      const response = await GreetingService.getHello(request);
      
      res.json({
        success: true,
        data: response,
        requestId: req.headers['x-request-id']
      });
    } catch (validationError) {
      throw error.badRequest('Invalid request parameters');
    } catch (serviceError) {
      throw error.serverError('Internal server error');
    }
  });
  
  export default router;
  ```
- **Must implement**: All endpoints declared in contract
- **Must validate**: Input using Zod schemas
- **Must use**: AppKit security for input sanitization
- **Must handle**: Errors using AppKit error class

**3c.4: Database Models (If Needed)**
```bash
# Edit: greeting.models.ts
```
- **When needed**: Only if feature requires database interaction
- **What to implement**: Database schemas, queries, and data access patterns
- **Skip if**: Feature is stateless (like greeting service)

**3c.5: Unit Tests**
```bash
# Edit: greeting.test.ts
```
- **What to implement**: Comprehensive test coverage for all functionality
- **Required patterns**:
  ```typescript
  import { describe, it, expect, vi, beforeEach } from 'vitest';
  import { GreetingService } from './greeting.services.js';
  
  // Mock AppKit dependencies
  vi.mock('@voilajsx/appkit/util', () => ({
    utilClass: {
      get: () => ({ uuid: vi.fn(() => 'test-uuid-123') })
    }
  }));
  
  vi.mock('@voilajsx/appkit/logger', () => ({
    loggerClass: {
      get: () => ({ info: vi.fn(), error: vi.fn() })
    }
  }));
  
  describe('GreetingService', () => {
    it('should return English greeting by default', async () => {
      const result = await GreetingService.getHello({ name: 'John' });
      
      expect(result.message).toBe('Hello, John!');
      expect(result.language).toBe('en');
      expect(result.timestamp).toBeDefined();
    });
    
    it('should support Spanish greetings', async () => {
      const result = await GreetingService.getHello({ 
        name: 'María', 
        language: 'es' 
      });
      
      expect(result.message).toBe('¡Hola, María!');
      expect(result.language).toBe('es');
    });
    
    it('should handle missing name parameter', async () => {
      const result = await GreetingService.getHello({});
      
      expect(result.message).toBe('Hello, World!');
    });
  });
  ```
- **Test coverage required**: 95% minimum
- **Must test**: All contract handlers and scenarios
- **Must mock**: All external dependencies (AppKit, APIs, databases)
- **Must cover**: Success cases, error cases, edge cases

**Step 3d: Validate Feature Contract Compliance**
```bash
npm run validate app:api myapp/greeting
```
- **What it validates**:
  - ✅ Contract structure and exports
  - ✅ All declared endpoints exist in routes
  - ✅ All declared handlers exist in services  
  - ✅ All declared dependencies are imported
  - ✅ All provided services and types are exported
  - ✅ TypeScript compilation passes
- **If validation fails**:
  - Read error messages carefully
  - Check contract vs implementation alignment
  - Verify all imports and exports
  - Run `npm run help validate` for more guidance
- **Common failures**:
  - Missing handler implementation: Add method to services
  - Missing route endpoint: Add route to router
  - Import errors: Check dependency declarations
  - Type errors: Run `npm run typecheck` for details
- **Success criteria**: All validations pass with green checkmarks
- **Next action**: Run feature unit tests

**Step 3e: Test Feature Implementation**
```bash
npm run test app:api myapp/greeting -- --unittest
```
- **What it tests**:
  - ✅ All service methods and business logic
  - ✅ Error handling scenarios  
  - ✅ Input validation and edge cases
  - ✅ External dependency interactions (mocked)
- **Success criteria**: 
  - All tests pass (green)
  - Coverage ≥95% (shown in output)
- **If tests fail**:
  - Review specific test failures in output
  - Fix implementation or test cases
  - Check mock setup for AppKit dependencies
  - Verify test scenarios match business requirements
- **Coverage below 95%**:
  - Add tests for uncovered branches
  - Test error handling paths
  - Test edge cases and validation failures

- **Next action**: Repeat steps 3a-3e for each remaining feature

---

#### **Phase 4: Application Integration & Deployment**

**Step 4a: Generate API Test Cases** 
```bash
npm run generate app:api myapp -- --testcases
```
- **What it does**: Creates Excel-based API integration tests from specification
- **Generated file**: `src/api/myapp/__apitest__/myapp.testcases-[timestamp].xlsx`
- **Test cases include**:
  - All endpoints from API specification
  - Request/response validation scenarios
  - Error handling test cases
  - Authentication and authorization tests
- **If fails**: API specification must be complete (step 2b)
- **Manual review**: Open Excel file and verify test cases are comprehensive
- **Next action**: Run full application testing

**Step 4b: Run Full Application Test Suite**
```bash
npm run test app:api myapp
```
- **What it runs**:
  1. **Unit Tests**: All feature unit tests (95% coverage required)
  2. **API Integration Tests**: Excel-based endpoint testing
  3. **Contract Compliance**: Cross-feature validation
- **Test sequence**:
  ```
  📍 Step 1: Unit Tests
  🔬 Running unit tests for myapp
  ✅ All feature tests passed (15/15)
  📊 Coverage: 96.5%
  
  📍 Step 2: API Integration Tests  
  🚀 Running API tests for myapp
  🔍 Detecting active server...
  ✅ Found active server at: http://localhost:8000
  📊 API Tests: 12/12 passed (100%)
  
  📍 Step 3: Compliance Check
  📊 Running compliance check for myapp
  ✅ COMPLIANT: All 12 tests passed
  📄 Results File: myapp.testresults-[timestamp].xlsx
  ```
- **If unit tests fail**:
  - Fix failing feature tests (repeat step 3e for affected features)
  - Ensure 95% coverage minimum
- **If API tests fail**:
  - Start development server: `npm run dev:api`
  - Check server is responding: `npm run server api:status`
  - Review Excel results file for specific failures
  - Fix route implementations or API specification
- **If compliance fails**:
  - Review test results Excel file
  - Fix failing API endpoints
  - Re-run after fixes
- **Success criteria**: All three test phases pass
- **Next action**: Commit and push features after all tests pass

**Step 4c: Commit and Push Features**
```bash
# Commit all features with smart default message
npm run git commit myapp/greeting

# Or commit with custom message for complex features
npm run git commit myapp/greeting -- --message="feat(myapp): add greeting service with multi-language support and validation"
```
- **What it does**: 
  - ✅ Runs validation pipeline (`npm run validate app:api`)
  - ✅ Stages all changes (`git add .`)
  - ✅ Creates commit with smart default or your custom message
- **Smart defaults**: `feat(myapp): implement greeting` or `fix(myapp): resolve greeting issue`
- **Why after integration testing**: Ensures all tests (unit + integration + compliance) pass before commit
- **If validation fails**: Fix issues and retry commit

```bash
# Push for code review
npm run git push myapp/greeting
```
- **What it does**:
  - ✅ Final validation check before push
  - ✅ Pushes feature branch to remote repository
  - ✅ Shows instructions for creating Pull Request
- **Next action**: Update application documentation

**Step 4d: Update Application Documentation**
```bash
# Edit application documentation with current implementation details
src/api/myapp/myapp.readme.md
```
- **What it does**: Updates the generated documentation with actual implementation details
- **Required updates**:
  - **API Endpoints**: Document all discovered routes with examples
  ```markdown
  ## API Endpoints

  ### GET /api/myapp/hello
  Get personalized greeting in multiple languages.

  **Parameters:**
  - `name` (optional): Name to greet (default: "World")
  - `language` (optional): Language code - `en`, `es`, `fr` (default: "en")

  **Example Request:**
  ```bash
  curl "http://localhost:8000/api/myapp/hello?name=John&language=en"
  ```

  **Example Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Hello, John!",
      "language": "en",
      "timestamp": "2024-01-01T12:00:00.000Z"
    },
    "requestId": "uuid-123"
  }
  ```
  ```
  - **Features**: List all implemented features with descriptions
  ```markdown
  ## Features

  ### Greeting Service
  Multi-language greeting functionality supporting English, Spanish, and French.
  - **Endpoint**: `GET /api/myapp/hello`
  - **Coverage**: 96% test coverage
  - **Dependencies**: VoilaJSX AppKit utilities
  ```
  - **Development**: Update setup and testing instructions
  ```markdown
  ## Development

  ### Setup
  ```bash
  # Install dependencies
  npm install

  # Start development server
  npm run dev:api

  # Run tests
  npm run test app:api myapp

  # Validate implementation
  npm run validate app:api myapp
  ```

  ### Testing
  - Unit tests: 15/15 passing (96% coverage)
  - API tests: 12/12 passing (100%)
  - Compliance: COMPLIANT
  ```
  - **Deployment**: Add production deployment instructions
  - **Architecture**: Document feature contracts and dependencies
- **Manual vs AI-assisted**:
  - **Manual**: Edit the markdown file directly with implementation details
  - **AI-assisted**: Provide an AI agent with the current state and ask to update documentation
- **Information sources**:
  - Route discovery: `npm run routes app:api myapp`
  - Test results: Excel files in `__apitest__/` directory
  - Contract definitions: Feature `.index.ts` files
  - API specification: `spec/myapp.api.spec.yml`
- **Documentation quality checklist**:
  - [ ] All endpoints documented with examples
  - [ ] Feature descriptions match actual implementation
  - [ ] Setup instructions are accurate and complete
  - [ ] Test coverage and results are current
  - [ ] Deployment instructions are provided
  - [ ] Architecture decisions are explained
- **If documentation is outdated after changes**:
  - Re-run this step after any feature modifications
  - Keep documentation synchronized with implementation
  - Update examples to match current API responses
- **Next action**: Start development server

**Step 4d: Start Development Server**
```bash
npm run dev:api
```
- **What it does**: Starts auto-reloading development server
- **Success indicators**:
  ```
  🚀 Voila API Server starting...
  📡 Server running on http://localhost:8000
  🔄 Watching for changes...
  📋 Discovered routes:
     GET /api/myapp/hello
  ✅ Server ready!
  ```
- **If fails to start**:
  - Check port availability: `npm run server api:status`
  - Stop conflicting processes: `npm run server api:stop`
  - Check for TypeScript errors: `npm run typecheck`
- **If routes not discovered**:
  - Restart server: `npm run server api:restart`
  - Check contract exports in feature.index.ts
  - Validate contracts: `npm run validate app:api myapp`
- **Next action**: Verify and explore application

**Step 4e: Verify and Explore Application**
```bash
# See all discovered routes
npm run routes app:api myapp

# Test endpoints manually
curl "http://localhost:8000/api/myapp/hello?name=World"

# Check application health
curl "http://localhost:8000/api/myapp/health"

# Final validation
npm run validate app:api myapp
```
- **Route discovery should show**:
  ```
  METHOD | PATH                | APP   | FEATURE  | SUMMARY           
  -------|---------------------|-------|----------|-------------------
  GET    | /api/myapp/hello    | myapp | greeting | Get greeting message
  GET    | /api/myapp/health   | myapp | system   | Health check
  ```
- **Endpoint testing should return**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Hello, World!",
      "language": "en", 
      "timestamp": "2024-01-01T12:00:00.000Z"
    },
    "requestId": "uuid-123"
  }
  ```
- **If endpoints fail**:
  - Check server logs for errors
  - Verify route implementation
  - Check request format and parameters
- **Final validation should show**: ✅ All validations passed

**Step 4e: Merge to Development Branch**
```bash
# Switch to main branch and pull latest changes
git checkout main
git pull origin main

# Merge via Pull Request (recommended)
# Create PR: feature/myapp-greeting-username → main
# After PR approval and merge, pull changes locally
git pull origin main
```
- **What it does**: Integrates completed features into main development branch
- **PR Review Process**: Team lead reviews code, validates implementation
- **Merge Safety**: Only merge after all tests pass and code review approval
- **Next action**: Deploy to staging for testing

---

#### **Phase 5: Production Readiness**

**Step 5a: Production Build**
```bash
npm run build:api
```
- **What it does**: Compiles TypeScript to JavaScript for production
- **Success criteria**: Build completes without errors
- **If build fails**: Fix TypeScript errors shown in output

**Step 5b: Deploy to Staging**
```bash
npm run deploy staging
```
- **What it does**: Deploys application to staging environment with validation
- **Deployment process**:
  - ✅ Validates flyctl is installed  
  - ✅ Runs Voila validation (`npm run validate app:api`)
  - ✅ Checks Git status and branch safety
  - ✅ Builds project (`npm run build`)
  - ✅ Deploys via `flyctl deploy --config fly.staging.toml`
- **If deployment fails**: Check error messages and fix issues
- **Next action**: Test staging environment thoroughly

**Step 5c: Deploy to Production**
```bash
npm run deploy production  
```
- **What it does**: Deploys to production environment with additional safety checks
- **Safety requirements**: 
  - ✅ Must be run from `main` branch (enforced automatically)
  - ✅ All validation and build checks must pass
  - ✅ Uses production configuration (`fly.production.toml`)
- **Post-deployment**: Shows application URL and monitoring commands
- **Success criteria**: Application is live and accessible at production URL

**Step 5d: Verify Deployment**
```bash
# Check application status
flyctl status

# View recent logs  
flyctl logs

# Open application in browser
flyctl open
```
- **What to verify**: All API endpoints respond correctly in production environment
- **Health checks**: Application monitoring is active and reporting healthy status
- **Next action**: Application is ready for users!

---

## **Troubleshooting Guide**

### **Common Command Failures**

**Planning Issues:**
```bash
# Error: Planning not approved
npm run plan review myapp        # Check completion status
npm run plan approve myapp       # Auto-approve if complete
```

**Generation Issues:**
```bash
# Error: App already exists
npm run generate app:api myapp -- --overwrite

# Error: Planning not approved  
npm run plan approve myapp
```

**Validation Issues:**
```bash
# Error: Contract validation failed
npm run help validate           # Learn about validation
# Fix contracts and implementations based on error messages
```

**Testing Issues:**
```bash
# Error: Unit tests failing
npm run test app:api myapp/feature -- --unittest  # Test specific feature
# Review test output and fix implementations

# Error: API tests failing
npm run server api:status       # Check server is running
npm run dev:api                 # Start server if needed
```

**Server Issues:**
```bash
# Error: Port in use
npm run server api:stop         # Stop existing servers
npm run server api:restart      # Clean restart

# Error: Routes not discovered
npm run validate app:api myapp  # Check contract exports
npm run routes app:api myapp    # Verify route discovery
```

**Git Issues:**
```bash
# Error: Git user.name not set
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"

# Error: Validation failed during commit
npm run validate app:api myapp  # Fix validation issues first
npm run git commit myapp/feature # Retry commit

# Error: No remote configured
npm run git init https://github.com/user/repo.git  # Add remote
```

**Deployment Issues:**
```bash
# Error: flyctl not found
curl -L https://fly.io/install.sh | sh  # Install flyctl

# Error: No fly.toml found
flyctl launch                    # Initialize fly.io configuration

# Error: Production deploy from wrong branch
git checkout main               # Switch to main branch
npm run deploy production       # Deploy from main

# Error: Build failed during deployment
npm run build                   # Fix build errors locally first
npm run deploy staging          # Retry deployment
```

### **Getting Help**
```bash
# General help
npm run help                    # See all commands

# Command-specific help  
npm run help generate           # Learn about generation
npm run help test              # Learn about testing
npm run help validate          # Learn about validation

# Explore your app
npm run routes                 # See all routes
npm run routes app:api myapp   # App-specific routes
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

### Git Workflow Commands

| Command | Description | Example |
|---------|-------------|---------|
| `npm run git init [remote-url]` | Initialize Git repository | `npm run git init https://github.com/user/app.git` |
| `npm run git branch <app>/<feature>` | Create feature branch | `npm run git branch greeting/hello` |
| `npm run git branch <app>/<feature> --fix` | Create bug fix branch | `npm run git branch greeting/hello --fix` |
| `npm run git commit <app>/<feature>` | Commit with smart default | `npm run git commit greeting/hello` |
| `npm run git commit <app>/<feature> -- --message="msg"` | Commit with custom message | `npm run git commit greeting/hello -- --message="feat: add greeting API"` |
| `npm run git push <app>/<feature>` | Push for Pull Request | `npm run git push greeting/hello` |

### Deployment Commands

| Command | Description | Example |
|---------|-------------|---------|
| `npm run deploy` | Deploy to staging (default) | `npm run deploy` |
| `npm run deploy staging` | Deploy to staging environment | `npm run deploy staging` |
| `npm run deploy production` | Deploy to production environment | `npm run deploy production` |

### Discovery & Help Commands

| Command | Description | Example |
|---------|-------------|---------|
| `npm run help` | Show all available commands | `npm run help` |
| `npm run help <command>` | Show detailed help for command | `npm run help generate` |
| `npm run routes` | List all API routes | `npm run routes` |
| `npm run routes app:api <app>` | List routes for specific app | `npm run routes app:api greeting` |
| `npm run routes app:api <app>/<feature>` | List routes for specific feature | `npm run routes app:api greeting/hello` |

### Server Management Commands

| Command | Description | Example |
|---------|-------------|---------|
| `npm run server api:start` | Start API server manually | `npm run server api:start` |
| `npm run server api:stop` | Stop running API server | `npm run server api:stop` |
| `npm run server api:restart` | Restart server (refresh discovery) | `npm run server api:restart` |
| `npm run server api:status` | Check server health and status | `npm run server api:status` |

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
│   ├── voila-test.ts        # Test runner
│   ├── voila-routes.ts      # Route discovery
│   ├── voila-help.ts        # Interactive help
│   └── voila-server.ts      # Server management
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

### Getting Help

```bash
# Show all available commands
npm run help

# Get specific command help
npm run help generate              # Learn about generation
npm run help test                  # Learn about testing
npm run help routes                # Learn about route discovery

# Explore your APIs
npm run routes                     # See all routes
npm run routes app:api myapp       # App-specific routes
npm run server api:status          # Check server health
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

# Explore and verify your work
npm run routes app:api hello        # See your new routes
npm run help validate              # Learn more about validation
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

# Explore your multi-feature app
npm run routes app:api hello           # See all features' routes
npm run routes app:api hello/greeting  # Focus on specific feature
npm run help routes                   # Learn more about route discovery
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