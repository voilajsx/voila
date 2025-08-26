# Voila Framework - Quick Start

**Contract-driven development platform for TypeScript/Express.js applications.**

## Core Commands

```bash
# Setup & Planning
npm run context voila:framework            # Learn framework
npm run plan start myapp "description"     # Create planning docs
# Complete [FILL_IN] sections, change STATUS to APPROVED in both files
npm run generate workflow myapp            # Generate step-by-step workflow (REQUIRED after planning approval)
npm run git init https://github.com/user/repo.git  # Initialize Git (creates main + development)

# Development Workflow (3 Essential Commands)
npm run generate workflow myapp            # Generate validated workflow from approved tech spec
npm run context status                     # Show current progress
npm run context next                       # Get next step to execute

# App-Level Development (super simple!)
npm run generate app:api myapp             # Generate app structure
npm run git branch myapp                   # Create dev/username-myapp branch
# Implement all features progressively on same branch with conventional commits
npm run git commit myapp --feat           # feat(myapp): implement features
npm run git commit myapp --test           # test(myapp): add test coverage
npm run test app:api myapp                 # Full test suite

# Integration & Deployment
npm run generate app:api myapp -- --testcases     # Generate API tests
npm run test app:api myapp -- --apitest           # Run API integration tests
npm run test app:api myapp -- --compliance        # Run compliance testing
npm run git commit myapp --docs           # docs(myapp): update documentation
npm run git merge myapp                    # Smart merge dev → development (optional)
npm run git delete myapp                   # Safe delete merged branch (optional)
npm run git push myapp                     # Push current branch for PR
npm run deploy staging                             # Deploy to staging
npm run deploy production                          # Deploy to production
```

## Development Phases

### Phase 1: Planning
1. `npm run plan start myapp "description"` - Generate planning templates
2. Complete `[FILL_IN]` sections in generated business/technical docs
3. **Update Implementation Workflow section** - Define feature sequence and priorities
4. Change `STATUS: UNDER_REVIEW` to `STATUS: APPROVED` in both files
5. `npm run git init [remote-url]` - Initialize repository (creates main + development branches)

### Phase 2: Workflow Setup (REQUIRED after planning approval)
**⚠️ CRITICAL: Do this immediately after planning approval, before any generation**
1. `npm run generate workflow myapp` - Generate and validate step-by-step workflow from approved tech spec
2. `npm run context status` - View workflow progress and validation summary
3. `npm run context next` - Get next step to execute

**Built-in validation ensures only proper workflows are generated. No manual fixes needed.**

### Phase 3: Systematic Development (Follow Workflow)
**⚠️ CRITICAL: Use workflow commands instead of manual decisions**

1. `npm run context next` - Get current step to work on
2. Execute the command or action shown by next
3. `npm run context status` - Mark progress and get next step
4. Repeat until workflow complete

**Original Phase 3-4 commands are now managed by the workflow system.**

### App-Level Development (now handled by workflow)
- `npm run generate app:api myapp` - App boilerplate (Step 1 in workflow)
- `npm run git branch myapp` - App branch: dev/username-myapp (Step 3 in workflow)  
- `npm run generate app:api myapp` - App structure and features (Step 6+ in workflow)
4. **Define Contract** (`feature.index.ts`):
   ```typescript
   export const FeatureContract: VoilaFeatureContract = {
     name: 'feature', app: 'myapp',
     api: { basePath: '/api/myapp', endpoints: [...] },
     dependencies: { files: {...} },
     provides: { services: [...], routes: [...] }
   };
   ```
4. **Implement Stack**:
   - `feature.types.ts` - Zod schemas & TypeScript types
   - `feature.services.ts` - Business logic with AppKit
   - `feature.routes.ts` - Express routes with validation
   - `feature.test.ts` - Unit tests (95% coverage required)
5. `npm run test app:api myapp -- --unittest` - Validate implementation
6. `npm run context status` - Mark feature complete, get next steps

