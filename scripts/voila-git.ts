#!/usr/bin/env tsx

/**
 * Voila Git Script - Minimal Git workflow with Voila validation
 * Usage: npm run git <command> [args]
 * 
 * Commands:
 *   npm run git init [remote-url]            # Initialize Git repo
 *   npm run git branch climate/weather       # Feature branch (default)
 *   npm run git branch climate/weather --fix # Bug fix branch
 *   npm run git commit climate/weather       # Validated commit
 *   npm run git push climate/weather         # Validated push
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, writeFileSync } from 'fs';
import { VoilaState } from './voila-context.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    showHelp();
    return;
  }

  const command = args[0];
  const target = args[1];
  
  console.log('🌿 Voila Git Workflow');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    switch (command) {
      case 'init':
        await initializeGitRepo(target); // target is remote URL
        break;
      
      case 'branch':
        if (!target || target.includes('/')) {
          throw new Error('App name required (no slash): e.g., "welcome", "climate"');
        }
        await createBranch(target);
        break;
      
      case 'commit':
        if (!target || target.includes('/')) {
          throw new Error('App name required (no slash): e.g., "welcome", "climate"');
        }
        // Handle both --message=value and --message value formats
        let customMessage = args.find(arg => arg.startsWith('--message='))?.split('=')[1];
        if (!customMessage) {
          const messageIndex = args.indexOf('--message');
          if (messageIndex !== -1 && args[messageIndex + 1]) {
            customMessage = args[messageIndex + 1];
          }
        }
        await commitChanges(target, customMessage, args);
        break;
      
      case 'push':
        if (!target || target.includes('/')) {
          throw new Error('App name required (no slash): e.g., "welcome", "climate"');
        }
        await pushBranch(target);
        break;
      
      default:
        console.log(`❌ Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error: any) {
    console.error('💥 Git workflow error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function initializeGitRepo(remoteUrl?: string): Promise<void> {
  console.log(`🚀 Initializing Git repository`);
  
  // Initialize if not already a repo
  if (!existsSync('.git')) {
    await execAsync('git init');
    console.log('✅ Git repository initialized');
  } else {
    console.log('📋 Git repository already exists');
  }
  
  // Create .gitignore if it doesn't exist
  if (!existsSync('.gitignore')) {
    const gitignoreContent = `# Voila Framework
node_modules/
dist/
.env
.env.local
.voila-cache/
.voila-server.pid

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
coverage/
`;
    writeFileSync('.gitignore', gitignoreContent);
    console.log('✅ .gitignore created');
  }
  
  // Add remote if provided
  if (remoteUrl) {
    try {
      await execAsync(`git remote add origin ${remoteUrl}`);
      console.log(`✅ Added remote: ${remoteUrl}`);
    } catch {
      console.log(`📋 Remote origin already exists`);
    }
  }
  
  // Create initial commit if needed
  try {
    await execAsync('git log --oneline -1');
  } catch {
    await execAsync('git add .');
    await execAsync('git commit -m "feat: initialize Voila Framework project"');
    console.log('✅ Initial commit created');
  }
  
  // Setup branches
  try {
    await execAsync('git checkout -b main');
    console.log('✅ Created main branch');
  } catch {
    console.log('📋 Main branch exists');
  }
  
  try {
    await execAsync('git checkout -b development');
    console.log('✅ Created development branch');
  } catch {
    console.log('📋 Development branch exists');
  }
  
  // Push if remote exists
  if (remoteUrl) {
    try {
      await execAsync('git push -u origin main');
      await execAsync('git push -u origin development');
      console.log('✅ Pushed branches to remote');
    } catch {
      console.log('⚠️  Could not push (may need authentication)');
    }
  }
  
  console.log('\\n🌿 Repository ready!');
  console.log('💡 Next: npm run git branch <app>');
}

async function createBranch(target: string): Promise<void> {
  // Target is now just appName (e.g., "welcome", "climate")
  const appName = target;
  
  // Get username for branch naming
  let userName = 'dev';
  try {
    const { stdout } = await execAsync('git config user.name');
    userName = stdout.trim().toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  } catch {
    console.log('⚠️  Git user.name not set, using "dev"');
  }
  
  const branchName = `dev/${userName}-${appName}`;
  
  console.log(`🌿 Creating dev branch: ${branchName}`);
  
  try {
    // Switch to development and pull latest
    await execAsync('git checkout development');
    console.log('📋 Switched to development branch');
    
    try {
      await execAsync('git pull origin development');
      console.log('✅ Pulled latest development');
    } catch {
      console.log('📋 No remote to pull from');
    }
    
    // Create app branch
    await execAsync(`git checkout -b ${branchName}`);
    console.log(`✅ Created branch: ${branchName}`);
    
    console.log('\\n💡 Next steps:');
    console.log('   1. Implement your app features');
    console.log(`   2. npm run git commit ${appName} "commit message"`);

    // Log state
    VoilaState.logAction('git_branch', `Created dev branch '${branchName}' from development branch`, {
      currentApp: appName,
      nextSteps: [
        `Implement app features on branch ${branchName}`,
        `Run: npm run git commit ${appName} "commit message"`
      ]
    });
    
  } catch (error: any) {
    throw new Error(`Branch creation failed: ${error.message}`);
  }
}

async function commitChanges(target: string, customMessage?: string, args: string[] = []): Promise<void> {
  const appName = target;
  console.log(`📝 Committing changes for ${appName} app`);
  
  // Run validation
  console.log('🔍 Running validation...');
  try {
    await execAsync(`npm run validate app:api ${appName}`);
    console.log('✅ Validation passed');
  } catch (error: any) {
    throw new Error(`Validation failed: ${error.message}`);
  }
  
  // Stage changes
  await execAsync('git add .');
  console.log('✅ Staged changes');
  
  // Generate commit message based on flags or custom message
  let commitMessage = customMessage;
  
  if (!commitMessage) {
    const { stdout: currentBranch } = await execAsync('git branch --show-current');
    const branchName = currentBranch.trim();
    
    // Check for commit type flags
    if (args.includes('--feat')) {
      commitMessage = `feat(${appName}): implement features`;
    } else if (args.includes('--fix')) {
      commitMessage = `fix(${appName}): resolve issues`;
    } else if (args.includes('--test')) {
      commitMessage = `test(${appName}): add test coverage`;
    } else if (args.includes('--docs')) {
      commitMessage = `docs(${appName}): update documentation`;
    } else if (args.includes('--chore')) {
      commitMessage = `chore(${appName}): maintenance updates`;
    } else {
      // Default message
      commitMessage = `feat(${appName}): update app implementation`;
    }
    
    console.log(`\\n📝 Using commit message: "${commitMessage}"`);
    console.log('💡 Available flags: --feat, --fix, --test, --docs, --chore');
    console.log('💡 Custom message: npm run git commit app -- --message="your message"');
  } else {
    console.log(`\\n📝 Using custom message: "${commitMessage}"`);
  }
  
  try {
    await execAsync(`git commit -m "${commitMessage}"`);
    console.log('✅ Changes committed');
    
    console.log('\\n💡 Next step:');
    console.log(`   npm run git push ${appName}`);

    // Log state
    VoilaState.logAction('git_commit', `Committed changes: "${commitMessage}"`, {
      currentApp: appName,
      nextSteps: [
        `Run: npm run git push ${appName}`,
        `Create PR when ready`
      ]
    });
    
  } catch (error: any) {
    if (error.message.includes('nothing to commit')) {
      console.log('📋 Nothing to commit');
    } else {
      throw error;
    }
  }
}

async function pushBranch(target: string): Promise<void> {
  const appName = target;
  console.log(`🚀 Pushing branch for ${appName} app`);
  
  // Final validation
  console.log('🔍 Final validation...');
  try {
    await execAsync(`npm run validate app:api ${appName}`);
    console.log('✅ Validation passed');
  } catch (error: any) {
    throw new Error(`Validation failed: ${error.message}`);
  }
  
  // Get current branch
  const { stdout: currentBranch } = await execAsync('git branch --show-current');
  const branchName = currentBranch.trim();
  
  try {
    await execAsync(`git push -u origin ${branchName}`);
    console.log(`✅ Pushed: ${branchName}`);
    
    console.log('\\n💡 Next steps:');
    console.log('   1. Create Pull Request via GitHub/GitLab');
    console.log(`   2. Target: ${branchName} → development`);
    console.log(`   3. Title: "Add ${appName} app"`);

    // Log state
    VoilaState.logAction('git_push', `Pushed ${branchName} to remote - ready for PR`, {
      currentApp: appName,
      nextSteps: [
        `Create Pull Request via GitHub/GitLab`,
        `Target: ${branchName} → development`,
        `Title: "Add ${appName} app"`,
        `Deploy when PR approved and merged`
      ]
    });
    
  } catch (error: any) {
    if (error.message.includes('no upstream branch')) {
      console.log('⚠️  No remote configured');
    } else {
      throw error;
    }
  }
}

function showHelp() {
  console.log(`
🌿 Voila Git Workflow - Simple app-level development

BRANCH STRUCTURE:
  main                    # Production branch
  development            # Integration branch
  dev/username-appname   # Individual development

COMMANDS:
  init [remote-url]                Initialize repository (creates main + development)
  branch <app>                     Create app branch (dev/username-app)
  commit <app>                     Validated commit (uses smart default)
  commit <app> --feat              Commit with "feat(app): implement features"
  commit <app> --fix               Commit with "fix(app): resolve issues"
  commit <app> --test              Commit with "test(app): add test coverage"
  commit <app> --docs              Commit with "docs(app): update documentation"
  commit <app> --chore             Commit with "chore(app): maintenance updates"
  commit <app> -- --message="msg"  Commit with custom message
  push <app>                       Validated push for PR

WORKFLOW:
  1. npm run git init https://github.com/user/repo.git  # Setup
  2. npm run git branch welcome                         # Create dev/username-welcome
  3. [Implement all app features]
  4. npm run git commit welcome --feat                  # feat(welcome): implement features
  5. npm run git commit welcome --test                  # test(welcome): add test coverage  
  6. npm run git commit welcome --docs                  # docs(welcome): update documentation
  7. npm run git push welcome                          # Push for PR

EXAMPLES:
  npm run git init                                # Local repo
  npm run git init https://github.com/user/repo  # With remote
  npm run git branch welcome                     # Creates dev/john-welcome
  npm run git commit welcome                    # Default: feat(welcome): update app implementation
  npm run git commit welcome --feat              # feat(welcome): implement features
  npm run git commit welcome --fix               # fix(welcome): resolve issues
  npm run git commit welcome --test              # test(welcome): add test coverage
  npm run git commit welcome -- --message="add status API"  # Custom message
  npm run git push welcome                      # Push for review

BRANCH NAMING:
  dev/username-appname              # All development (super simple!)

COMMIT TYPES (Conventional Commits):
  --feat       New features and functionality
  --fix        Bug fixes and issue resolution  
  --test       Test additions and improvements
  --docs       Documentation updates
  --chore      Maintenance, refactoring, dependencies

VALIDATION:
  ✅ Runs 'npm run validate app:api <app>' before commit/push
  ✅ Prevents broken code in Git history
  ✅ Conventional commit messages for clear history
  ✅ Easy filtering: git log --grep="feat(" --oneline

INTEGRATION:
  🔗 Use GitHub/GitLab for Pull Requests
  🔗 Target: dev/username-appname → development
  🔗 Standard Git commands work alongside
`);
}

main();