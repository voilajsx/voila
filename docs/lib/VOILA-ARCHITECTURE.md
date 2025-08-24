# Voila Framework Architecture - Core Concepts

## Philosophy

**Contract-Driven Development**: Define behavior in contracts before implementation.
**Auto-Discovery**: Framework automatically discovers and loads features.
**Enterprise-Ready**: Built for scalability, testing, and team collaboration.

## Key Principles

1. **Contracts Drive Everything** - VoilaFeatureContract defines all behavior
2. **Feature Isolation** - Each feature is self-contained and discoverable
3. **Quality First** - 95% test coverage and validation gates required
4. **Developer Productivity** - Generate, validate, test with single commands

## Architecture Overview

```
src/api/
├── myapp/                          # Application
│   ├── features/                   # Feature isolation
│   │   └── greeting/               # Feature module
│   │       ├── greeting.index.ts  # ← Contract (defines everything)
│   │       ├── greeting.types.ts  # ← Types & validation schemas
│   │       ├── greeting.services.ts # ← Business logic
│   │       ├── greeting.routes.ts # ← Express routes
│   │       └── greeting.test.ts   # ← Unit tests
│   ├── spec/myapp.api.spec.yml    # API specification
│   └── myapp.config.json          # App configuration
└── lib/                           # Shared framework code
```

## Contract-Driven Flow

1. **Contract Definition** (`greeting.index.ts`)
   ```typescript
   export const GreetingContract: VoilaFeatureContract = {
     name: 'greeting',
     api: { basePath: '/api/myapp', endpoints: [...] },
     provides: { services: ['GreetingService'], routes: [...] }
   };
   ```

2. **Auto-Discovery Process**
   - Framework scans `src/api/*/features/*/` 
   - Loads all `*.index.ts` files
   - Registers contracts, routes, and services
   - No manual registration required

3. **Implementation Stack**
   - **Types**: Zod schemas + TypeScript interfaces
   - **Services**: Business logic using AppKit modules  
   - **Routes**: Express handlers with validation
   - **Tests**: Unit tests with AppKit test utilities

## Feature Lifecycle

### Development
```bash
npm run generate app:api myapp/greeting  # Generate feature templates
# Edit contract → Implement stack → Write tests
npm run validate app:api myapp           # Validate contracts
npm run test app:api myapp/greeting      # Run feature tests
```

### Integration  
```bash
npm run test app:api myapp               # Full app testing
# Unit tests → API tests → Compliance checks
```

### Deployment
```bash
npm run deploy staging                   # Deploy with validation
npm run deploy production               # Production deployment
```

## VoilaFeatureContract Structure

```typescript
interface VoilaFeatureContract {
  // Identity
  name: string;           // Feature name
  app: string;           // Parent application
  description: string;   // What this feature does
  
  // API Definition
  api: {
    basePath: string;           // Base path for routes
    endpoints: Array<{          // All HTTP endpoints
      method: string;           // GET, POST, PUT, DELETE
      path: string;            // Endpoint path
      handler: string;         // Service method
      summary: string;         // Description
    }>;
  };
  
  // Dependencies
  dependencies: {
    files: Record<string, {     // Per-file dependencies
      appkit: string[];         // AppKit modules needed
      external: string[];       // External packages
    }>;
  };
  
  // What This Feature Provides
  provides: {
    services: string[];         // Service class names
    routes: string[];          // Full route paths
    types: string[];           // Exported type names
  };
}
```

## AppKit Integration

**AppKit provides 12 modules** for common enterprise patterns:

### Core Stack (80% usage)
```typescript
import { util, logger, error, validator } from '@voilajsx/appkit';
```

### Extended Stack (20% usage)  
```typescript
import { http, data, config, auth, cache, test, debug, types } from '@voilajsx/appkit';
```

**One Function Rule**: Each module has one primary purpose and consistent API.

## Auto-Discovery Mechanism

1. **Startup Scan**
   ```
   src/api/ scan → find */features/*/*.index.ts → load contracts
   ```

2. **Route Registration**
   ```
   Contract endpoints → Express router → Auto-mount at basePath
   ```

