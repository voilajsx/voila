# Voila Framework - Troubleshooting Guide

## Common Command Failures

### Planning Issues
```bash
# Error: Planning not approved
npm run plan review myapp        # Check completion status
npm run plan approve myapp       # Auto-approve if complete

# Error: [FILL_IN] sections remaining  
# Edit the markdown files in docs/planning/myapp/ to complete missing sections
```

### Generation Issues
```bash
# Error: App already exists
npm run generate app:api myapp -- --overwrite

# Error: Planning not approved  
npm run plan approve myapp

# Error: Feature already exists
npm run generate app:api myapp/feature -- --overwrite
```

### Validation Issues
```bash
# Error: Contract validation failed
npm run help validate           # Learn about validation
# Fix contracts and implementations based on error messages

# Error: Contract export not found
# Ensure your feature.index.ts exports the contract:
# export const FeatureContract: VoilaFeatureContract = {...};

# Error: API endpoints mismatch
# Ensure contract endpoints match your routes implementation
```

### Testing Issues
```bash
# Error: Unit tests failing
npm run test app:api myapp/feature -- --unittest  # Test specific feature
# Review test output and fix implementations

# Error: API tests failing
npm run server api:status       # Check server is running
npm run dev:api                 # Start server if needed

# Error: Coverage below 95%
# Add tests for uncovered branches and error handling paths

# Error: Mock setup issues
# Check AppKit module mocking in test files
```

### Server Issues
```bash
# Error: Port in use
npm run server api:stop         # Stop existing servers
npm run server api:restart      # Clean restart

# Error: Routes not discovered
npm run validate app:api myapp  # Check contract exports
npm run routes app:api myapp    # Verify route discovery

# Error: Module not found
# Check dependencies in contract match actual imports in service files
```

### Git Issues
```bash
# Error: Git user.name not set
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"

# Error: Validation failed during commit
npm run validate app:api myapp  # Fix validation issues first
npm run git commit myapp/feature # Retry commit

# Error: No remote configured
npm run git init https://github.com/user/repo.git  # Add remote

# Error: Branch creation failed
# Ensure you're in the project root directory
# Check that Git is initialized: ls -la .git

# Error: Push failed - no upstream branch
# Remote repository may not exist or authentication failed
# Verify remote URL: git remote -v
```

### Deployment Issues
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

# Error: Authentication failed
flyctl auth login               # Login to fly.io

# Error: App doesn't exist
flyctl launch                   # Create new app
# Or check existing apps: flyctl apps list
```

## Development Workflow Issues

### Contract Definition Problems
```bash
# Problem: Contract is complex and confusing
# Solution: Start simple, add complexity gradually
export const SimpleContract: VoilaFeatureContract = {
  name: 'simple',
  app: 'myapp',
  api: { basePath: '/api/myapp', endpoints: [] }, # Start empty
  dependencies: { files: {} },                    # Add as needed
  provides: { services: [], routes: [], types: [] }
};
```

### Implementation Mismatches
```bash
# Problem: Service method doesn't match contract handler
# Contract: handler: 'GreetingService.sayHello'
# Service: Must export class GreetingService with static sayHello method

# Problem: Route path doesn't match contract
# Contract: path: '/hello'  
# Routes: Must handle basePath + path = '/api/myapp/hello'
```

### Test Writing Issues
```bash
# Problem: Don't know what to test
# Solution: Test contract-defined behavior
# - Test each service method mentioned in contract
# - Test success cases and error cases
# - Mock AppKit dependencies
# - Aim for 95% coverage

# Problem: AppKit mocking
import { jest } from '@jest/globals';
jest.mock('@voilajsx/appkit', () => ({
  util: { success: jest.fn() },
  logger: { info: jest.fn(), error: jest.fn() },
  error: { business: jest.fn() }
}));
```

## Performance Issues

### Slow Test Execution
```bash
# Run specific tests only
npm run test app:api myapp/feature -- --unittest
npm run test app:api myapp -- --apitest

# Check for async issues in tests
# Ensure all promises are awaited
# Use proper cleanup in test teardown
```

### Slow Server Startup
```bash
# Check for contract loading issues
npm run validate app:api           # Ensure all contracts are valid
npm run routes                     # Check route discovery

# Review complex contract dependencies
# Simplify overly complex dependency graphs
```

### Memory Issues
```bash
# Check for memory leaks in services
# Ensure proper cleanup of resources
# Review caching implementation if using cache module
```

## Getting Help

### Command-Specific Help
```bash
npm run help                    # See all commands
npm run help generate           # Learn about generation
npm run help test              # Learn about testing
npm run help validate          # Learn about validation
npm run help git               # Git workflow help
npm run help deploy            # Deployment help
```

### Exploration Commands
```bash
npm run routes                 # See all routes
npm run routes app:api myapp   # App-specific routes
npm run context voila:framework # Learn framework patterns
```

### Debug Information
```bash
# Enable debug mode for more detailed error messages
DEBUG=1 npm run validate app:api myapp
DEBUG=1 npm run test app:api myapp
DEBUG=1 npm run deploy staging
```

## Environment Setup Issues

### Node.js Version Issues
```bash
# Check Node.js version (requires 18+)
node --version

# If wrong version, use nvm:
nvm install 18
nvm use 18
```

### npm Issues  
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check npm version (requires 9+)
npm --version
```

### TypeScript Issues
```bash
# Check TypeScript compilation
npm run typecheck

# Clear TypeScript cache
npx tsc --build --clean
```

## When All Else Fails

1. **Check the complete guide**: `VOILA-COMPLETE-GUIDE.md` for detailed examples
2. **Review working examples**: Look at generated code for patterns
3. **Start simple**: Create minimal working contract, then add complexity
4. **Compare with generated templates**: Ensure your implementation matches expected patterns
5. **Check dependencies**: Verify all AppKit modules are properly imported and used