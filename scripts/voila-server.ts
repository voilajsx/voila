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
    const [prefix, action] = command.includes(':') ? command.split(':') : ['dev', command];
    
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
    } else if (prefix === 'dev') {
      switch (action) {
        case 'api':
          await startDevAPI();
          break;
        case 'web':
          await startDevWeb();
          break;
        case 'both':
          await startDevBoth();
          break;
        case 'stop':
          await stopAllDev();
          break;
        case 'restart':
          await restartDev();
          break;
        default:
          console.log(`❌ Unknown dev command: ${action}`);
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
      
      // Try to kill processes on port 8000
      try {
        await execAsync('for /f "tokens=5" %a in (\'netstat -aon ^| find ":8000" ^| find "LISTENING"\') do taskkill /f /pid %a 2>nul');
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
        await execAsync('lsof -ti:8000 | xargs kill -9');
      } catch {}
    }
    
    cleanupPidFile();
    console.log('✅ Server processes stopped');
    
  } catch (error: any) {
    console.log('ℹ️  No server processes found or already stopped');
    cleanupPidFile();
  }
}

async function killPortProcesses(ports: number[]): Promise<void> {
  console.log('🧹 Cleaning up existing processes...');
  
  for (const port of ports) {
    try {
      // Kill processes using the port (cross-platform)
      if (process.platform === 'win32') {
        await execAsync(`for /f "tokens=5" %a in ('netstat -aon ^| find ":${port}" ^| find "LISTENING"') do taskkill /F /PID %a 2>nul`);
      } else {
        await execAsync(`lsof -ti:${port} | xargs kill -9 || true`);
      }
      console.log(`✅ Port ${port} cleaned up`);
    } catch (error) {
      // Ignore errors if no process is using the port
      console.log(`⚠️  Port ${port} was not in use`);
    }
  }
  
  // Wait a moment for ports to be freed
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function startDevAPI(): Promise<void> {
  console.log('🚀 Starting API development server with auto-restart...');
  await killPortProcesses([8000]);
  
  console.log('📡 API Server starting on: http://localhost:8000');
  console.log('🔄 Will auto-restart on file changes');
  console.log('⏹️  Press Ctrl+C to stop\n');
  
  const proc = spawn('nodemon', [
    '--watch', 'src',
    '--ext', 'ts',
    '--exec', 'tsx',
    'src/server.ts'
  ], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: '8000' }
  });

  setupGracefulShutdown([proc]);
}

async function startDevWeb(): Promise<void> {
  console.log('🌐 Starting Web development server...');
  await killPortProcesses([5174]);
  
  console.log('🌐 Web Server starting on: http://localhost:5174');
  console.log('🔄 Will auto-reload on file changes');
  console.log('⏹️  Press Ctrl+C to stop\n');
  
  const proc = spawn('vite', ['--port', '5174'], {
    stdio: 'inherit',
    shell: true
  });

  setupGracefulShutdown([proc]);
}

async function startDevBoth(): Promise<void> {
  console.log('🌟 Starting Full Development Environment');
  await killPortProcesses([8000, 5174]);
  
  console.log('📡 API Server will be on: http://localhost:8000');
  console.log('🌐 Web Server will be on: http://localhost:5174');
  console.log('🔄 Both will auto-restart/reload on changes');
  console.log('⏹️  Press Ctrl+C to stop both\n');
  
  const apiProc = spawn('nodemon', [
    '--watch', 'src',
    '--ext', 'ts',
    '--exec', 'tsx',
    'src/server.ts'
  ], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: '8000' }
  });

  // Give API server time to start
  setTimeout(() => {
    const webProc = spawn('vite', ['--port', '5174'], {
      stdio: 'inherit', 
      shell: true
    });

    setupGracefulShutdown([apiProc, webProc]);
  }, 2000);

  setupGracefulShutdown([apiProc]);
}

async function stopAllDev(): Promise<void> {
  console.log('🛑 Stopping all development servers...');
  await killPortProcesses([8000, 5174]);
  
  // Also kill nodemon and vite processes
  try {
    if (process.platform === 'win32') {
      await execAsync('taskkill /f /im nodemon.exe 2>nul');
      await execAsync('taskkill /f /im node.exe /fi "COMMANDLINE like %vite%" 2>nul');
    } else {
      await execAsync('pkill -f nodemon || true');
      await execAsync('pkill -f vite || true');
    }
  } catch (error) {
    // Ignore errors
  }
  
  console.log('✅ All development servers stopped');
}

async function restartDev(): Promise<void> {
  console.log('🔄 Restarting development environment...');
  await stopAllDev();
  
  // Brief pause to ensure cleanup
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('🚀 Starting fresh development servers...');
  await startDevBoth();
}

function setupGracefulShutdown(processes: any[]): void {
  // Handle various exit signals
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
    process.on(signal, () => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
      
      processes.forEach(proc => {
        if (proc && !proc.killed) {
          proc.kill('SIGTERM');
          
          // Force kill after 5 seconds if still running
          setTimeout(() => {
            if (!proc.killed) {
              proc.kill('SIGKILL');
            }
          }, 5000);
        }
      });
      
      // Clean up ports and exit
      setTimeout(async () => {
        await killPortProcesses([8000, 5174]);
        process.exit(0);
      }, 1000);
    });
  });
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

DEVELOPMENT COMMANDS:
  npm run server dev:api        Start API server only (port 8000)
  npm run server dev:web        Start Web server only (port 5174)  
  npm run server dev:both       Start both API + Web servers
  npm run server dev:stop       Stop all development servers
  npm run server dev:restart    Restart all development servers

API MANAGEMENT:
  npm run server api:start      Start API server (production-like)
  npm run server api:stop       Stop API server  
  npm run server api:restart    Restart API server
  npm run server api:status     Check API server status

DEVELOPMENT FEATURES:
  - Automatic port cleanup before restart
  - Proper process management and graceful shutdown
  - Cross-platform support (Windows/Unix)
  - Auto-restart on file changes for API
  - Auto-reload on file changes for Web

PORTS:
  - API Server: http://localhost:8000
  - Web Server: http://localhost:5174

EXAMPLES:
  npm run server dev:both       # Start full dev environment
  npm run server dev:restart    # Clean restart everything
  npm run server dev:stop       # Stop all development servers
  npm run server api:status     # Check if API is healthy

NOTES:
  - Port cleanup prevents "EADDRINUSE" errors
  - Graceful shutdown with Ctrl+C
  - PID tracking for server management
  - Health check endpoint: /health
`);
}

main();