### Phase 5: Integration & Deployment
1. `npm run generate app:api myapp -- --testcases` - Generate Excel API tests
2. `npm run test app:api myapp -- --apitest` - Run API integration tests
3. `npm run test app:api myapp -- --compliance` - Run compliance testing
4. `npm run test app:api myapp` - Run full test suite (unit + API + compliance)
5. `npm run git commit myapp --docs` - docs(myapp): update documentation
6. `npm run git merge myapp` - Smart merge dev → development (optional)
7. `npm run git delete myapp` - Safe delete merged branch (optional)
8. `npm run git push myapp` - Push current branch for team review
9. Create PR, get approval, merge to development
10. `npm run deploy staging` - Deploy and test staging
11. `npm run deploy production` - Deploy to production

## Essential Patterns

### VoilaFeatureContract Template
```typescript
import { VoilaFeatureContract } from '../../../lib/contracts.js';

export const MyFeatureContract: VoilaFeatureContract = {
  name: 'myfeature',
  app: 'myapp',
  description: 'Feature description',
  api: {
    basePath: '/api/myapp',
    endpoints: [
      {
        method: 'GET',
        path: '/endpoint',
        handler: 'MyService.method',
        summary: 'Endpoint description'
      }
    ]
  },
  dependencies: {
    files: {
      "myfeature.services.ts": {
        appkit: ["util", "logger", "error"],
        external: []
      }
    }
  },
  provides: {
    services: ['MyService'],
    routes: ['/api/myapp/endpoint'],
    types: ['MyType']
  }
};
```

### Service Implementation Pattern
```typescript
// myfeature.services.ts
import { util, logger, error } from '@voilajsx/appkit';

export class MyService {
  static async method(data: MyRequest): Promise<MyResponse> {
    try {
      logger.info('Processing request', { data });
      // Business logic here
      return util.success({ result: 'data' });
    } catch (err) {
      throw error.business('Operation failed', err);
    }
  }
}
```

### Routes Pattern
```typescript
// myfeature.routes.ts
import { Router } from 'express';
import { MyService } from './myfeature.services.js';
import { MyRequestSchema } from './myfeature.types.js';

const router = Router();

router.get('/endpoint', async (req, res, next) => {
  try {
    const validated = MyRequestSchema.parse(req.query);
    const result = await MyService.method(validated);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export { router as myfeatureRoutes };
```

### Types Pattern
```typescript
// myfeature.types.ts
import { z } from 'zod';

export const MyRequestSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional()
});

export const MyResponseSchema = z.object({
  result: z.string(),
  timestamp: z.string().datetime()
});

export type MyRequest = z.infer<typeof MyRequestSchema>;
export type MyResponse = z.infer<typeof MyResponseSchema>;
```

## Git Workflow

### Branch Structure
```
main                    # Production branch
development            # Integration branch
dev/username-appname   # Individual development
```

### App Development
```bash
npm run git branch myapp                   # Creates dev/username-myapp
```

### Progressive Commits
```bash
# Conventional commit flags (simple & powerful!)
npm run git commit myapp --feat           # feat(myapp): implement features
npm run git commit myapp --fix            # fix(myapp): resolve issues
npm run git commit myapp --test           # test(myapp): add test coverage
npm run git commit myapp --docs           # docs(myapp): update documentation
npm run git commit myapp --chore          # chore(myapp): maintenance updates

# Traditional options
npm run git commit myapp                  # Smart default: feat(myapp): update app implementation
npm run git commit myapp -- --message="custom message"  # Custom message
```

### Integration & Cleanup (Optional)
```bash
npm run git merge myapp                   # Smart merge dev → development
npm run git delete myapp                  # Safe delete merged branch
```

### Push for Review
```bash
npm run git push myapp                     # Push dev/username-myapp → development
```

