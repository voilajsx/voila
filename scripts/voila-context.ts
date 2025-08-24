#!/usr/bin/env tsx

/**
 * Voila Context Script - Contextual learning commands for Claude
 * Usage: npm run context <context-type>
 * 
 * Examples:
 *   npm run context voila:framework
 *   npm run context voila:comments
 *   npm run context voila:planning
 *   npm run context voila:examples
 */

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ContextCommand {
  name: string;
  description: string;
  docs: string[];
  instructions: string;
}

// Workflow management interfaces
interface WorkflowStep {
  id: number;
  name: string;
  command?: string;
  action?: string;
  file?: string;
  status: 'pending' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
  notes?: string;
}

interface WorkflowData {
  project: string;
  current_step: number;
  created_from?: string;
  last_updated: string;
  steps: Record<number, WorkflowStep>;
  user_notes?: string;
}

// Simple state management with dual tracking
interface ProjectState {
  currentApp: string | null;
  currentFeature: string | null;
  phase: 'planning' | 'app-structure' | 'feature-development' | 'integration-testing' | 'deployment';
  lastUpdate: string;
  gitBranch: string;
  nextSteps: string[];
  completedMilestones: string[];
  context: {
    planning: {
      businessRequirementsCompleted: boolean;
      technicalSpecCompleted: boolean;
      approved: boolean;
    };
    development: {
      appStructureGenerated: boolean;
      currentFeatureInProgress: boolean;
      testsWritten: boolean;
      integrationTestsPassed: boolean;
    };
    deployment: {
      deployedToStaging: boolean;
      deployedToProduction: boolean;
    };
  };
}

class VoilaState {
  private static ACTIONS_FILE = '.voila/actions.log';
  private static STATE_FILE = '.voila/state.json';

  static logAction(action: string, description: string, updates?: Partial<ProjectState>) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action}: ${description}\n`;
    
    // Ensure .voila directory exists
    if (!fs.existsSync('.voila')) {
      fs.mkdirSync('.voila', { recursive: true });
    }
    
    // Append to actions log
    fs.appendFileSync(VoilaState.ACTIONS_FILE, logEntry);
    
    // Update state.json if updates provided
    if (updates) {
      VoilaState.updateState(updates);
    }
  }

  static updateState(updates: Partial<ProjectState>) {
    let currentState: ProjectState;
    
    // Load current state or create default
    try {
      const stateContent = fs.readFileSync(VoilaState.STATE_FILE, 'utf-8');
      currentState = JSON.parse(stateContent);
    } catch {
      currentState = VoilaState.getDefaultState();
    }
    
    // Apply updates
    const newState: ProjectState = {
      ...currentState,
      ...updates,
      lastUpdate: new Date().toISOString(),
      gitBranch: VoilaState.getCurrentBranch(),
      context: updates.context ? 
        { ...currentState.context, ...updates.context } : 
        currentState.context
    };
    
    // Write updated state
    fs.writeFileSync(VoilaState.STATE_FILE, JSON.stringify(newState, null, 2));
  }

  private static getDefaultState(): ProjectState {
    return {
      currentApp: null,
      currentFeature: null,
      phase: 'planning',
      lastUpdate: new Date().toISOString(),
      gitBranch: VoilaState.getCurrentBranch(),
      nextSteps: [
        'Run npm run plan start <appname> to begin planning',
        'Or run npm run context voila:framework to learn the framework'
      ],
      completedMilestones: [],
      context: {
        planning: {
          businessRequirementsCompleted: false,
          technicalSpecCompleted: false,
          approved: false
        },
        development: {
          appStructureGenerated: false,
          currentFeatureInProgress: false,
          testsWritten: false,
          integrationTestsPassed: false
        },
        deployment: {
          deployedToStaging: false,
          deployedToProduction: false
        }
      }
    };
  }

  static getLatest(count: number = 5): string[] {
    if (!fs.existsSync(VoilaState.ACTIONS_FILE)) {
      return [];
    }
    
    const content = fs.readFileSync(VoilaState.ACTIONS_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    return lines.slice(-count);
  }

  static getAllActions(): string[] {
    if (!fs.existsSync(VoilaState.ACTIONS_FILE)) {
      return [];
    }
    
    const content = fs.readFileSync(VoilaState.ACTIONS_FILE, 'utf-8');
    return content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  }

  static getResume(): string {
    const allActions = VoilaState.getAllActions();
    let currentState: ProjectState;
    
    try {
      const stateContent = fs.readFileSync(VoilaState.STATE_FILE, 'utf-8');
      currentState = JSON.parse(stateContent);
    } catch {
      currentState = VoilaState.getDefaultState();
    }

    const gitStatus = VoilaState.getGitStatus();
    
    return `# Resume Session

