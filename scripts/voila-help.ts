#!/usr/bin/env tsx

/**
 * Voila Help Script - Interactive help system
 * Usage: npm run help [command]
 * 
 * Examples:
 *   npm run help                    # Show all available commands
 *   npm run help generate           # Help for generate command
 *   npm run help validate           # Help for validate command
 */

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CommandHelp {
  name: string;
  description: string;
  usage: string[];
  examples: string[];
  options?: string[];
  notes?: string[];
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('💡 Voila Framework Help');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    if (command) {
      await showCommandHelp(command);
    } else {
      await showAllCommands();
    }
  } catch (error: any) {
    console.error('💥 Help system error:', error.message);
    process.exit(1);
  }
}

async function showAllCommands(): Promise<void> {
  console.log('🚀 Available Voila Commands\n');
  
  const commandCategories = {
    '📚 Learning & Context': [
      { cmd: 'npm run context voila:framework', desc: 'Learn complete Voila framework patterns' },
      { cmd: 'npm run context voila:comments', desc: 'Learn documentation standards' },
      { cmd: 'npm run context voila:planning', desc: 'Learn planning workflow' },
      { cmd: 'npm run context voila:examples', desc: 'Study real application examples' }
    ],
    '⚡ LLM Session Continuity': [
      { cmd: 'npm run context state:resume', desc: '🎯 INSTANT PROJECT RESTORE - Complete context recovery' },
      { cmd: 'npm run context state:latest', desc: '📋 Quick check - last 5 actions with timestamps' },
      { cmd: 'npm run context state:reset', desc: '🔄 Fresh start - clear all state for new projects' }
    ],
    '📊 Workflow Management (3 Essential Commands)': [
      { cmd: 'npm run generate workflow <app>', desc: 'Generate and validate workflow from approved tech spec' },
      { cmd: 'npm run context workflow:status', desc: 'Show current workflow progress and next steps' },
      { cmd: 'npm run context workflow:next', desc: 'Get next workflow step to execute' }
    ],
    '📋 Planning & Requirements': [
      { cmd: 'npm run plan start <app> "<desc>"', desc: 'Generate planning document templates' },
      { cmd: 'npm run plan review <app>', desc: 'Review planning completion status' },
      { cmd: 'npm run plan approve <app>', desc: 'Auto-approve planning documents' }
    ],
    '🏗️ Code Generation': [
      { cmd: 'npm run generate app:api <app>', desc: 'Generate new API application' },
      { cmd: 'npm run generate app:api <app>/<feature>', desc: 'Generate new feature in app' },
      { cmd: 'npm run generate app:api <app> -- --testcases', desc: 'Generate API test cases from specs' }
    ],
    '⚙️ Development & Server': [
      { cmd: 'npm run dev:api', desc: 'Start development server with hot reload' },
      { cmd: 'npm run server api:start', desc: 'Start API server manually' },
      { cmd: 'npm run server api:stop', desc: 'Stop running API server' },
      { cmd: 'npm run server api:restart', desc: 'Restart server (refresh discovery)' },
      { cmd: 'npm run server api:status', desc: 'Check server health and status' }
    ],
    '🔍 Validation & Quality': [
      { cmd: 'npm run validate app:api [app]', desc: 'Validate contracts and structure' },
      { cmd: 'npm run lint', desc: 'Lint TypeScript/TSX files' },
      { cmd: 'npm run typecheck', desc: 'TypeScript type checking' }
    ],
    '🧪 Testing': [
      { cmd: 'npm run test app:api <app>', desc: 'Run all tests (unit + API + compliance)' },
      { cmd: 'npm run test app:api <app> -- --unittest', desc: 'Run unit tests only' },
      { cmd: 'npm run test app:api <app> -- --apitest', desc: 'Run API tests only' },
      { cmd: 'npm run test app:api <app> -- --compliance', desc: 'Run compliance checks only' }
    ],
    '🛣️ Discovery & Information': [
      { cmd: 'npm run routes', desc: 'List all API routes' },
      { cmd: 'npm run routes app:api <app>', desc: 'List routes for specific app' },
      { cmd: 'npm run routes app:api <app>/<feature>', desc: 'List routes for specific feature' },
      { cmd: 'npm run help [command]', desc: 'Show help for specific command' }
    ],
    '🔧 Git Workflow': [
      { cmd: 'npm run git init [remote-url]', desc: 'Initialize Git repository with Voila workflow' },
      { cmd: 'npm run git branch <app>/<feature>', desc: 'Create feature branch (default)' },
      { cmd: 'npm run git branch <app>/<feature> --fix', desc: 'Create bug fix branch' },
      { cmd: 'npm run git commit <app>/<feature>', desc: 'Validated commit with smart message' },
      { cmd: 'npm run git push <app>/<feature>', desc: 'Validated push for PR creation' }
    ],
    '🚀 Build & Deploy': [
      { cmd: 'npm run build:api', desc: 'Build API for production' },
      { cmd: 'npm run deploy [staging|production]', desc: 'Deploy with flyctl and validation' },
      { cmd: 'npm start', desc: 'Start production server' },
      { cmd: 'npm run clean', desc: 'Clean build artifacts' }
    ]
  };

  for (const [category, commands] of Object.entries(commandCategories)) {
    console.log(`${category}:`);
    commands.forEach(({ cmd, desc }) => {
      console.log(`   ${cmd.padEnd(45)} # ${desc}`);
    });
    console.log('');
  }

  console.log('💡 Quick Start Workflow:');
  console.log('   1. npm run context voila:framework     # Learn the framework');
  console.log('   2. npm run plan start myapp "desc"     # Plan your application');
  console.log('   3. npm run plan approve myapp          # Approve planning docs');
  console.log('   4. npm run generate workflow myapp     # Generate workflow steps');
  console.log('   5. npm run context workflow:next       # Get next step to do');
  console.log('   6. npm run dev:api                     # Start development');
  console.log('   7. npm run validate app:api myapp      # Validate your work');
  console.log('');
  console.log('📖 For detailed help on any command:');
  console.log('   npm run help <command-name>');
  console.log('');
  console.log('🌟 Most commonly used commands:');
  console.log('   npm run dev:api                        # Development server');
  console.log('   npm run generate app:api <app>/<feat>  # Add features');
  console.log('   npm run validate app:api <app>         # Check quality');
  console.log('   npm run routes                         # See all endpoints');
}

