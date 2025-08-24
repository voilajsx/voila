# Voila Git Flow

Super simple Git workflow with validation - just 3 essential commands.

## Philosophy

- ✅ **Super Simple** - One branch type: `dev/username-appname`
- ✅ **Clear Structure** - `main → development → dev/username-appname`
- ✅ **Validation Gates** - Prevents broken code in Git history
- ✅ **App-Level Development** - One branch per app, progressive commits per feature

## Branch Structure

```
main                    # Production branch
development            # Integration branch
dev/username-appname   # Individual development branches
```

## Commands

### **3 Essential Commands:**

```bash
npm run git init [remote-url]                      # Initialize repository
npm run git branch <app>                           # Create app branch
npm run git commit <app>                           # Smart default commit
npm run git commit <app> -- --message="text"      # Custom commit message
npm run git push <app>                             # Push for PR
```

## Complete Workflow

### 1. Initialize Repository (One-time)
```bash
# Setup with remote (recommended)
npm run git init https://github.com/user/repo.git

# OR setup locally
npm run git init
```
**Creates:**
- `main` branch (production)
- `development` branch (integration)
- `.gitignore` for Voila projects

### 2. Start App Development
```bash
# Create your app development branch
npm run git branch welcome                    # → dev/john-welcome
npm run git branch climate                    # → dev/sarah-climate
npm run git branch converter                  # → dev/alex-converter
```

### 3. Progressive Development
```bash
# Work on features progressively, commit as you go
npm run git commit welcome -- --message="implement status feature"
npm run git commit welcome -- --message="implement hello feature"
npm run git commit welcome -- --message="add API tests"
npm run git commit welcome -- --message="update documentation"
```

### 4. Push for Review
```bash
npm run git push welcome
# → Final validation
# → Pushes dev/john-welcome
# → Ready for PR: dev/john-welcome → development
```

## What Each Command Does

### `npm run git init [remote-url]`
- Initialize Git repository
- Create .gitignore for Voila projects
- Create `main` and `development` branches
- Add remote repository (if URL provided)
- Create initial commit
- Push to remote (if URL provided)

### `npm run git branch <app>`
- Switch to `development` branch
- Pull latest `development` from remote
- Create branch: `dev/username-appname`
- Uses your Git `user.name` for unique branch naming

### `npm run git commit <app> [-- --message="text"]`
- Run validation pipeline (`npm run validate app:api <app>`)
- Stage all changes (`git add .`)
- Use smart default OR custom message if provided
- Smart default: `feat(app): update app implementation`

### `npm run git push <app>`
- Final validation check (`npm run validate app:api <app>`)
- Push current branch to remote with tracking
- Show next steps for PR creation

## Branch Naming

All development uses the same simple pattern:

```bash
dev/username-appname
```

**Examples:**
- `dev/john-welcome` - John working on welcome app
- `dev/sarah-climate` - Sarah working on climate app
- `dev/alex-converter` - Alex working on converter app

**Benefits:**
- ✅ **Crystal clear ownership** - who's working on what
- ✅ **No complexity** - one pattern for everything
- ✅ **No conflicts** - each developer has unique branches
- ✅ **Easy to find** - search for `dev/yourname-*`

## Development Flow

### Progressive Feature Development
```bash
# Create app branch once
npm run git branch welcome                  # → dev/john-welcome

# Develop features progressively with meaningful commits
npm run git commit welcome -- --message="add status endpoint with validation"
npm run git commit welcome -- --message="add hello endpoint with personalization"  
npm run git commit welcome -- --message="add comprehensive test suite"
npm run git commit welcome -- --message="update README and documentation"

# Push when ready for review
npm run git push welcome                   # → PR: dev/john-welcome → development
```

### Working on Multiple Apps
```bash
# Different apps = different branches
npm run git branch welcome                 # Work on welcome app
# ... develop welcome features ...
npm run git push welcome                   # Push welcome

npm run git branch climate                 # Work on climate app  
# ... develop climate features ...
npm run git push climate                   # Push climate
```

## Pull Request Flow

### Creating PRs
All PRs follow the same pattern:
```
Source: dev/username-appname
Target: development
Title: Add [appname] app
```

**Examples:**
- `dev/john-welcome → development` - "Add welcome app"
- `dev/sarah-climate → development` - "Add climate app"

### After Merge
1. PR gets merged to `development`
2. Team lead merges `development → main` for releases
3. Developer can start new app or continue existing work

## Validation

**Automatic validation runs before commit and push:**
- ✅ App-level validation (`npm run validate app:api <app>`)
- ✅ Ensures all Voila contracts are valid
- ✅ Prevents broken code from entering Git history

**If validation fails:**
- ❌ Command stops with clear error message
- ❌ No commit/push happens until issues are fixed
- ❌ Maintains code quality gates

