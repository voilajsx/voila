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

### **Essential Commands:**

```bash
npm run git init [remote-url]                      # Initialize repository
npm run git branch <app>                           # Create app branch

# Conventional commit flags (simple & powerful!)
npm run git commit <app> --feat                    # feat(app): implement features
npm run git commit <app> --fix                     # fix(app): resolve issues
npm run git commit <app> --test                    # test(app): add test coverage
npm run git commit <app> --docs                    # docs(app): update documentation
npm run git commit <app> --chore                   # chore(app): maintenance updates

# Integration & cleanup
npm run git merge <app>                            # Smart merge dev → development
npm run git delete <app>                           # Safe delete merged branch

# Traditional options
npm run git commit <app>                           # Smart default commit
npm run git commit <app> -- --message="text"      # Custom commit message

npm run git push <app>                             # Push current branch for PR
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
# Work on features progressively with conventional commits
npm run git commit welcome --feat                  # After implementing status feature
npm run git commit welcome --feat                  # After implementing hello feature
npm run git commit welcome --test                  # After adding API tests
npm run git commit welcome --docs                  # After updating documentation
```

### 4. Integration & Cleanup (Optional)
```bash
npm run git merge welcome                          # Merge dev → development for integration
npm run git delete welcome                         # Clean up merged dev branch
```

### 5. Push for Review
```bash
npm run git push welcome
# → Final validation
# → Pushes current branch (development if merged, or dev branch)
# → Ready for PR creation
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

### `npm run git commit <app> [flags]`
- Run validation pipeline (`npm run validate app:api <app>`)
- Stage all changes (`git add .`)
- Generate conventional commit message based on flag or custom message

**Conventional Commit Flags:**
- `--feat`: `feat(app): implement features` - New functionality
- `--fix`: `fix(app): resolve issues` - Bug fixes  
- `--test`: `test(app): add test coverage` - Testing improvements
- `--docs`: `docs(app): update documentation` - Documentation updates
- `--chore`: `chore(app): maintenance updates` - Maintenance tasks

**Alternatives:**
- No flag: `feat(app): update app implementation` (default)
- `-- --message="text"`: Custom message

### `npm run git merge <app>`
- Smart merge logic with safety checks
- Only merges if dev branch has new commits ahead of development
- Skips if already on development branch
- Runs pre-merge and post-merge validation
- Merges `dev/username-appname` → `development`

### `npm run git delete <app>`
- Safe branch deletion with merge verification
- Only deletes branches fully merged to development
- Prevents deletion of current branch
- Provides clear guidance if branch has unmerged commits
- Cleans up completed dev branches

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

# Develop features progressively with conventional commits
npm run git commit welcome --feat          # After implementing status endpoint
npm run git commit welcome --feat          # After implementing hello endpoint  
npm run git commit welcome --test          # After adding comprehensive test suite
npm run git commit welcome --docs          # After updating README and documentation

# Integration & cleanup (optional)
npm run git merge welcome                  # Merge dev → development for integration testing
npm run git delete welcome                 # Clean up merged dev branch

# Push when ready for review
npm run git push welcome                   # Push current branch for PR
```

### Working on Multiple Apps
```bash
# Different apps = different branches
npm run git branch welcome                 # Work on welcome app
npm run git -- commit welcome --feat       # Implement welcome features
npm run git -- push welcome               # Push welcome

npm run git branch climate                 # Work on climate app  
npm run git -- commit climate --feat       # Implement climate features
npm run git -- push climate               # Push climate
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
- ✅ 4-level validation system (none/basic/essential/strict)
- ✅ Ensures all Voila contracts are valid
- ✅ Prevents broken code from entering Git history

**If validation fails:**
- ❌ Command stops with clear error message
- ❌ No commit/push happens until issues are fixed
- ❌ Maintains code quality gates

## Conventional Commits & Analytics

### **The Power of Structured Commits**

**Conventional Commits provide instant project insights:**

```bash
# Count commits by type
git log --grep="feat(" --oneline | wc -l        # How many features implemented?
git log --grep="fix(" --oneline | wc -l         # How many bugs fixed?
git log --grep="test(" --oneline | wc -l        # How much testing done?

# Filter commits by app
git log --grep="(welcome)" --oneline            # All welcome app commits
git log --grep="(climate)" --oneline            # All climate app commits

# Recent features across all apps
git log --grep="feat(" --oneline -10            # Last 10 features
git log --grep="fix(" --since="1 week ago"      # Recent bug fixes
```

### **Beautiful Commit History**
```bash
git log --oneline
# feat(welcome): implement features
# test(welcome): add test coverage  
# docs(welcome): update documentation
# fix(climate): resolve API timeout
# feat(climate): implement weather service
# chore(converter): update dependencies
```

### **Team Dashboard Benefits**
- **Sprint velocity**: Count features completed per developer
- **Code quality**: Track test/fix ratio across projects  
- **Documentation health**: Monitor docs updates per app
- **Release notes**: Auto-generate from conventional commits

## Integration with Standard Git

**You can mix Voila Git commands with standard Git:**

```bash
# Voila + Standard Git workflow
npm run git branch welcome                  # Voila: create dev/john-welcome
git status                                  # Standard: check status  
git diff                                    # Standard: see changes
npm run git -- commit welcome --feat       # Voila: validated conventional commit
git log --grep="feat(" --oneline           # Standard: filter commits  
npm run git -- push welcome               # Voila: validated push
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

# Develop features progressively with conventional commits
npm run git -- commit welcome --feat               # Implement status API
npm run git -- commit welcome --feat               # Add input validation  
npm run git -- commit welcome --test               # Write comprehensive tests

# Push when app is complete
npm run git -- push welcome                       # Push for PR review
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

# Progressive development with conventional commits
npm run git commit welcome --feat                  # Implement status feature with health checks
npm run git commit welcome --feat                  # Implement hello feature with personalization
npm run git commit welcome --test                  # Add comprehensive API test suite
npm run git commit welcome --docs                  # Update documentation and README

# Integration & cleanup (optional)
npm run git merge welcome                          # Merge to development for testing
npm run git delete welcome                         # Clean up merged dev branch

# Push complete app
npm run git push welcome
# → Validation runs, pushes current branch
# → Create PR for final integration
```

### Multiple Apps
```bash
# Work on climate app
npm run git branch climate                          # → dev/johnsmith-climate
npm run git commit climate --feat                  # Add weather service integration
npm run git merge climate                          # Merge to development
npm run git delete climate                         # Clean up dev branch
npm run git push climate                           # Push development

# Work on converter app  
npm run git branch converter                        # → dev/johnsmith-converter
npm run git commit converter --feat                # Add currency conversion logic
npm run git merge converter                        # Merge to development
npm run git delete converter                       # Clean up dev branch
npm run git push converter                         # Push development

# Each app integrated cleanly to development
```

## Error Handling

### Validation Failures
```bash
npm run git commit welcome --feat
# Error: Validation failed: Contract validation
# → Fix contract issues in your app
# → Run 'npm run validate app:api welcome' to debug
# → Retry commit after fixing
```

### Merge Safety Checks
```bash
npm run git merge welcome
# Already on development branch, no merge needed
# OR: No new changes to merge from dev/username-welcome
# OR: Found 3 new commit(s) to merge → proceeds with validation
```

### Delete Safety Checks  
```bash
npm run git delete welcome
# Error: Branch has 2 unmerged commit(s). Merge to development first.
# → Run 'npm run git merge welcome' first
# → Then retry delete command
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
npm run git -- push welcome  
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