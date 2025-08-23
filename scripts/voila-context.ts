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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ContextCommand {
  name: string;
  description: string;
  docs: string[];
  instructions: string;
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
  const contexts: Record<string, ContextCommand> = {
    'voila:framework': {
      name: 'Voila Framework Core',
      description: 'Learn the complete Voila Framework patterns and architecture',
      docs: [
        'docs/lib/VOILA-ARCHITECTURE.md',
        'docs/lib/APPKIT_LLM_GUIDE.md',
        'docs/lib/VOILA-COMMENT-GUIDELINES.md',
        'docs/lib/VOILA-GETTING-STARTED.md'
      ],
      instructions: `
🎯 LEARN THE VOILA FRAMEWORK

Read these documents in sequence to understand the complete framework:

1. **Architecture Foundation** - Read docs/lib/VOILA-ARCHITECTURE.md
   - Understand contract-driven development
   - Learn auto-discovery patterns
   - Grasp feature-based organization

2. **Development Patterns** - Read docs/lib/APPKIT_LLM_GUIDE.md
   - Master VoilaJSX AppKit integration
   - Understand enterprise patterns
   - Learn core utilities and services

3. **Code Standards** - Read docs/lib/VOILA-COMMENT-GUIDELINES.md
   - Follow documentation standards
   - Understand comment patterns
   - Learn consistency requirements

4. **Practical Guide** - Read docs/lib/VOILA-GETTING-STARTED.md
   - Master the development workflow
   - Understand planning process
   - Learn all available commands

✅ AFTER READING: You'll be ready to help users build applications using Voila Framework patterns.`
    },

    'voila:comments': {
      name: 'Voila Comment Standards',
      description: 'Understand comment and documentation standards',
      docs: [
        'docs/lib/VOILA-COMMENT-GUIDELINES.md'
      ],
      instructions: `
📝 LEARN VOILA COMMENT STANDARDS

Read this document to understand documentation patterns:

1. **Comment Guidelines** - Read docs/lib/VOILA-COMMENT-GUIDELINES.md
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
        'docs/lib/APPKIT_LLM_GUIDE.md', 
        'docs/lib/VOILA-COMMENT-GUIDELINES.md',
        'docs/lib/VOILA-GETTING-STARTED.md',
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
2. Read docs/lib/APPKIT_LLM_GUIDE.md - VoilaJSX AppKit integration
3. Read docs/lib/VOILA-COMMENT-GUIDELINES.md - Code standards
4. Read docs/lib/VOILA-GETTING-STARTED.md - Development workflow

📋 PLANNING SYSTEM:
5. Read docs/planning/demo/demo-business-requirements-v1.md - Business requirements format
6. Read docs/planning/demo/demo-technical-specification-v1.md - Technical specifications format

🚀 EXAMPLES:
7. Read docs/app/greeting.brd.md - Example business requirements
8. Read docs/app/greeting.fsd.md - Example functional spec
9. Read docs/app/greeting.tsd.md - Example technical spec

⚙️ CONFIGURATION:
10. Read package.json - Available scripts and dependencies

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

AVAILABLE CONTEXTS:
  voila:framework    - Learn complete Voila Framework (architecture, patterns, workflow)
  voila:comments     - Learn VoilaJSX comment and documentation standards  
  voila:planning     - Learn the human-controlled planning workflow
  voila:examples     - Study real application implementations
  voila:all          - Complete framework mastery (all documents)

EXAMPLES:
  npm run context voila:framework
  npm run context voila:comments
  npm run context voila:planning

WORKFLOW:
  1. Run context command
  2. Claude reads the specified documents
  3. Claude becomes expert in that area
  4. Ask Claude what you want to create!
`);
}

main();