## Integration with Standard Git

**You can mix Voila Git commands with standard Git:**

```bash
# Voila + Standard Git workflow
npm run git branch welcome                  # Voila: create dev/john-welcome
git status                                  # Standard: check status  
git diff                                    # Standard: see changes
npm run git commit welcome -- --message="add status API"  # Voila: validated commit
git log --oneline                          # Standard: see history
npm run git push welcome                   # Voila: validated push
```

**Standard Git commands work normally:**
- `git status`, `git log`, `git diff`
- `git stash`, `git cherry-pick`, `git rebase`
- `git checkout`, `git merge` (for local operations)

## Team Collaboration

### Developer Setup
```bash
# One-time setup
git config --global user.name "John Smith"
npm run git init https://github.com/company/monorepo.git
```

### Daily Workflow
```bash
# Pick an app to work on
npm run git branch welcome                          # Create dev/john-welcome

# Develop features progressively
npm run git commit welcome -- --message="implement status API"
npm run git commit welcome -- --message="add input validation"
npm run git commit welcome -- --message="write comprehensive tests"

# Push when app is complete
npm run git push welcome                           # Push for PR review
```

### Team Coordination
- **Multiple developers** can work on different apps simultaneously
- **No branch conflicts** due to unique `dev/username-appname` naming
- **Clear ownership** - easy to see who's working on what
- **Simple merges** - each PR is a complete app

## Examples

### Complete App Development
```bash
# Setup (once per developer)  
git config --global user.name "John Smith"
npm run git init https://github.com/company/app.git

# Start welcome app
npm run git branch welcome
# → dev/johnsmith-welcome created from development

# Progressive development
npm run git commit welcome -- --message="implement status feature with health checks"
npm run git commit welcome -- --message="implement hello feature with personalization"
npm run git commit welcome -- --message="add comprehensive API test suite"
npm run git commit welcome -- --message="update documentation and README"

# Push complete app
npm run git push welcome
# → Validation runs, pushes to remote
# → Create PR: dev/johnsmith-welcome → development
```

### Multiple Apps
```bash
# Work on climate app
npm run git branch climate                          # → dev/johnsmith-climate
npm run git commit climate -- --message="add weather service integration"
npm run git push climate

# Work on converter app  
npm run git branch converter                        # → dev/johnsmith-converter
npm run git commit converter -- --message="add currency conversion logic"
npm run git push converter

# Each app gets its own PR to development
```

## Error Handling

### Validation Failures
```bash
npm run git commit welcome
# Error: Validation failed: Contract validation
# → Fix contract issues in your app
# → Run 'npm run validate app:api welcome' to debug
# → Retry commit after fixing
```

### Git User Not Set
```bash
npm run git branch welcome
# Warning: Git user.name not set, using "dev"
# → Configure: git config --global user.name "Your Name"
# → Retry: npm run git branch welcome
```

### No Remote Repository
```bash
npm run git push welcome  
# Warning: No remote configured
# → Add remote: git remote add origin <url>
# → Or run: npm run git init <url>
```

## Best Practices

### Commit Strategy
- **Meaningful messages** - Describe what the commit accomplishes
- **Progressive development** - Commit after each major feature
- **Complete features** - Don't commit half-implemented functionality
- **Include tests** - Always commit tests with features

**Good commit messages:**
```bash
npm run git commit welcome -- --message="implement status endpoint with health monitoring"
npm run git commit welcome -- --message="add hello endpoint with name validation and personalization"
npm run git commit welcome -- --message="add comprehensive test suite with 95% coverage"
```

### Branch Management
- **One branch per app** - Keep app development isolated
- **Regular commits** - Commit meaningful progress frequently
- **Clean development** - Only push when app is complete

### Code Quality
- **Always validate** - Commands do this automatically
- **Write tests** - Include comprehensive test suites
- **Update docs** - Keep README and documentation current

## Integration with Voila Framework

This Git workflow integrates seamlessly with the complete Voila development process:

```bash
# Complete Voila workflow with Git integration
npm run context voila:framework               # Learn framework
npm run plan start welcome "welcome app"      # Plan your app
npm run generate workflow welcome             # Generate step-by-step workflow
npm run git init https://github.com/repo.git  # Initialize Git repository

# Follow the generated workflow:
# Step 1: Generate app structure
# Step 2: Initialize Git repository  
# Step 3: Create welcome app branch ← Git workflow starts
# ... implement all features ...
# Step 29: Commit welcome app ← Progressive Git commits
# Step 30: Push welcome app for PR ← Git workflow completes
# Step 31: Create Pull Request
```

The Git workflow is perfectly integrated with the systematic Voila development process, making app development both structured and simple.