3. **Service Discovery**
   ```
   Contract provides.services → Register for dependency injection
   ```

4. **Type System Integration**
   ```
   Contract provides.types → Available for cross-feature usage
   ```

## Testing Architecture

### Test Levels
1. **Unit Tests** (`feature.test.ts`) - Service logic, 95% coverage
2. **API Tests** (Generated Excel) - Endpoint validation
3. **Compliance Tests** - Cross-feature contract validation

### Quality Gates
- **Pre-commit**: Contract validation + Unit tests
- **Pre-merge**: Full test suite (unit + API + compliance)
- **Pre-deploy**: Build validation + Integration tests

## Scalability Patterns

### Monolithic Start
- All features in single codebase
- Shared database and configuration
- Single deployment unit

### Microservice Evolution  
- Features become independent services
- Contract-driven API boundaries maintained
- Gradual extraction without rewrite

### Team Collaboration
- Feature-based ownership
- Contract changes require team approval
- Independent feature development cycles

## Development Workflow Integration

### Planning → Workflow → Implementation
```
Business Requirements → Technical Specification → Workflow Generation → Feature Contracts
```

### Implementation → Testing
```
Contract Definition → Code Generation → Unit Testing → Integration Testing
```

### Testing → Deployment
```
Validation Gates → Git Workflow → Staging → Production
```

## LLM Context & State Management

**Voila's Secret Weapon**: Seamless LLM session continuity that makes development feel magical.

### The Problem Voila Solves
When working with LLM assistants (Claude, ChatGPT, etc.), you lose context every time:
- Browser crashes or times out
- Start new conversation
- Switch between tasks
- Come back after hours/days

**Result**: Constant re-explaining where you are, what you're building, what was last done.

### Voila's Solution: Dual-File State Tracking

**Smart State Capture**:
```
.voila/
├── actions.log         # Complete chronological history  
└── state.json         # Current project context
```

### How It Works

**1. Automatic Context Capture**
Every major action automatically updates both files:
```bash
npm run plan start ecommerce     # → Logs planning start
npm run generate app:api ecommerce  # → Logs app structure 
npm run git branch ecommerce           # → Logs app branch (dev/username-ecommerce)
npm run git -- commit ecommerce --feat              # → Logs: feat(ecommerce): implement features
```

**2. Instant Context Recovery**
```bash
npm run context state:resume    # Perfect project restoration
```

**Sample Resume Output**:
```markdown
# Resume Session

## Current Project State
- App: ecommerce
- Feature: products  
- Phase: app-development  
- Branch: dev/john-ecommerce
- Last Update: 8/23/2024, 6:15:10 PM

## Progress Tracking
Planning: ✅ Business Requirements ✅ Technical Spec ✅ Approved
Development: ✅ App Structure ✅ Feature In Progress ❌ Tests Written
Deployment: ❌ Staging ❌ Production

## Next Steps
1. Implement remaining routes: POST /products, PUT /products/:id
2. Write unit tests for ProductService methods  
3. Run npm run test app:api ecommerce/products --unittest

## Recent Actions (Last 5)
- generate_app: Generated app structure for 'ecommerce'
- git_branch: Created app branch 'dev/john-ecommerce'
- generate_feature: Generated feature 'products' templates
- implement_contract: Updated ProductContract with 5 endpoints
- implement_services: Implemented ProductService CRUD methods

## Current Git Status
- Status: Modified files present
- Modified Files: products.services.ts, products.types.ts
```

**3. What This Gives You**

**Perfect LLM Continuity**:
- ✅ **Instant Context**: New Claude session knows exactly where you stopped
- ✅ **Smart Next Steps**: AI knows what to do next based on current phase  
- ✅ **Progress Clarity**: Visual checkboxes show completed vs pending work
- ✅ **Full History**: Complete audit trail of development journey
- ✅ **Git Integration**: Current branch, commits, file changes included
- ✅ **Zero Setup**: Works automatically, no configuration needed