async function showCommandHelp(command: string): Promise<void> {
  const commandHelps: Record<string, CommandHelp> = {
    context: {
      name: 'context',
      description: 'Learn Voila Framework patterns + LLM session continuity',
      usage: [
        'npm run context voila:framework',
        'npm run context voila:comments', 
        'npm run context voila:planning',
        'npm run context voila:examples',
        'npm run context voila:all',
        'npm run context state:resume',
        'npm run context state:latest',
        'npm run context state:reset',
        'npm run context workflow:status',
        'npm run context workflow:next'
      ],
      examples: [
        'npm run context voila:framework    # Learn complete framework',
        'npm run context voila:comments     # Learn documentation standards',
        'npm run context state:resume       # 🎯 INSTANT PROJECT RESTORE',
        'npm run context state:latest       # 📋 Last 5 actions',
        'npm run context state:reset        # 🔄 Fresh start',
        'npm run context workflow:status    # Show current workflow progress',
        'npm run context workflow:next      # Get next step to execute',
        'npm run generate workflow app  # Initialize workflow from tech spec'
      ],
      notes: [
        'Learning contexts: Read documents to become framework expert',
        'State contexts: Never lose development progress again!',
        'Workflow contexts: Step-by-step development tracking',
        'state:resume shows exactly where you left off with next steps',
        'workflow:next shows exactly what to implement next',
        'All major actions automatically tracked in .voila/ folder',
        'Perfect for session crashes, next-day dev, team handoffs'
      ]
    },

    plan: {
      name: 'plan',
      description: 'Human-controlled planning workflow for applications',
      usage: [
        'npm run plan start <app> "<description>"',
        'npm run plan review <app>',
        'npm run plan approve <app>'
      ],
      examples: [
        'npm run plan start weather "weather app"    # Generate planning templates',
        'npm run plan review weather                 # Check completion status', 
        'npm run plan approve weather                # Auto-approve documents'
      ],
      notes: [
        'Planning is required before generation',
        'Complete [FILL_IN] sections in generated documents',
        'Both business and technical docs must be approved'
      ]
    },

    generate: {
      name: 'generate',
      description: 'Generate applications, features, and test cases',
      usage: [
        'npm run generate app:api <app>',
        'npm run generate app:api <app>/<feature>',
        'npm run generate app:api <app> -- --testcases'
      ],
      examples: [
        'npm run generate app:api shop                # Generate shop app',
        'npm run generate app:api shop/cart          # Add cart feature',
        'npm run generate app:api shop -- --testcases # Generate API tests'
      ],
      options: [
        '--overwrite          Overwrite existing files',
        '--skip-existing      Skip files that already exist',
        '--testcases          Generate API test cases from specifications'
      ],
      notes: [
        'Planning must be approved before app generation',
        'Features follow contract-driven development pattern',
        'Test cases are generated from API specifications'
      ]
    },

    validate: {
      name: 'validate',
      description: 'Comprehensive validation of contracts and code quality',
      usage: [
        'npm run validate app:api',
        'npm run validate app:api <app>'
      ],
      examples: [
        'npm run validate app:api              # Validate all apps',
        'npm run validate app:api climate      # Validate climate app only'
      ],
      notes: [
        'Runs 3-step validation: contracts, TypeScript, syntax',
        'Must pass before deployment',
        'Contract validation ensures API consistency'
      ]
    },

    test: {
      name: 'test',
      description: 'Unified testing interface with multiple test types',
      usage: [
        'npm run test app:api <app>',
        'npm run test app:api <app> -- --unittest',
        'npm run test app:api <app> -- --apitest',
        'npm run test app:api <app> -- --compliance',
        'npm run test app:api <app>/<feature> -- --unittest'
      ],
      examples: [
        'npm run test app:api climate                    # All test types',
        'npm run test app:api climate -- --unittest      # Unit tests only',
        'npm run test app:api climate -- --apitest       # API tests only',
        'npm run test app:api climate/weather -- --unittest # Feature tests'
      ],
      options: [
        '--unittest           Run unit tests only',
        '--apitest            Run API integration tests only',
        '--compliance         Run compliance checks only'
      ],
      notes: [
        'Default runs all test types: unit + API + compliance',
        'API tests require running server',
        'Compliance checks validate against requirements'
      ]
    },

    server: {
      name: 'server',
      description: 'API server lifecycle management',
      usage: [
        'npm run server api:start',
        'npm run server api:stop',
        'npm run server api:restart',
        'npm run server api:status'
      ],
      examples: [
        'npm run server api:start      # Start server manually',
        'npm run server api:restart    # Restart after new features',
        'npm run server api:status     # Check server health'
      ],
      notes: [
        'Restart needed after generating new apps/features',
        'Server runs on http://localhost:3001 by default',
        'For development, use npm run dev:api instead'
      ]
    },

    routes: {
      name: 'routes',
      description: 'Discover and list API routes from contracts',
      usage: [
        'npm run routes',
        'npm run routes app:api',
        'npm run routes app:api <app>',
        'npm run routes app:api <app>/<feature>'
      ],
      examples: [
        'npm run routes                       # All routes (default)',
        'npm run routes app:api               # All routes (explicit)',
        'npm run routes app:api climate       # Climate app routes',
        'npm run routes app:api climate/weather  # Weather feature routes'
      ],
      notes: [
        'Routes discovered from feature contracts',
        'Color-coded by HTTP method',
        'Shows full API paths and handlers',
        'Consistent with other Voila command patterns'
      ]
    },

    workflow: {
      name: 'workflow',
      description: 'Step-by-step development workflow management with built-in validation',
      usage: [
        'npm run generate workflow <app>',
        'npm run context workflow:status',
        'npm run context workflow:next'
      ],
      examples: [
        'npm run generate workflow converter    # Generate workflow from tech spec',
        'npm run context workflow:status        # Show current progress',
        'npm run context workflow:next          # Get next step to do'
      ],
      notes: [
        'Built-in validation prevents invalid workflows from being created',
        'Workflows generated from approved technical specifications only',
        'Enforces one-feature-at-a-time development approach',
        'Tracks progress in .voila/workflow.yml file',
        'Prevents Claude from skipping steps or rushing ahead',
        'Human-customizable - edit .voila/workflow.yml as needed'
      ]
    },

    dev: {
      name: 'dev:api',
      description: 'Development server with automatic restart on changes',
      usage: [
        'npm run dev:api'
      ],
      examples: [
        'npm run dev:api    # Start development with hot reload'
      ],
      notes: [
        'Recommended for active development',
        'Automatically restarts on file changes',
        'Discovers new apps and features automatically'
      ]
    }
  };

  const help = commandHelps[command];
  
  if (!help) {
    console.log(`❌ No help available for command: ${command}`);
    console.log('\n📋 Available commands:');
    Object.keys(commandHelps).forEach(cmd => {
      console.log(`   ${cmd}`);
    });
    console.log('\n💡 Run "npm run help" to see all commands');
    return;
  }

  console.log(`📖 Help: ${help.name}`);
  console.log(`${help.description}\n`);
  
  console.log('📋 Usage:');
  help.usage.forEach(usage => {
    console.log(`   ${usage}`);
  });
  console.log('');
  
  console.log('💡 Examples:');
  help.examples.forEach(example => {
    console.log(`   ${example}`);
  });
  console.log('');
  
  if (help.options) {
    console.log('⚙️ Options:');
    help.options.forEach(option => {
      console.log(`   ${option}`);
    });
    console.log('');
  }
  
  if (help.notes) {
    console.log('📝 Notes:');
    help.notes.forEach(note => {
      console.log(`   • ${note}`);
    });
    console.log('');
  }
  
  console.log('🔗 Related commands:');
  const related = getRelatedCommands(command);
  related.forEach(cmd => {
    console.log(`   npm run ${cmd}`);
  });
}

