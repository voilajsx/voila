#!/usr/bin/env tsx

/**
 * Voila Prisma Commands Script  
 * Unified interface for all Prisma operations per app
 * 
 * Usage:
 *   npm run prisma init greeting
 *   npm run prisma db:generate greeting
 *   npm run prisma db:migrate greeting -- --name add_users
 *   npm run prisma db:studio greeting
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PrismaCommand {
  command: string;
  description: string;
  requiresName?: boolean;
}

const PRISMA_COMMANDS: Record<string, PrismaCommand> = {
  'init': { command: 'init', description: 'Initialize Prisma for app' },
  'db:generate': { command: 'generate', description: 'Generate Prisma client' },
  'db:migrate': { command: 'migrate dev', description: 'Create and apply migration', requiresName: true },
  'db:studio': { command: 'studio', description: 'Open Prisma Studio' },
  'db:push': { command: 'db push', description: 'Push schema to database' },
  'db:reset': { command: 'migrate reset', description: 'Reset database' },
  'db:seed': { command: 'db seed', description: 'Run database seed' },
  'db:format': { command: 'format', description: 'Format schema file' },
  'db:validate': { command: 'validate', description: 'Validate schema file' },
  'db:deploy': { command: 'migrate deploy', description: 'Deploy migrations (production)' }
};

function showHelp() {
  console.log(`
🗄️  Voila Prisma Commands - Per-App Database Management

USAGE:
  npm run prisma <command> <app-name> [-- prisma-args]

COMMANDS:
  init <app>                      Initialize Prisma setup for app
  db:generate <app>               Generate Prisma client for app
  db:migrate <app>                Create and apply migration 
  db:studio <app>                 Open Prisma Studio for app
  db:push <app>                   Push schema changes without migration
  db:reset <app>                  Reset database for app
  db:seed <app>                   Run database seed for app
  db:format <app>                 Format schema file for app
  db:validate <app>               Validate schema file for app
  db:deploy <app>                 Deploy migrations (production)

EXAMPLES:
  npm run prisma init greeting                         # Initialize Prisma for greeting app
  npm run prisma db:generate greeting                  # Generate client for greeting app
  npm run prisma db:migrate greeting -- --name add_logs # Create migration named "add_logs"
  npm run prisma db:studio greeting                    # Open studio for greeting app
  npm run prisma db:push greeting                      # Push schema without migration
  npm run prisma db:reset greeting                     # Reset greeting app database

WORKFLOW:
  1. npm run prisma init myapp                         # Initialize Prisma boilerplate
  2. Edit src/api/myapp/prisma/schema.prisma           # Define your models
  3. npm run prisma db:migrate myapp -- --name init   # Create initial migration
  4. npm run prisma db:generate myapp                  # Generate client

APP STRUCTURE:
  src/api/greeting/
  ├── prisma/
  │   ├── schema.prisma          # Prisma schema
  │   ├── migrations/            # Migration files
  │   └── generated/client/      # Generated client
  └── .env.example              # Database config template

NOTES:
  • Each app has its own isolated Prisma setup (no per-app node_modules)
  • All dependencies managed at root level (cleaner monorepo)
  • Generic boilerplate - customize schema.prisma for your needs
  • All commands run in the app's directory context
`);
}

async function initPrismaForApp(appName: string, overwrite: boolean = false): Promise<void> {
  console.log(`🗄️ Initializing Prisma for app: ${appName}`);
  
  if (!appName) {
    throw new Error('App name is required. Usage: npm run prisma init <app-name>');
  }
  
  // Validate app name format
  if (!/^[a-z][a-z0-9-]*$/.test(appName)) {
    throw new Error('Invalid app name. Use lowercase letters, numbers, and hyphens. Must start with letter.');
  }
  
  const appDir = join(__dirname, '..', 'src', 'api', appName);
  
  // Check if app exists
  if (!existsSync(appDir)) {
    throw new Error(`App '${appName}' not found. Run: npm run generate app:api ${appName}`);
  }
  
  const prismaDir = join(appDir, 'prisma');
  const schemaPath = join(prismaDir, 'schema.prisma');
  const migrationsDir = join(prismaDir, 'migrations');
  
  // Check if Prisma already exists
  if (existsSync(schemaPath) && !overwrite) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚨 SAFETY HALT - Prisma already exists');
    console.log('');
    console.log('✅ To reinitialize Prisma:');
    console.log(`   npm run prisma init ${appName} -- --overwrite`);
    throw new Error('Prisma already exists - use --overwrite flag to reinitialize');
  }
  
  // Create prisma directory structure
  if (!existsSync(prismaDir)) {
    mkdirSync(prismaDir, { recursive: true });
  }
  if (!existsSync(migrationsDir)) {
    mkdirSync(migrationsDir, { recursive: true });
  }
  
  console.log('✅ Created Prisma directory structure');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Generate minimal generic Prisma schema with dummy data
  const schemaContent = `// Prisma schema for ${appName} app
// This is your Prisma schema file - customize it for your needs
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========================================
// DUMMY MODELS - DO NOT USE IN PRODUCTION
// ========================================
// These are example models for reference only
// Replace with your actual business models

model DummyUser {
  id        String      @id @default(uuid())
  email     String      @unique
  name      String?
  posts     DummyPost[]
  createdAt DateTime    @default(now()) @map("created_at")
  updatedAt DateTime    @updatedAt @map("updated_at")

  @@map("${appName}_dummy_users")
}

model DummyPost {
  id        String    @id @default(uuid())
  title     String
  content   String?
  published Boolean   @default(false)
  authorId  String    @map("author_id")
  author    DummyUser @relation(fields: [authorId], references: [id])
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  @@map("${appName}_dummy_posts")
}

// ========================================
// ADD YOUR REAL MODELS HERE
// ========================================
// Replace the dummy models above with your actual business models
// Remember: Use table names with app prefix (e.g., ${appName}_orders, ${appName}_products)
`;

  // Write schema file
  await writeFile(schemaPath, schemaContent, 'utf-8');
  console.log('📁 Created generic schema.prisma');
  
  // Generate .env.example for database
  const envExamplePath = join(appDir, '.env.example');
  const envExampleContent = `# ${appName.toUpperCase()} App Database Configuration
# Add these to your main .env file (root level)

# AppKit Database Configuration (standard)
DATABASE_URL="postgresql://username:password@localhost:5432/voila_development"

# Optional: AppKit Multi-tenancy (uncomment to enable)
# VOILA_DB_TENANT=auto

# Production example:
# DATABASE_URL="postgresql://user:pass@prod-db:5432/voila_production"
`;

  if (!existsSync(envExamplePath) || overwrite) {
    await writeFile(envExamplePath, envExampleContent, 'utf-8');
    console.log('📁 Created .env.example');
  }
  
  console.log('');
  console.log('📋 PRISMA INITIALIZED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📂 Location: src/api/${appName}/prisma/`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Add DATABASE_URL to your .env file');
  console.log(`   2. Edit src/api/${appName}/prisma/schema.prisma with your models`);
  console.log(`   3. npm run prisma db:migrate ${appName} -- --name init`);
  console.log(`   4. npm run prisma db:generate ${appName}`);
  console.log('');
  console.log('💡 Schema is generic - customize it for your specific needs!');
}

async function runPrismaCommand(commandName: string, appName: string, additionalArgs: string[] = []): Promise<void> {
  if (!appName) {
    console.error('❌ App name is required');
    showHelp();
    process.exit(1);
  }

  // Handle init command separately
  if (commandName === 'init') {
    // Check for --overwrite in all args, not just after --
    const allArgs = process.argv.slice(2);
    const overwrite = allArgs.includes('--overwrite');
    await initPrismaForApp(appName, overwrite);
    return;
  }

  // Validate command
  const prismaCmd = PRISMA_COMMANDS[commandName];
  if (!prismaCmd) {
    console.error(`❌ Unknown Prisma command: ${commandName}`);
    console.error('Available commands:', Object.keys(PRISMA_COMMANDS).join(', '));
    process.exit(1);
  }

  // Validate app exists
  const appDir = join(__dirname, '..', 'src', 'api', appName);
  if (!existsSync(appDir)) {
    console.error(`❌ App '${appName}' not found at: ${appDir}`);
    console.error(`   Run: npm run generate app:api ${appName}`);
    process.exit(1);
  }

  // Check if Prisma is set up for this app
  const prismaDir = join(appDir, 'prisma');
  const schemaPath = join(prismaDir, 'schema.prisma');
  if (!existsSync(schemaPath)) {
    console.error(`❌ Prisma not set up for app '${appName}'`);
    console.error(`   Run: npm run prisma init ${appName}`);
    process.exit(1);
  }

  console.log(`🗄️ Running Prisma ${commandName} for app: ${appName}`);
  console.log(`📂 Working directory: src/api/${appName}`);
  console.log(`🔧 Command: prisma ${prismaCmd.command}`);
  
  if (additionalArgs.length > 0) {
    console.log(`📝 Arguments: ${additionalArgs.join(' ')}`);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Build full command args
  const commandArgs = prismaCmd.command.split(' ').concat(additionalArgs);

  // Execute Prisma command in app directory
  const prismaProcess = spawn('npx', ['prisma', ...commandArgs], {
    cwd: appDir,
    stdio: 'inherit',
    shell: true
  });

  prismaProcess.on('error', (error) => {
    console.error(`❌ Failed to execute Prisma command: ${error.message}`);
    process.exit(1);
  });

  prismaProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`✅ Prisma ${commandName} completed successfully for ${appName}`);
      
      // Provide helpful next steps
      switch (commandName) {
        case 'db:generate':
          console.log(`💡 Generated client available at: src/api/${appName}/prisma/generated/client`);
          break;
        case 'db:migrate':
          console.log(`💡 Don't forget to run: npm run prisma db:generate ${appName}`);
          break;
        case 'db:studio':
          console.log(`💡 Prisma Studio opened for ${appName} app`);
          break;
        default:
          console.log(`💡 ${prismaCmd.description} completed for ${appName}`);
      }
    } else {
      console.error(`❌ Prisma ${commandName} failed with exit code: ${code}`);
      process.exit(code || 1);
    }
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    return;
  }

  // Parse command and app name from arguments
  // Expected: npx tsx voila-prisma-commands.ts db:generate greeting [-- additional-args]
  const commandName = args[0];
  const appName = args[1];
  
  // Parse additional arguments (everything after -- gets passed to Prisma)
  const dashDashIndex = args.indexOf('--');
  let additionalArgs: string[] = [];
  
  if (dashDashIndex !== -1) {
    additionalArgs = args.slice(dashDashIndex + 1);
  }

  if (commandName === 'help' || commandName === '--help' || commandName === '-h') {
    showHelp();
    return;
  }

  await runPrismaCommand(commandName, appName, additionalArgs);
}

main().catch((error) => {
  console.error('💥 Voila Prisma Error:', error.message);
  process.exit(1);
});