## Current Project State
- **App**: ${currentState.currentApp || 'None'}
- **Feature**: ${currentState.currentFeature || 'None'}  
- **Phase**: ${currentState.phase}
- **Branch**: ${currentState.gitBranch}
- **Last Update**: ${new Date(currentState.lastUpdate).toLocaleString()}

## Progress Tracking
**Planning:**
- Business Requirements: ${currentState.context.planning.businessRequirementsCompleted ? '✅' : '❌'}
- Technical Spec: ${currentState.context.planning.technicalSpecCompleted ? '✅' : '❌'}
- Approved: ${currentState.context.planning.approved ? '✅' : '❌'}

**Development:**
- App Structure Generated: ${currentState.context.development.appStructureGenerated ? '✅' : '❌'}
- Current Feature In Progress: ${currentState.context.development.currentFeatureInProgress ? '✅' : '❌'}
- Tests Written: ${currentState.context.development.testsWritten ? '✅' : '❌'}
- Integration Tests Passed: ${currentState.context.development.integrationTestsPassed ? '✅' : '❌'}

**Deployment:**
- Staging: ${currentState.context.deployment.deployedToStaging ? '✅' : '❌'}
- Production: ${currentState.context.deployment.deployedToProduction ? '✅' : '❌'}

## Next Steps
${currentState.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Recent Actions (Last 5)
${allActions.length === 0 ? 'No actions recorded yet' : allActions.slice(-5).map(line => `- ${line}`).join('\n')}

## Current Git Status
- **Status**: ${gitStatus.status}
- **Modified Files**: ${gitStatus.modifiedFiles.join(', ') || 'None'}

## Quick Actions
1. \`npm run context voila:framework\` - Refresh framework knowledge
2. \`npm run context state:latest\` - See recent activity
3. \`git status\` - Check current changes
4. Continue with the next steps listed above

## Rollback Options
\`\`\`bash
git stash          # Save current work
git stash pop      # Resume saved work
git reset --soft HEAD~1  # Undo last commit, keep changes
\`\`\`
`;
  }

  static reset() {
    if (fs.existsSync(VoilaState.ACTIONS_FILE)) {
      fs.unlinkSync(VoilaState.ACTIONS_FILE);
    }
    if (fs.existsSync(VoilaState.STATE_FILE)) {
      fs.unlinkSync(VoilaState.STATE_FILE);
    }
    console.log('✅ State reset. Fresh start!');
  }

  private static getCurrentBranch(): string {
    try {
      return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  private static getGitStatus() {
    try {
      const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
      const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });
      const modifiedFiles = statusOutput.split('\n').filter(line => line.trim()).map(line => line.substring(3));
      const hasChanges = modifiedFiles.length > 0;
      
      return {
        branch: branch || 'unknown',
        status: hasChanges ? 'Modified files present' : 'Clean working directory',
        modifiedFiles
      };
    } catch {
      return { branch: 'unknown', status: 'Unable to read git status', modifiedFiles: [] };
    }
  }
}

