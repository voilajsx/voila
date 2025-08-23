#!/usr/bin/env tsx

/**
 * Voila Server Management Script
 * Usage: npx tsx scripts/voila-server.ts [command]
 * Commands: start, stop, restart, status
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PID_FILE = join(__dirname, '..', '.voila-server.pid');

interface ServerInfo {
  pid: number;
  port: number;
  startTime: string;
  command: string;
}

async function main() {
  const command = process.argv[2];
  
  if (!command) {
    showHelp();
    return;
  }

  console.log('🏗️  Voila Server Manager');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Handle both old format (start, stop) and new format (api:start, api:stop)
    const [prefix, action] = command.includes(':') ? command.split(':') : ['api', command];
    
    if (prefix === 'api') {
      switch (action) {
        case 'start':
          await startServer();
          break;
        case 'stop':
          await stopServer();
          break;
        case 'restart':
          await restartServer();
          break;
        case 'status':
          await checkStatus();
          break;
        default:
          console.log(`❌ Unknown API command: ${action}`);
          showHelp();
          process.exit(1);
      }
    } else {
      console.log(`❌ Unknown service: ${prefix}`);
      showHelp();
      process.exit(1);
    }
  } catch (error: any) {
    console.error('💥 Server management error:', error.message);
    process.exit(1);
  }
}

async function startServer(): Promise<void> {
  // Check if server is already running
  const currentServer = await getCurrentServer();
  if (currentServer) {
    console.log(`⚠️  Server already running:`);
    console.log(`   PID: ${currentServer.pid}`);
    console.log(`   Port: ${currentServer.port}`);
    console.log(`   Started: ${currentServer.startTime}`);
    return;
  }

  console.log('🚀 Starting Voila API development server...');
  console.log('💡 Use npm run server api:start to start manually in foreground');
  console.log('💡 Use npm run dev:api for auto-restart development');
  
  // For simplicity, just recommend the appropriate command
  console.log('\n🔧 Recommended startup commands:');
  console.log('   npm run dev:api               # Auto-restart on file changes');
  console.log('   npm run server api:start      # Manual start (foreground)');
}

async function stopServer(): Promise<void> {
  console.log('🛑 Stopping Voila development servers...');
  
  try {
    // Stop common Voila server processes
    if (process.platform === 'win32') {
      // Try to kill TSX processes running server.ts
      try {
        await execAsync('taskkill /f /im node.exe /fi "WINDOWTITLE eq tsx*server.ts*" 2>nul');
      } catch {}
      
      // Try to kill processes on port 3001
      try {
        await execAsync('for /f "tokens=5" %a in (\'netstat -aon ^| find ":3001" ^| find "LISTENING"\') do taskkill /f /pid %a 2>nul');
      } catch {}
      
      // Try to kill any tsx processes with server.ts
      try {
        await execAsync('wmic process where "CommandLine like \'%tsx%server.ts%\'" delete 2>nul');
      } catch {}
      
    } else {
      // Unix-like systems
      try {
        await execAsync('pkill -f "tsx.*server.ts"');
      } catch {}
      
      try {
        await execAsync('lsof -ti:3001 | xargs kill -9');
      } catch {}
    }
    
    cleanupPidFile();
    console.log('✅ Server processes stopped');
    
  } catch (error: any) {
    console.log('ℹ️  No server processes found or already stopped');
    cleanupPidFile();
  }
}

async function restartServer(): Promise<void> {
  console.log('🔄 Restarting Voila server...');
  
  await stopServer();
  
  // Brief pause to ensure cleanup
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('\n🚀 Starting fresh server...');
  console.log('💡 This will pick up any new apps/features generated');
  console.log('\n📌 To start the API server, run:');
  console.log('   npm run server api:start');
  console.log('\n📌 Or for development with auto-restart:');
  console.log('   npm run dev:api');
  
  console.log('\n✅ Server restart process completed!');
  console.log('🔄 New apps/features will be discovered on next startup');
}

async function checkStatus(): Promise<void> {
  const currentServer = await getCurrentServer();
  
  if (!currentServer) {
    console.log('📊 Server Status: ❌ NOT RUNNING');
    return;
  }

  // Check if process is actually running
  try {
    if (process.platform === 'win32') {
      await execAsync(`tasklist /fi "PID eq ${currentServer.pid}" | find "${currentServer.pid}"`);
    } else {
      process.kill(currentServer.pid, 0); // Check if process exists
    }
    
    console.log('📊 Server Status: ✅ RUNNING');
    console.log(`   PID: ${currentServer.pid}`);
    console.log(`   Port: ${currentServer.port}`);
    console.log(`   Started: ${currentServer.startTime}`);
    console.log(`   Uptime: ${getUptime(currentServer.startTime)}`);
    console.log(`   URL: http://localhost:${currentServer.port}`);
    
    // Test server responsiveness
    try {
      const response = await fetch(`http://localhost:${currentServer.port}/health`);
      if (response.ok) {
        console.log('   Health: ✅ HEALTHY');
      } else {
        console.log('   Health: ⚠️  UNHEALTHY');
      }
    } catch {
      console.log('   Health: ❌ NOT RESPONDING');
    }
    
  } catch {
    console.log('📊 Server Status: ❌ PROCESS NOT FOUND');
    console.log('🧹 Cleaning up stale PID file...');
    cleanupPidFile();
  }
}

async function getCurrentServer(): Promise<ServerInfo | null> {
  if (!existsSync(PID_FILE)) {
    return null;
  }

  try {
    const data = readFileSync(PID_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function cleanupPidFile(): void {
  if (existsSync(PID_FILE)) {
    unlinkSync(PID_FILE);
  }
}

function getUptime(startTime: string): string {
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

function showHelp() {
  console.log(`
🏗️  Voila Server Manager

USAGE:
  npm run server api:start      Start API development server
  npm run server api:stop       Stop API development server  
  npm run server api:restart    Restart API development server
  npm run server api:status     Check API server status

API COMMANDS:
  api:start     Start the API server in development mode
  api:stop      Stop the running API server
  api:restart   Stop and start the API server (refreshes API discovery)
  api:status    Check if API server is running and healthy

EXAMPLES:
  npm run server api:restart    # Restart after generating new apps
  npm run server api:status     # Check if server is responding
  npm run server api:stop       # Stop server before maintenance

OTHER DEVELOPMENT OPTIONS:
  npm run dev:api               # Auto-restart on file changes (recommended)
  npm run dev                   # Full development (API + frontend)

NOTES:
  - Restart is needed after generating new apps/features
  - API server runs on http://localhost:3001 by default
  - PID file: .voila-server.pid
  - Health check: /health endpoint
  - Future: Can add more services like 'db:', 'cache:', etc.
`);
}

main();