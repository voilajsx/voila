# Voila Framework Scripts Documentation

Complete guide to all Voila framework scripts for development, testing, deployment, and project management.

## Quick Reference Table

| Script | Purpose | Usage | When to Use |
|--------|---------|-------|-------------|
| **[context](#context-script)** | Learning & project management | `npm run context <command>` | Learn framework, track progress, manage workflow |
| **[generate](#generate-script)** | Create apps, features & assets | `npm run generate <command>` | Generate applications, features, tests, auth tokens |
| **[validate](#validate-script)** | Contract & code validation | `npm run validate app:api [target]` | Validate contracts, types, and code quality |
| **[help](#help-script)** | Interactive help system | `npm run help [command]` | Get detailed help for any command |
| **[routes](#routes-script)** | API route discovery | `npm run routes [app] [feature]` | List and explore API endpoints |
| **[plan](#plan-script)** | Project planning workflow | `npm run plan <command> <app>` | Create, review, and approve planning documents |
| **[git](#git-script)** | Git workflow automation | `npm run git <command> [args]` | Validated git operations with Voila integration |
| **[test](#test-script)** | Unified testing interface | `npm run test app:api <target>` | Run unit, API, and compliance tests |
| **[deploy](#deploy-script)** | Deployment automation | `npm run deploy [environment]` | Deploy to staging or production |
| **[prisma](#prisma-script)** | Database management | `npm run prisma <command> <app>` | Manage Prisma schemas and migrations per app |
| **[server](#server-script)** | Server management | `npm run server <command>` | Start, stop, restart API servers |

### Development Scripts (Standard npm)

| Script | Purpose | Usage | When to Use |
|--------|---------|-------|-------------|
| **dev:api** | Development server | `npm run dev:api` | Hot reload development with TypeScript |
| **build** | Production build | `npm run build` | Compile TypeScript for production |
| **start** | Production server | `npm start` | Start compiled production server |
| **test** | Run tests | `npm test app:api <target>` | Alias for test script |
| **lint** | Code linting | `npm run lint` | ESLint TypeScript/TSX files |
| **typecheck** | Type checking | `npm run typecheck` | TypeScript type validation |
| **clean** | Clean build | `npm run clean` | Remove build artifacts |

---

## Context Script

**Purpose:** Learn Voila Framework patterns and manage project workflow with perfect session continuity.

### Usage
```bash
npm run context <command>
```

### Commands

#### Learning Commands
```bash
npm run context framework        # Learn complete Voila Framework patterns
npm run context change-request   # Learn change request workflow
npm run context app:api <name>   # Learn specific application structure
```

#### Project Management Commands
```bash
npm run context status           # Show project state, progress & next steps
npm run context next            # Get next action to execute
npm run context complete "<action>"  # Mark action done and advance
npm run context goto <step>     # Jump to specific step
npm run context reset          # Fresh start for new project
```

### When to Use
- **Learning Phase:** When you need to understand Voila patterns and architecture
- **Project Start:** Track progress through development workflow steps
- **Session Continuity:** Maintain context across multiple LLM conversations
- **Workflow Management:** Organize and track development tasks systematically

### Examples
```bash
# Learn the framework
npm run context framework

# Check current progress
npm run context status

# Mark a task complete
npm run context complete "implement authentication feature"

# Reset for new project
npm run context reset
```

---

## Generate Script

**Purpose:** Generate applications, features, test cases, and authentication assets with validation levels.

### Usage
```bash
npm run generate <command> [target] [-- options]
```

### Commands

#### Application Generation
```bash
npm run generate app:api <app>                    # Generate new API application
npm run generate app:api <app> -- --application  # Generate app explicitly  
npm run generate app:api <app> -- --testcases    # Generate API test cases
```

#### Feature Generation
```bash
npm run generate app:api <app>/<feature>              # Generate feature (essential validation - default)
npm run generate app:api <app>/<feature> -- --basic   # Basic validation
npm run generate app:api <app>/<feature> -- --essential # Essential validation
npm run generate app:api <app>/<feature> -- --strict  # Full validation
npm run generate app:api <app>/<feature> -- --none    # No validation
```

#### Authentication Setup
```bash
npm run generate secrets        # Generate all secrets (JWT, CSRF, etc.) in .env
npm run generate tokens         # Generate test tokens with user roles in .env.auth
```

#### Workflow Generation
```bash
npm run generate workflow <app> # Generate workflow from approved tech spec
```

### Validation Levels

| Level | Description | Use Case | Validation Scope |
|-------|-------------|----------|------------------|
| `--none` | No validation | Quick testing, rapid experimentation | No validation at all (0%) |
| `--basic` | Minimal validation | Rapid prototyping | Required fields + API endpoints only (~20%) |
| `--essential` | Core validation | Recommended for most projects (default) | Basic + services/events/tests (~80%) |
| `--strict` | Full validation | Enterprise, production systems | Essential + file imports + LLM comments (100%) |

### Options
```bash
--overwrite          # Overwrite existing files
--skip-existing      # Skip files that already exist
--application        # Generate application structure (default)
--testcases         # Generate API test cases from specifications
--strict            # Full validation - enterprise
--essential         # Core validation - recommended (default for features)
--basic             # Minimal validation - rapid prototyping
--none              # No validation - quick testing
```

### When to Use
- **Project Setup:** Create new applications and define structure
- **Feature Development:** Add new features with appropriate validation level
- **Testing:** Generate comprehensive test cases from API specifications
- **Authentication:** Set up secure authentication system quickly
- **Workflow Planning:** Generate structured development workflows

### Examples
```bash
# Create a new application
npm run generate app:api ecommerce

# Add feature with essential validation (default)
npm run generate app:api ecommerce/checkout

# Add feature with basic validation for rapid prototyping
npm run generate app:api ecommerce/checkout -- --basic

# Add feature with strict validation for enterprise
npm run generate app:api ecommerce/checkout -- --strict

# Add feature with no validation for quick testing
npm run generate app:api ecommerce/cart -- --none

# Generate test cases for existing app
npm run generate app:api ecommerce -- --testcases

# Set up authentication (2-step process)
npm run generate secrets
npm run generate tokens
```

---

## Validate Script

**Purpose:** Comprehensive validation of contracts, code quality, and TypeScript compliance.

### Usage
```bash
npm run validate app:api [target] [--skim]
```

### Commands
```bash
npm run validate app:api                    # Validate all apps
npm run validate app:api greeting          # Validate specific app
npm run validate app:api greeting/hello    # Validate specific feature
npm run validate app:api greeting -- --skim # Skip contracts, check comments/types only
```

### Validation Types

#### Full Validation (Default)
- Contract structure validation
- TypeScript type checking
- API endpoint validation
- Authentication configuration
- Cross-feature dependencies
- Test coverage analysis

#### Skim Mode (`--skim`)
- Comments and documentation
- TypeScript syntax
- Import/export statements
- Skip contract validation and tests

### When to Use
- **Development:** Before committing code changes
- **CI/CD:** Automated quality checks in pipelines
- **Code Review:** Ensure standards compliance
- **Deployment:** Pre-deployment validation
- **Refactoring:** Verify changes don't break contracts

### Examples
```bash
# Validate everything
npm run validate app:api

# Quick syntax check only
npm run validate app:api -- --skim

# Validate before deployment
npm run validate app:api ecommerce
```

---

## Help Script

**Purpose:** Interactive help system with detailed documentation for all commands.

### Usage
```bash
npm run help [command]
```

### Commands
```bash
npm run help                    # Show all available commands
npm run help generate          # Detailed help for generate command
npm run help validate          # Detailed help for validate command
npm run help context           # Detailed help for context command
```

### When to Use
- **Learning:** Understand command options and usage patterns
- **Reference:** Quick lookup of command syntax
- **Troubleshooting:** Find correct flags and parameters
- **Onboarding:** Help new team members learn the system

---

## Routes Script

**Purpose:** Discover and list API routes across applications and features.

### Usage
```bash
npm run routes [app] [feature]
```

### Commands
```bash
npm run routes                      # List all routes across all apps
npm run routes climate              # List routes for climate app
npm run routes climate weather      # List routes for climate/weather feature
```

### Output Information
- HTTP methods and paths
- Route handlers
- Authentication requirements
- Request/response schemas
- Feature organization

### When to Use
- **API Exploration:** Understand available endpoints
- **Documentation:** Generate API documentation
- **Testing:** Identify routes for API testing
- **Integration:** Plan client-side integrations
- **Debugging:** Verify route configurations

### Examples
```bash
# See all available APIs
npm run routes

# Check specific app endpoints  
npm run routes ecommerce

# Focus on specific feature
npm run routes ecommerce checkout
```

---

## Plan Script

**Purpose:** Agentic planning workflow with human control for project documentation and requirements.

### Usage
```bash
npm run plan <command> <app> [description]
```

### Commands
```bash
npm run plan start <app> "<description>"    # Generate planning document templates
npm run plan review <app>                   # Review planning completion status  
npm run plan approve <app>                  # Auto-approve planning documents
```

### Planning Documents Generated
- Business requirements document
- Technical specification
- API specifications
- Database schema plans
- Testing strategies

### When to Use
- **Project Initiation:** Create structured planning documents
- **Requirements Gathering:** Document business needs systematically
- **Technical Design:** Plan technical architecture and implementation
- **Team Alignment:** Ensure all stakeholders have clear documentation
- **Change Management:** Document and approve requirement changes

### Examples
```bash
# Start planning for new project
npm run plan start ecommerce "Multi-vendor marketplace platform"

# Review planning completeness
npm run plan review ecommerce

# Approve completed planning
npm run plan approve ecommerce
```

---

## Git Script

**Purpose:** Minimal Git workflow with Voila validation and conventional commit messages.

### Usage
```bash
npm run git <command> [args]
```

### Commands

#### Repository Setup
```bash
npm run git init [remote-url]              # Initialize Git repo
```

#### Branch Management  
```bash
npm run git branch <app>                   # Create feature branch (default)
npm run git branch <app> --fix            # Create bug fix branch
npm run git merge <app>                    # Smart merge to development
npm run git delete <app>                   # Safe delete merged branch
```

#### Commits and Push
```bash
npm run git commit <app>                   # Validated commit with conventional messages
npm run git commit <app> --feat           # Feature commit
npm run git commit <app> --fix            # Bug fix commit  
npm run git commit <app> --test           # Test commit
npm run git push <app>                     # Validated push for PR
```

### Features
- **Validation Integration:** Runs contract validation before commits
- **Conventional Commits:** Enforces proper commit message format
- **Branch Safety:** Prevents destructive operations
- **PR Ready:** Optimized for pull request workflows

### When to Use
- **Development Workflow:** Structured git operations with validation
- **Code Quality:** Ensure validation passes before commits
- **Team Collaboration:** Consistent branching and commit strategies
- **CI/CD Integration:** Prepare branches for automated pipelines

### Examples
```bash
# Set up repository
npm run git init https://github.com/company/project.git

# Create feature branch
npm run git branch ecommerce

# Make validated commit
npm run git commit ecommerce --feat

# Push for pull request
npm run git push ecommerce
```

---

## Test Script

**Purpose:** Unified testing interface for unit tests, API tests, and compliance checks.

### Usage
```bash
npm run test app:api <target> [-- options]
```

### Test Types

#### All Tests (Default)
```bash
npm run test app:api greeting              # Run all test types
```

#### Specific Test Types
```bash
npm run test app:api greeting -- --unittest      # Unit tests only
npm run test app:api greeting -- --apitest       # API tests only  
npm run test app:api greeting -- --compliance    # Compliance checks only
```

#### Feature-Level Testing
```bash
npm run test app:api greeting/hello -- --unittest  # Feature unit tests
```

### Test Coverage
- **Unit Tests:** Business logic and service layer testing
- **API Tests:** Endpoint behavior and integration testing
- **Compliance Tests:** Contract adherence and standards validation

### When to Use
- **Development:** Continuous testing during feature development
- **Pre-commit:** Validate changes before committing
- **CI/CD:** Automated testing in deployment pipelines
- **Regression Testing:** Ensure changes don't break existing functionality
- **Quality Assurance:** Comprehensive testing before releases

### Examples
```bash
# Test everything
npm run test app:api ecommerce

# Quick unit test check
npm run test app:api ecommerce -- --unittest

# Specific feature testing
npm run test app:api ecommerce/checkout -- --apitest
```

---

## Deploy Script

**Purpose:** Simple flyctl wrapper with Voila validation for staging and production deployments.

### Usage
```bash
npm run deploy [environment]
```

### Commands
```bash
npm run deploy                    # Deploy to staging (default)
npm run deploy staging           # Deploy to staging explicitly
npm run deploy production        # Deploy to production
```

### Pre-deployment Validation
- Contract validation
- TypeScript compilation
- Test execution
- Environment configuration check

### When to Use
- **Staging Deployment:** Test features in staging environment
- **Production Release:** Deploy validated code to production
- **Rollback Scenarios:** Quick deployment of previous versions
- **CI/CD Integration:** Automated deployment pipelines

### Examples
```bash
# Deploy to staging for testing
npm run deploy staging

# Production deployment
npm run deploy production
```

---

## Prisma Script

**Purpose:** Unified interface for all Prisma operations per application.

### Usage
```bash
npm run prisma <command> <app> [-- options]
```

### Commands

#### Database Setup
```bash
npm run prisma init <app>                    # Initialize Prisma for app
npm run prisma db:generate <app>            # Generate Prisma client
```

#### Migration Management
```bash
npm run prisma db:migrate <app> -- --name <migration-name>  # Create migration
npm run prisma db:push <app>                # Push schema changes
```

#### Database Tools
```bash
npm run prisma db:studio <app>              # Launch Prisma Studio
npm run prisma db:seed <app>                # Seed database
```

### Features
- **Per-App Isolation:** Each app manages its own database schema
- **Migration Safety:** Controlled database schema evolution
- **Development Tools:** Visual database exploration with Studio

### When to Use
- **Database Setup:** Initialize database schemas for new applications
- **Schema Evolution:** Create and apply database migrations
- **Data Management:** Seed databases and explore data
- **Development:** Use Studio for visual database management

### Examples
```bash
# Set up database for new app
npm run prisma init ecommerce

# Create a new migration
npm run prisma db:migrate ecommerce -- --name add_user_profiles

# Launch database explorer
npm run prisma db:studio ecommerce
```

---

## Server Script

**Purpose:** Server management for API development and production environments.

### Usage
```bash
npm run server <command>
```

### Commands
```bash
npm run server start             # Start API server
npm run server stop             # Stop running server
npm run server restart          # Restart server (refresh discovery)
npm run server status           # Check server health and status
```

### Server Features
- **Hot Reload:** Automatic restart on code changes in development
- **Health Monitoring:** Built-in health checks and status reporting
- **Contract Discovery:** Automatic API route discovery and mounting
- **Process Management:** Safe start/stop operations

### When to Use
- **Development:** Manual server management during development
- **Testing:** Start servers for API testing
- **Debugging:** Restart servers to refresh contract discovery
- **Production:** Server management in production environments

### Examples
```bash
# Start development server
npm run server start

# Check if server is running
npm run server status

# Restart to refresh routes
npm run server restart
```

---

## Best Practices

### Development Workflow
1. **Start with Planning:** `npm run plan start <app> "<description>"`
2. **Generate Structure:** `npm run generate app:api <app>`
3. **Start Development Server:** `npm run dev:api` (hot reload during development)
4. **Add Features:** `npm run generate app:api <app>/<feature>` (essential validation)
5. **Validate Continuously:** `npm run validate app:api <app>`
6. **Test Regularly:** `npm run test app:api <app>`
7. **Type Check:** `npm run typecheck` (before commits)
8. **Lint Code:** `npm run lint` (code quality)
9. **Use Git Integration:** `npm run git commit <app> --feat`

### Validation Strategy
- Use `--none` for quick testing and experimentation
- Use `--basic` for rapid prototyping (minimal validation)
- Use `--essential` for most projects (recommended default)
- Use `--strict` for enterprise and production systems
- Always validate before committing: `npm run validate app:api`

### Authentication Setup
```bash
# One-time setup for any project
npm run generate secrets
npm run generate tokens
```

### Testing Strategy
```bash
# Development cycle
npm run test app:api myapp -- --unittest    # Quick feedback
npm run test app:api myapp -- --apitest     # Integration testing
npm run test app:api myapp                  # Full validation before commit
```

### Build & Production Workflow
```bash
# Pre-build validation
npm run lint              # Code quality check
npm run typecheck         # TypeScript validation
npm run validate app:api  # Contract validation
npm run test app:api myapp # Full test suite

# Build for production
npm run clean            # Clean previous builds
npm run build            # Compile TypeScript

# Start production server locally (testing)
npm start               # Test compiled build

# Deploy to environments
npm run deploy staging    # Test in staging
npm run deploy production # Production deployment
```

## Quick Start Commands

```bash
# Complete project setup
npm run plan start myapp "Description"
npm run plan approve myapp
npm run generate app:api myapp
npm run generate secrets
npm run generate tokens

# Development cycle  
npm run dev:api                               # Start hot reload server
npm run generate app:api myapp/feature
npm run validate app:api myapp
npm run test app:api myapp
npm run lint && npm run typecheck            # Quality checks
npm run git commit myapp --feat

# Deployment
npm run deploy staging
npm run deploy production
```

This documentation provides comprehensive coverage of all Voila framework scripts, their usage patterns, and integration workflows. Each script is designed to work together as part of a cohesive development experience.