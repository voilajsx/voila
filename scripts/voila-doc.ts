#!/usr/bin/env npx tsx
/**
 * @file scripts/voila-doc.ts
 * VoilaJS Documentation Generator
 * Generates TypeDoc documentation with custom AI tags support
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const PROJECT_ROOT = process.cwd();
const TYPEDOC_CONFIG = path.join(PROJECT_ROOT, 'typedoc.json');
const DOCS_OUTPUT = path.join(PROJECT_ROOT, 'docs/typedocs');

/**
 * Open documentation in the default browser
 */
function openDocs(): void {
  const indexPath = path.join(DOCS_OUTPUT, 'index.html');
  
  if (!existsSync(indexPath)) {
    console.log('❌ Documentation not found. Run npm run doc first.');
    return;
  }

  const platform = process.platform;
  let openCommand: string;

  switch (platform) {
    case 'darwin':
      openCommand = 'open';
      break;
    case 'win32':
      openCommand = 'start';
      break;
    default:
      openCommand = 'xdg-open';
  }

  try {
    execSync(`${openCommand} "${indexPath}"`, { stdio: 'ignore' });
    console.log('🌐 Documentation opened in browser');
  } catch (error) {
    console.log(`🌐 Open documentation manually: file://${indexPath}`);
  }
}

/**
 * Generate TypeDoc documentation
 * @llm-rule WHEN: User runs npm run doc or voila-doc script
 * @llm-rule AVOID: Running without typedoc.json configuration file
 * @llm-rule NOTE: Uses --skipErrorChecking to generate docs despite TypeScript errors
 */
async function generateDocs(): Promise<void> {
  console.log('📚 VoilaJS Documentation Generator');
  console.log('=====================================\n');

  // Verify TypeDoc configuration exists
  if (!existsSync(TYPEDOC_CONFIG)) {
    console.error('❌ Error: typedoc.json configuration file not found');
    console.log('💡 Create typedoc.json in project root to configure documentation generation');
    process.exit(1);
  }

  try {
    // Read and display TypeDoc configuration
    const config = JSON.parse(readFileSync(TYPEDOC_CONFIG, 'utf-8'));
    console.log('⚙️  Configuration:');
    console.log(`   • Entry points: ${config.entryPoints?.join(', ') || 'src/**/*.ts'}`);
    console.log(`   • Output folder: ${config.out || 'docs'}`);
    console.log(`   • Theme: ${config.theme || 'default'}`);
    console.log(`   • Custom tags: ${config.blockTags?.join(', ') || 'none'}`);
    console.log('');

    console.log('🔧 Generating TypeDoc documentation...');
    
    // Generate documentation with error skipping for TypeScript issues
    const startTime = Date.now();
    execSync('npx typedoc --skipErrorChecking', { 
      stdio: 'inherit',
      cwd: PROJECT_ROOT 
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Documentation generated successfully in ${duration}s`);
    console.log(`📁 Output location: ${DOCS_OUTPUT}`);
    
    // Check if docs were generated and offer to open them
    if (existsSync(path.join(DOCS_OUTPUT, 'index.html'))) {
      console.log(`🌐 Open documentation: file://${path.join(DOCS_OUTPUT, 'index.html')}`);
      
      // Auto-open in development mode
      if (process.argv.includes('--open') || process.argv.includes('-o')) {
        openDocs();
      }
    }

    console.log('\n📋 Documentation includes:');
    console.log('   • All TypeScript source files');
    console.log('   • API routes and services');
    console.log('   • Web components and hooks');
    console.log('   • Custom @file and @llm-rule tags');
    console.log('   • Framework contracts and utilities');

  } catch (error: any) {
    console.error('❌ Documentation generation failed:');
    console.error(error.message);
    
    console.log('\n🔍 Troubleshooting:');
    console.log('   • Check typedoc.json configuration');
    console.log('   • Ensure TypeDoc is installed: npm install -D typedoc');
    console.log('   • Fix critical TypeScript errors if needed');
    
    process.exit(1);
  }
}

/**
 * Handle command line arguments
 */
function handleCommand(): void {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('📚 VoilaJS Documentation Generator');
    console.log('Usage:');
    console.log('  npm run doc           Generate documentation');
    console.log('  npm run doc -- --open Generate and open in browser');
    console.log('  npm run doc -- -o     Generate and open in browser (short)');
    console.log('');
    console.log('Options:');
    console.log('  --open, -o  Open documentation in browser after generation');
    console.log('  --help, -h  Show this help message');
    return;
  }

  if (args.includes('open')) {
    // Just open existing docs without regenerating
    openDocs();
    return;
  }

  // Default: generate documentation
  generateDocs().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

/**
 * Main execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  handleCommand();
}

export { generateDocs, openDocs };