// Workflow management functions
async function showWorkflowStatus(appName?: string): Promise<void> {
  console.log('🔄 Workflow Status');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const workflowPath = path.join(__dirname, '..', '.voila', 'workflow.yml');
  
  if (!fs.existsSync(workflowPath)) {
    console.log('❌ No workflow found. Generate one with:');
    console.log(`   npm run generate workflow ${appName || '[app-name]'}\n`);
    return;
  }
  
  try {
    const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
    const workflow: WorkflowData = parseWorkflowYAML(workflowContent);
    
    console.log(`📊 Project: ${workflow.project}`);
    console.log(`📈 Progress: Step ${workflow.current_step}/${Object.keys(workflow.steps).length}`);
    
    const completedSteps = Object.values(workflow.steps).filter(s => s.status === 'completed').length;
    const progressPercent = Math.round((completedSteps / Object.keys(workflow.steps).length) * 100);
    console.log(`🎯 Overall Progress: ${progressPercent}% complete\n`);
    
    // Show completed steps
    const completed = Object.values(workflow.steps).filter(s => s.status === 'completed');
    if (completed.length > 0) {
      console.log(`✅ Completed (${completed.length}):`);
      completed.forEach(step => {
        console.log(`   ${step.id}. ${step.name}`);
      });
      console.log('');
    }
    
    // Show current step
    const current = Object.values(workflow.steps).find(s => s.status === 'in_progress');
    if (current) {
      console.log('🔄 In Progress (1):');
      console.log(`   ${current.id}. ${current.name}`);
      if (current.started_at) {
        const started = new Date(current.started_at);
        const now = new Date();
        const minutes = Math.round((now.getTime() - started.getTime()) / (1000 * 60));
        console.log(`      Started ${minutes} minutes ago`);
      }
      console.log('');
    }
    
    // Show next pending steps
    const pending = Object.values(workflow.steps).filter(s => s.status === 'pending').slice(0, 5);
    if (pending.length > 0) {
      console.log(`⏳ Next Steps (${pending.length > 5 ? '5 of ' + pending.length : pending.length}):`);
      pending.forEach(step => {
        console.log(`   ${step.id}. ${step.name}`);
      });
      console.log('');
    }
    
    // Show user notes if present
    if (workflow.user_notes) {
      console.log(`📝 Notes: ${workflow.user_notes}\n`);
    }
    
  } catch (error) {
    console.log(`❌ Error reading workflow: ${error}`);
  }
}

async function showWorkflowNext(appName?: string): Promise<void> {
  console.log('➡️ Next Workflow Step');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const workflowPath = path.join(__dirname, '..', '.voila', 'workflow.yml');
  
  if (!fs.existsSync(workflowPath)) {
    console.log('❌ No workflow found. Generate one with:');
    console.log(`   npm run generate workflow ${appName || '[app-name]'}\n`);
    return;
  }
  
  try {
    const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
    const workflow: WorkflowData = parseWorkflowYAML(workflowContent);
    
    const nextStep = Object.values(workflow.steps).find(s => s.status === 'pending');
    
    if (!nextStep) {
      console.log('🎉 All workflow steps completed!');
      return;
    }
    
    console.log(`🎯 Next Step: #${nextStep.id} - ${nextStep.name}\n`);
    
    if (nextStep.file) {
      console.log(`📁 File: ${nextStep.file}`);
    }
    
    if (nextStep.command) {
      console.log(`💻 Command: ${nextStep.command}`);
    }
    
    if (nextStep.action) {
      console.log(`🎯 Action: ${nextStep.action}`);
    }
    
    console.log(`📋 Status: ${nextStep.status}`);
    
    if (nextStep.notes) {
      console.log(`💡 Notes: ${nextStep.notes}`);
    }
    
    console.log('\n🚀 Ready to proceed with this step!');
    
  } catch (error) {
    console.log(`❌ Error reading workflow: ${error}`);
  }
}

async function initWorkflow(appName?: string): Promise<void> {
  console.log('🔧 Initialize Workflow');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (!appName) {
    console.log('❌ App name required. Usage:');
    console.log('   npm run generate workflow [app-name]\n');
    return;
  }
  
  console.log(`📋 Generating workflow for: ${appName}`);
  console.log('   Reading from approved technical specification...\n');
  
  try {
    // Call the generate workflow command
    execSync(`npm run generate workflow ${appName}`, { stdio: 'inherit' });
  } catch (error) {
    console.log(`❌ Error generating workflow: ${error}`);
    console.log('\n💡 Manual alternative:');
    console.log(`   1. Review docs/planning/${appName}/${appName}-technical-specification-v1.md`);
    console.log('   2. Follow the Implementation Workflow section manually');
    console.log(`   3. Use npm run context workflow:status to track progress\n`);
  }
}