**Developer Superpowers**:
```bash
# Lost context? Fixed in 5 seconds:
npm run context state:resume
# → Claude now knows your entire project state

# Quick activity check:
npm run context state:latest
# → See last 5 actions with timestamps

# Fresh start (new project):  
npm run context state:reset
# → Clean slate for new work
```

### Real Developer Benefits

**Before Voila State Management**:
```
🤖 Claude: "What are you working on?"
👤 You: "I'm building an ecommerce app..."
🤖 Claude: "What features do you need?"  
👤 You: "I already started products feature..."
🤖 Claude: "What's your tech stack?"
👤 You: "TypeScript, Express... I already told you..."
```

**After Voila State Management**:
```bash
npm run context state:resume
```
```
🤖 Claude: "I see you're working on the ecommerce app, specifically the products feature. You've implemented the ProductService CRUD methods and need to add the remaining routes (POST, PUT, DELETE). The contract is defined and you're on branch dev/john-ecommerce. Ready to implement the routes or write tests first?"
👤 You: "Perfect, let's do the routes!"
```

**The Magic**: Claude becomes your persistent development partner who never forgets your project context.

## Workflow Management

**Voila's Step-by-Step Development Engine**: Ensures systematic feature development with zero shortcuts.

### The Problem It Solves

**Common Development Issues**:
- Claude skips steps and rushes ahead  
- Features built simultaneously instead of one-at-a-time
- No clear development sequence or priorities
- Missing validation steps and quality gates
- Lost track of what's completed vs pending

### Voila's Solution: Contract-Driven Workflows

**⚠️ CRITICAL TIMING**: Generate workflow immediately after planning approval, before any other commands.

**Workflow Generation from Tech Specs**:
```bash
# After both planning documents show STATUS: APPROVED
npm run generate workflow myapp        # Generate and validate workflow (REQUIRED STEP)
```

**Built-in Validation**: Generation process validates the workflow and refuses to create invalid workflows. No separate validation commands needed.

**Generated Workflow Structure**:
```yaml
# .voila/workflow.yml
project: myapp
current_step: 3
steps:
  1:
    name: "Generate app structure"
    command: "npm run generate app:api myapp"
    status: "completed"
  2: 
    name: "Update API specification"
    file: "src/api/myapp/spec/myapp.api.spec.yml"
    status: "completed"
  3:
    name: "Generate currency feature"
    command: "npm run generate app:api myapp/currency"
    status: "in_progress"
  4:
    name: "Implement currency contract"
    action: "implement"
    file: "src/api/myapp/features/currency/currency.index.ts"
    status: "pending"
```

### Workflow Commands

**Essential Workflow Commands** (only 3):
```bash
npm run generate workflow myapp        # Generate validated workflow 
npm run context workflow:status        # Show current progress
npm run context workflow:next          # Get next step to execute
```

**Sample Workflow Status Output**:
```
🔄 Workflow Status: converter
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Progress: Step 3/15 (20% complete)

✅ Completed (2):
   1. Generate app structure
   2. Update API specification

🔄 In Progress (1):
   3. Generate currency feature (started 15 mins ago)

⏳ Next Steps (5):
   4. Implement currency contract
   5. Implement currency types
   6. Implement currency services
   ...
```

### Key Benefits

**Enforced Quality Gates**:
- ✅ **Sequential Development**: One feature fully complete before next
- ✅ **Validation Gates**: Must pass tests before proceeding  
- ✅ **Clear Priorities**: Tech spec defines feature implementation order
- ✅ **Progress Tracking**: Visual progress with completion percentages
- ✅ **Human Control**: Workflow easily customizable in `.voila/workflow.yml`

**Perfect LLM Integration**:
```bash
# Lost context? Workflow shows exactly what to do next:
npm run context workflow:next
# → "Next Step: #4 - Implement currency contract"
# → "File: src/api/converter/features/currency/currency.index.ts"
# → "Action: implement"
```

**The Result**: No more Claude rushing ahead or skipping steps. Systematic, quality-driven development every time.

---

**For detailed implementation examples**: See `VOILA-COMPLETE-GUIDE.md` for step-by-step instructions and troubleshooting.