function getRelatedCommands(command: string): string[] {
  const relations: Record<string, string[]> = {
    context: ['plan start', 'help generate'],
    plan: ['generate app:api', 'help generate'],
    generate: ['validate app:api', 'dev:api', 'test app:api'],
    validate: ['test app:api', 'lint', 'typecheck'],
    test: ['validate app:api', 'server api:status'],
    server: ['dev:api', 'routes'],
    routes: ['server api:status', 'validate app:api'],
    dev: ['server api:restart', 'routes', 'validate app:api']
  };
  
  return relations[command] || ['help'];
}

function showGeneralHelp() {
  console.log(`
💡 Voila Framework Help System

USAGE:
  npm run help                    Show all available commands
  npm run help <command>          Show detailed help for specific command

AVAILABLE COMMANDS:
  context, plan, generate, validate, test, server, routes, dev

EXAMPLES:
  npm run help                    # Show all commands
  npm run help generate           # Help for generate command
  npm run help test               # Help for test command

QUICK REFERENCE:
  📚 Learn:     npm run context voila:framework
  📋 Plan:      npm run plan start myapp "description"
  🏗️ Generate:  npm run generate app:api myapp
  ⚙️ Develop:   npm run dev:api
  🔍 Validate:  npm run validate app:api myapp
  🧪 Test:      npm run test app:api myapp
  🛣️ Routes:    npm run routes
`);
}

main();