// Simple YAML parser for workflow files
function parseWorkflowYAML(content: string): WorkflowData {
  // Simple YAML parsing - in production would use proper YAML parser
  const lines = content.split('\n');
  const workflow: Partial<WorkflowData> = {
    steps: {}
  };
  
  let currentStep: Partial<WorkflowStep> | null = null;
  let currentStepId: number | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    if (trimmed.includes('project:')) {
      workflow.project = trimmed.split(':')[1]?.trim();
    } else if (trimmed.includes('current_step:')) {
      workflow.current_step = parseInt(trimmed.split(':')[1]?.trim() || '1');
    } else if (trimmed.includes('last_updated:')) {
      workflow.last_updated = trimmed.split(':')[1]?.trim() || new Date().toISOString();
    } else if (trimmed.match(/^\d+:$/)) {
      // Save previous step if exists
      if (currentStep && currentStepId) {
        workflow.steps![currentStepId] = currentStep as WorkflowStep;
      }
      // Start new step
      currentStepId = parseInt(trimmed.replace(':', ''));
      currentStep = {
        id: currentStepId,
        name: '',
        status: 'pending'
      };
    } else if (currentStep && trimmed.includes('name:')) {
      currentStep.name = trimmed.split('name:')[1]?.trim().replace(/"/g, '') || '';
    } else if (currentStep && trimmed.includes('status:')) {
      currentStep.status = trimmed.split('status:')[1]?.trim().replace(/"/g, '') as 'pending' | 'in_progress' | 'completed';
    } else if (currentStep && trimmed.includes('command:')) {
      currentStep.command = trimmed.split('command:')[1]?.trim().replace(/"/g, '');
    } else if (currentStep && trimmed.includes('file:')) {
      currentStep.file = trimmed.split('file:')[1]?.trim().replace(/"/g, '');
    } else if (currentStep && trimmed.includes('action:')) {
      currentStep.action = trimmed.split('action:')[1]?.trim().replace(/"/g, '');
    }
  }
  
  // Save last step
  if (currentStep && currentStepId) {
    workflow.steps![currentStepId] = currentStep as WorkflowStep;
  }
  
  return workflow as WorkflowData;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    return;
  }

  const contextType = args[0];

  console.log('🧠 Voila Framework Context');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📚 Context: ${contextType}\n`);

  try {
    await provideContext(contextType);
  } catch (error: any) {
    console.error('💥 Context error:', error.message);
    process.exit(1);
  }
}

async function provideContext(contextType: string): Promise<void> {
  // Handle state commands first
  if (contextType.startsWith('state:')) {
    const stateCommand = contextType.split(':')[1];
    
    switch (stateCommand) {
      case 'resume':
        console.log('🔄 Resume Previous Session');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(VoilaState.getResume());
        return;
        
      case 'latest':
        console.log('📋 Latest Actions (Last 5)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        const latest = VoilaState.getLatest(5);
        if (latest.length === 0) {
          console.log('No actions recorded yet.');
        } else {
          latest.forEach(line => console.log(`- ${line}`));
        }
        return;
        
      case 'reset':
        VoilaState.reset();
        return;
        
      default:
        console.log('❌ Unknown state command. Available: resume, latest, reset');
        return;
    }
  }

  // Handle workflow commands
  if (contextType.startsWith('workflow:')) {
    const workflowCommand = contextType.split(':')[1];
    const appName = process.argv[3]; // Optional app name
    
    switch (workflowCommand) {
      case 'status':
        await showWorkflowStatus(appName);
        return;
        
      case 'next':
        await showWorkflowNext(appName);
        return;
        
      default:
        console.log('❌ Unknown workflow command. Available: status, next');
        console.log('   Use: npm run generate workflow [app] to create workflow');
        return;
    }
  }

  const contexts: Record<string, ContextCommand> = {
    'voila:framework': {
      name: 'Voila Framework Core',
      description: 'Learn the complete Voila Framework patterns and architecture',
      docs: [
        'docs/lib/VOILA-ARCHITECTURE.md',
        'docs/lib/APPKIT-QUICK-REF.md',
        'docs/lib/VOILA-COMMENTS.md',
        'docs/lib/VOILA-QUICK-START.md',
        'docs/lib/VOILA-GIT-FLOW.md'
      ],
      instructions: `
🎯 LEARN THE VOILA FRAMEWORK

Read these optimized documents in sequence to understand the complete framework:

1. **Architecture Foundation** - Read docs/lib/VOILA-ARCHITECTURE.md
   - Understand contract-driven development
   - Learn auto-discovery patterns
   - Grasp feature-based organization

2. **Development Patterns** - Read docs/lib/APPKIT-QUICK-REF.md
   - Master VoilaJSX AppKit integration
   - Essential patterns and import decisions
   - Common templates for quick development

3. **Code Standards** - Read docs/lib/VOILA-COMMENTS.md
   - Follow documentation standards
   - Understand comment patterns
   - Learn consistency requirements

4. **Workflow Guide** - Read docs/lib/VOILA-QUICK-START.md
   - Master the development workflow
   - Understand command patterns
   - Learn all essential operations

5. **Git Operations** - Read docs/lib/VOILA-GIT-FLOW.md
   - Master Git workflow with validation
   - Understand feature/fix branching
   - Learn deployment integration

✅ AFTER READING: You'll be ready to help users build applications using Voila Framework patterns.`
    },

    'voila:comments': {
      name: 'Voila Comment Standards',
      description: 'Understand comment and documentation standards',
      docs: [
        'docs/lib/VOILA-COMMENTS.md'
      ],
      instructions: `
📝 LEARN VOILA COMMENT STANDARDS

Read this document to understand documentation patterns:

1. **Comment Guidelines** - Read docs/lib/VOILA-COMMENTS.md
   - Master VoilaJSX comment standards
   - Understand when to add comments vs when not to
   - Learn consistent documentation patterns
   - Follow ecosystem-wide standards

✅ AFTER READING: You'll write comments that match VoilaJSX ecosystem standards.`
    },

    'voila:planning': {
      name: 'Voila Planning System',
      description: 'Understand the human-controlled planning workflow',
      docs: [
        'docs/planning/demo/demo-business-requirements-v1.md',
        'docs/planning/demo/demo-technical-specification-v1.md',
        'scripts/voila-plan.ts'
      ],
      instructions: `
📋 LEARN VOILA PLANNING SYSTEM

Read these documents to understand the planning workflow:

1. **Business Requirements** - Read docs/planning/demo/demo-business-requirements-v1.md
   - See how business requirements are structured
   - Understand user stories and acceptance criteria
   - Learn business constraints and assumptions

2. **Technical Specifications** - Read docs/planning/demo/demo-technical-specification-v1.md
   - See the table-based technical requirements
   - Understand feature specifications
   - Learn API endpoint requirements and quality standards

3. **Planning Script** - Read scripts/voila-plan.ts
   - Understand the planning workflow
   - See how documents are generated
   - Learn the approval process

✅ AFTER READING: You'll help users with the complete planning workflow from start to approval.`
    },

    'voila:examples': {
      name: 'Voila Example Applications',
      description: 'Study real application implementations',
      docs: [
        'docs/app/greeting.brd.md',
        'docs/app/greeting.fsd.md',
        'docs/app/greeting.tsd.md'
      ],
      instructions: `
🚀 LEARN FROM VOILA EXAMPLES

Read these example application documents:

1. **Business Requirements** - Read docs/app/greeting.brd.md
   - See real business requirements structure
   - Understand scope definition
   - Learn stakeholder alignment patterns

2. **Functional Specification** - Read docs/app/greeting.fsd.md
   - See detailed functional scope
   - Understand feature descriptions
   - Learn data flow definitions

3. **Technical Specification** - Read docs/app/greeting.tsd.md
   - See complete technical implementation
   - Understand architecture decisions
   - Learn deployment considerations

✅ AFTER READING: You'll understand how to structure real-world Voila applications.`
    },

    'voila:all': {
      name: 'Complete Voila Framework',
      description: 'Learn everything about the Voila Framework',
      docs: [
        'docs/lib/VOILA-ARCHITECTURE.md',
        'docs/lib/APPKIT-QUICK-REF.md', 
        'docs/lib/VOILA-COMMENTS.md',
        'docs/lib/VOILA-QUICK-START.md',
        'docs/lib/VOILA-GIT-FLOW.md',
        'docs/lib/VOILA-TROUBLESHOOTING.md',
        'docs/planning/demo/demo-business-requirements-v1.md',
        'docs/planning/demo/demo-technical-specification-v1.md',
        'docs/app/greeting.brd.md',
        'docs/app/greeting.fsd.md',
        'docs/app/greeting.tsd.md',
        'package.json'
      ],
      instructions: `
🎓 COMPLETE VOILA FRAMEWORK MASTERY

Read ALL these documents for comprehensive understanding:

📚 CORE FRAMEWORK:
1. Read docs/lib/VOILA-ARCHITECTURE.md - Architecture & patterns
2. Read docs/lib/APPKIT-QUICK-REF.md - VoilaJSX AppKit integration
3. Read docs/lib/VOILA-COMMENTS.md - Code standards
4. Read docs/lib/VOILA-QUICK-START.md - Development workflow
5. Read docs/lib/VOILA-GIT-FLOW.md - Git workflow with validation
6. Read docs/lib/VOILA-TROUBLESHOOTING.md - Error resolution

📋 PLANNING SYSTEM:
7. Read docs/planning/demo/demo-business-requirements-v1.md - Business requirements format
8. Read docs/planning/demo/demo-technical-specification-v1.md - Technical specifications format

🚀 EXAMPLES:
9. Read docs/app/greeting.brd.md - Example business requirements
10. Read docs/app/greeting.fsd.md - Example functional spec
11. Read docs/app/greeting.tsd.md - Example technical spec

⚙️ CONFIGURATION:
12. Read package.json - Available scripts and dependencies

✅ AFTER READING: You'll be a complete Voila Framework expert ready for any task!`
    }
  };

  const context = contexts[contextType];

  if (!context) {
    console.error(`❌ Unknown context type: ${contextType}`);
    console.log('\nAvailable contexts:');
    Object.keys(contexts).forEach(key => {
      console.log(`  • ${key} - ${contexts[key].description}`);
    });
    return;
  }

  // Display the context instructions
  console.log(`📖 ${context.name}`);
  console.log(`${context.description}\n`);
  
  console.log('📂 Documents to read:');
  context.docs.forEach((doc, index) => {
    console.log(`   ${index + 1}. ${doc}`);
  });
  console.log('');

  console.log(context.instructions);
  console.log('\n🤖 Ready to learn! Read the documents above in the specified order.');
}

function showHelp() {
  console.log(`
🧠 Voila Context Script - Contextual Learning for Claude

USAGE:
  npm run context <context-type>

LEARNING CONTEXTS:
  voila:framework    - Learn complete Voila Framework (architecture, patterns, workflow)
  voila:comments     - Learn VoilaJSX comment and documentation standards  
  voila:planning     - Learn the human-controlled planning workflow
  voila:examples     - Study real application implementations
  voila:all          - Complete framework mastery (all documents)

LLM SESSION CONTINUITY:
  state:resume       - 🎯 INSTANT PROJECT RESTORE - Complete context recovery
  state:latest       - 📋 Quick check - last 5 actions with timestamps
  state:reset        - 🔄 Fresh start - clear all state for new projects

WORKFLOW MANAGEMENT:
  workflow:status    - 📊 Show current workflow progress and next steps
  workflow:next      - ➡️ Get next workflow step to execute

EXAMPLES:
  # Learning
  npm run context voila:framework
  npm run context voila:comments
  
  # State management  
  npm run context state:resume
  npm run context state:latest
  npm run context state:reset

WORKFLOW:
  1. Start development normally with Voila commands
  2. All actions automatically tracked in .voila/ folder
  3. When context is lost (browser crash, new session):
     → npm run context state:resume
  4. Claude instantly knows your entire project state
  5. Continue development exactly where you left off

THE MAGIC: Never re-explain your project to Claude again!
`);
}

main();

// Export for use by other scripts
export { VoilaState };