### Branch Benefits
- ✅ **Super simple** - Only one branch type: `dev/username-appname`
- ✅ **Clear ownership** - Easy to see who's working on what
- ✅ **No conflicts** - Each developer has unique branches
- ✅ **Progressive commits** - Track development progress per feature

## Deployment

### Staging
```bash
npm run deploy staging                     # Deploy to staging environment
```

### Production
```bash
npm run deploy production                  # Deploy to production (main branch only)
```

**Deployment includes**: validation → build → flyctl deploy → health verification

## Validation & Testing

### Contract Validation
```bash
npm run validate app:api                   # Validate all apps
npm run validate app:api myapp             # Validate specific app
```

### Testing Levels
```bash
npm run test app:api myapp -- --unittest        # Unit tests only
npm run test app:api myapp -- --apitest            # API integration tests
npm run test app:api myapp                          # All tests (unit + API + compliance)
```

### Quality Gates
- **95% test coverage** required for all features
- **Contract validation** must pass before commit
- **Integration tests** must pass before merge
- **Build validation** required for deployment

## AppKit Core Modules

### Most Common Usage
```typescript
import { util, logger, error, validator } from '@voilajsx/appkit';

// Success/Error responses
return util.success(data);
throw error.business('Message', originalError);

// Logging
logger.info('Message', { context });
logger.error('Error occurred', error);

// Validation
const result = validator.validate(schema, data);
```

### When You Need More
```typescript
import { http, config, auth, cache } from '@voilajsx/appkit';

// HTTP clients, configuration, authentication, caching
```

## LLM Session Management ⚡

**Voila's Superpower**: Never lose development context again!

### Session Continuity Commands
```bash
npm run context state:resume      # Complete project restoration - shows exactly where you left off
npm run context state:latest      # Quick check - last 5 actions with timestamps  
npm run context state:reset       # Fresh start - clean slate for new projects
```

### How It Works Automatically
```bash
# Every major action is tracked:
npm run plan start myapp           # ✅ Logged: Planning started
npm run generate app:api myapp     # ✅ Logged: App structure created  
npm run git branch myapp           # ✅ Logged: App branch created (dev/username-myapp)
npm run git commit myapp --feat   # ✅ Logged: Changes committed with conventional commit
npm run git merge myapp            # ✅ Logged: Smart merge to development completed
npm run git delete myapp           # ✅ Logged: Safe branch deletion completed
```

### The Developer Experience Magic

**❌ Old way** (frustrating):
```
🤖 "What are you working on?"
👤 "I'm building... wait, what was I doing?"
🤖 "What's your tech stack again?"  
👤 "Let me remember where I left off..."
```

**✅ Voila way** (effortless):
```bash
npm run context state:resume
# Claude instantly knows:
# - Current app & feature
# - What you completed  
# - What's next to do
# - Git branch & file changes
# - Exact next steps
```

**Result**: Claude becomes your persistent coding partner who never forgets your project!

### Perfect for:
- 🔄 **Session crashes** - Browser dies, work continues  
- 🌙 **Next day development** - Pick up exactly where you stopped
- 👥 **Team handoffs** - New developer gets full context instantly
- 🚀 **Context switching** - Jump between multiple projects seamlessly

## Help Commands

```bash
npm run help                              # All available commands
npm run help generate                     # Help for specific command
npm run routes                           # List all API routes
npm run routes app:api myapp             # Routes for specific app
```

## Troubleshooting

### Common Issues
```bash
# Planning not approved
npm run plan review myapp
npm run plan approve myapp

# Validation failed
npm run validate app:api myapp           # See specific errors

# Tests failing
npm run test app:api myapp -- --unittest        # Test specific app

# Git issues
git config --global user.name "Your Name"
npm run git init https://github.com/user/repo.git  # Creates main + development branches

# Deployment issues
curl -L https://fly.io/install.sh | sh  # Install flyctl
flyctl launch                           # Setup fly.io config
```

---

**For detailed documentation**: Load on-demand guides for complete examples and troubleshooting.