#!/usr/bin/env tsx

/**
 * Voila Deploy Script - Simple flyctl wrapper with Voila validation
 * Usage: npm run deploy [environment]
 * 
 * Examples:
 *   npm run deploy                    # Deploy to staging (default)
 *   npm run deploy staging           # Deploy to staging
 *   npm run deploy production        # Deploy to production
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { VoilaWorkflow } from './voila-context.js';

const execAsync = promisify(exec);

async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'staging';
  
  console.log('🚀 Voila Deploy');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    if (!['staging', 'production'].includes(environment)) {
      throw new Error('Environment must be "staging" or "production"');
    }
    
    await deployToEnvironment(environment as 'staging' | 'production');
    
  } catch (error: any) {
    console.error('💥 Deploy failed:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function deployToEnvironment(environment: 'staging' | 'production'): Promise<void> {
  console.log(`🎯 Deploying to ${environment}...`);
  
  // 1. Check if flyctl is installed
  await checkFlyctlInstalled();
  
  // 2. Validate current code
  console.log('🔍 Running Voila validation...');
  await runValidation();
  
  // 3. Git safety checks
  await checkGitStatus(environment);
  
  // 4. Build project
  console.log('🏗️ Building project...');
  await buildProject();
  
  // 5. Deploy with flyctl
  console.log(`🚀 Deploying to ${environment}...`);
  await deployWithFlyctl(environment);
  
  // 6. Success
  console.log(`✅ Successfully deployed to ${environment}!`);
  await showDeploymentInfo(environment);

  // Log state
  VoilaWorkflow.logAction('deploy', `Successfully deployed to ${environment}`, {
    phase: 'deployment',
    nextSteps: [
      `Test core functionality in ${environment}`,
      `Check error logs: flyctl logs`,
      `Monitor performance: flyctl status`
    ],
    context: {
      deployment: {
        deployedToStaging: environment === 'staging' ? true : undefined,
        deployedToProduction: environment === 'production' ? true : undefined
      }
    }
  });
}

async function checkFlyctlInstalled(): Promise<void> {
  try {
    await execAsync('flyctl version');
    console.log('✅ flyctl is installed');
  } catch (error) {
    throw new Error('flyctl not found. Install with: curl -L https://fly.io/install.sh | sh');
  }
}

async function runValidation(): Promise<void> {
  try {
    await execAsync('npm run validate');
    console.log('✅ Validation passed (API + Web)');
  } catch (error: any) {
    throw new Error(`Validation failed: ${error.message}`);
  }
}

async function checkGitStatus(environment: 'staging' | 'production'): Promise<void> {
  try {
    // Check if we're in a git repo
    const { stdout: status } = await execAsync('git status --porcelain');
    const { stdout: branch } = await execAsync('git branch --show-current');
    
    const currentBranch = branch.trim();
    const hasChanges = status.trim().length > 0;
    
    if (hasChanges) {
      console.log('⚠️  Warning: Uncommitted changes detected');
      console.log('💡 Consider committing changes before deployment');
    }
    
    // Production should only deploy from main or release branches
    if (environment === 'production') {
      if (!['main', 'master'].includes(currentBranch) && !currentBranch.startsWith('release/')) {
        throw new Error(`Production deploys should be from main/master branch, not ${currentBranch}`);
      }
      console.log(`✅ Deploying production from ${currentBranch} branch`);
    } else {
      console.log(`📋 Deploying staging from ${currentBranch} branch`);
    }
    
  } catch (error: any) {
    if (error.message.includes('not a git repository')) {
      console.log('📋 Not a git repository, skipping git checks');
    } else {
      throw error;
    }
  }
}

async function buildProject(): Promise<void> {
  try {
    console.log('🏗️ Building API and Web...');
    await execAsync('npm run build');
    console.log('✅ Build completed (API + Web)');
  } catch (error: any) {
    throw new Error(`Build failed: ${error.message}`);
  }
}

async function deployWithFlyctl(environment: 'staging' | 'production'): Promise<void> {
  const configFile = `fly.${environment}.toml`;
  
  // Check if environment-specific config exists
  if (!existsSync(configFile)) {
    if (existsSync('fly.toml')) {
      console.log(`⚠️  No ${configFile} found, using default fly.toml`);
      await execAsync('flyctl deploy');
    } else {
      throw new Error(`No fly.toml or ${configFile} found. Run 'flyctl launch' first.`);
    }
  } else {
    console.log(`📋 Using config: ${configFile}`);
    await execAsync(`flyctl deploy --config ${configFile}`);
  }
  
  console.log('✅ Deployment completed');
  
  // Basic health check
  console.log('🏥 Running health check...');
  await performHealthCheck(environment);
}

async function performHealthCheck(environment: string): Promise<void> {
  try {
    // Wait a moment for deployment to settle
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const { stdout: statusJson } = await execAsync('flyctl status --json');
    const app = JSON.parse(statusJson);
    
    if (app.Status === 'running') {
      console.log('✅ Health check passed - app is running');
    } else {
      console.log(`⚠️  Health check warning - app status: ${app.Status}`);
    }
  } catch (error) {
    console.log('⚠️  Health check failed, but deployment may still be successful');
    console.log('💡 Check status manually with: flyctl status');
  }
}

async function showDeploymentInfo(environment: 'staging' | 'production'): Promise<void> {
  try {
    // Get app info from flyctl
    const { stdout: appInfo } = await execAsync('flyctl status --json');
    const app = JSON.parse(appInfo);
    
    console.log('\\n🌐 Deployment Info:');
    console.log(`   App: ${app.Name}`);
    console.log(`   Environment: ${environment}`);
    console.log(`   URL: https://${app.Hostname}`);
    console.log(`   Status: ${app.Status}`);
    
    console.log('\\n💡 Useful commands:');
    console.log('   flyctl logs           # View logs');
    console.log('   flyctl status         # Check app status');
    console.log('   flyctl open           # Open app in browser');
    
  } catch (error) {
    console.log('\\n💡 Deployment completed! Use flyctl commands for more info.');
  }
}

function showHelp() {
  console.log(`
🚀 Voila Deploy - Simple deployment with validation

USAGE:
  npm run deploy [environment]

ENVIRONMENTS:
  staging          Deploy to staging environment (default)
  production       Deploy to production environment

EXAMPLES:
  npm run deploy                    # Deploy to staging
  npm run deploy staging           # Deploy to staging  
  npm run deploy production        # Deploy to production

WORKFLOW:
  1. Validates flyctl is installed
  2. Runs Voila validation (API + Web contracts)
  3. Checks git status and branch safety
  4. Builds project (API + Web together)
  5. Deploys with flyctl deploy
  6. Runs basic health check
  7. Shows deployment info and next steps

REQUIREMENTS:
  ✅ flyctl installed (curl -L https://fly.io/install.sh | sh)
  ✅ fly.toml or fly.staging.toml/fly.production.toml configured
  ✅ flyctl auth login completed

SAFETY CHECKS:
  🔒 Production deploys only from main/master/release branches
  🔍 Validation must pass before deployment
  🏗️ Build must succeed before deployment
  ⚠️  Warns about uncommitted changes

FLY.IO SETUP:
  flyctl auth login                # Login to fly.io
  flyctl launch                   # Create app and fly.toml
  # Edit fly.toml for your app
  npm run deploy staging          # Deploy to staging
`);
}

// Show help if --help flag is passed
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
} else {
  main();
}