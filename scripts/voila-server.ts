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
    // Also support package.json script names directly
    const [prefix, action] = command.includes(':') ? command.split(':') : ['dev', command];
    
    if (prefix === 'api') {
      switch (action) {
        case 'start':
          await startApiServer();
          break;
        case 'stop':
          await stopApiServer();
          break;
        case 'restart':
          await restartApiServer();
          break;
        case 'status':
          await checkApiStatus();
          break;
        default:
          console.log(`❌ Unknown API command: ${action}`);
          showHelp();
          process.exit(1);
      }
    } else if (prefix === 'web') {
      switch (action) {
        case 'start':
          await startWebServer();
          break;
        case 'stop':
          await stopWebServer();
          break;
        case 'restart':
          await restartWebServer();
          break;
        case 'status':
          await checkWebStatus();
          break;
        default:
          console.log(`❌ Unknown web command: ${action}`);
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
        case 'status':
          await checkDevStatus();
          break;
        default:
          console.log(`❌ Unknown dev command: ${action}`);
          showHelp();
          process.exit(1);
      }
    } else {
      // Support package.json script names directly
      switch (command) {
        case 'dev':
          await startDevBoth();
          break;
        case 'start':
          await startApiServer();
          break;
        case 'stop':
          await stopAllServers();
          break;
        case 'restart':
          await restartAllServers();
          break;
        case 'status':
          await checkAllStatus();
          break;
        default:
          console.log(`❌ Unknown command: ${command}`);
          showHelp();
          process.exit(1);
      }
    }
  } catch (error: any) {
    console.error('💥 Server management error:', error.message);
    process.exit(1);
  }
}

async function startApiServer(): Promise<void> {
  console.log('🚀 Starting Voila API server...');
  await killPortProcesses([8000]);
  
  console.log('📡 API Server starting on: http://localhost:8000');
  console.log('⏹️  Press Ctrl+C to stop\n');
  
  const proc = spawn('tsx', ['src/server.ts'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: '8000' }
  });

  // Save server info
  const serverInfo: ServerInfo = {
    pid: proc.pid!,
    port: 8000,
    startTime: new Date().toISOString(),
    command: 'api:start'
  };
  
  writeFileSync(join(__dirname, '..', '.voila-api.pid'), JSON.stringify(serverInfo));
  setupGracefulShutdown([proc], 'api');
}

async function startWebServer(): Promise<void> {
  console.log('🌐 Starting Voila Web server...');
  await killPortProcesses([5174]);
  
  console.log('🌐 Web Server starting on: http://localhost:5174');
  console.log('⏹️  Press Ctrl+C to stop\n');
  
  const proc = spawn('vite', ['preview', '--port', '5174'], {
    stdio: 'inherit',
    shell: true
  });

  // Save server info  
  const serverInfo: ServerInfo = {
    pid: proc.pid!,
    port: 5174,
    startTime: new Date().toISOString(),
    command: 'web:start'
  };
  
  writeFileSync(join(__dirname, '..', '.voila-web.pid'), JSON.stringify(serverInfo));
  setupGracefulShutdown([proc], 'web');
}

async function stopApiServer(): Promise<void> {
  console.log('🛑 Stopping Voila API server...');
  
  const serverInfo = await getCurrentServer('api');
  if (serverInfo) {
    try {
      process.kill(serverInfo.pid, 'SIGTERM');
      console.log('✅ API server stopped gracefully');
    } catch {
      console.log('⚠️  API server process not found, cleaning up...');
    }
    cleanupPidFile('api');
  } else {
    console.log('ℹ️  API server not running');
  }
  
  await killPortProcesses([8000]);
}

async function stopWebServer(): Promise<void> {
  console.log('🛑 Stopping Voila Web server...');
  
  const serverInfo = await getCurrentServer('web');
  if (serverInfo) {
    try {
      process.kill(serverInfo.pid, 'SIGTERM');
      console.log('✅ Web server stopped gracefully');
    } catch {
      console.log('⚠️  Web server process not found, cleaning up...');
    }
    cleanupPidFile('web');
  } else {
    console.log('ℹ️  Web server not running');
  }
  
  await killPortProcesses([5174]);
}

async function stopAllServers(): Promise<void> {
  console.log('🛑 Stopping all Voila servers...');
  await Promise.all([
    stopApiServer(),
    stopWebServer(),
    stopAllDev()
  ]);
  console.log('✅ All servers stopped');
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

async function restartApiServer(): Promise<void> {
  console.log('🔄 Restarting Voila API server...');
  await stopApiServer();
  await new Promise(resolve => setTimeout(resolve, 2000));
  await startApiServer();
}

async function restartWebServer(): Promise<void> {
  console.log('🔄 Restarting Voila Web server...');
  await stopWebServer();
  await new Promise(resolve => setTimeout(resolve, 2000));
  await startWebServer();
}

async function restartAllServers(): Promise<void> {
  console.log('🔄 Restarting all Voila servers...');
  await stopAllServers();
  await new Promise(resolve => setTimeout(resolve, 2000));
  await startApiServer();
}

function setupGracefulShutdown(processes: any[], serverType?: string): void {
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
      
      // Clean up PID files
      if (serverType) {
        cleanupPidFile(serverType);
      }
      
      // Clean up ports and exit
      setTimeout(async () => {
        await killPortProcesses([8000, 5174]);
        process.exit(0);
      }, 1000);
    });
  });
}

async function checkApiStatus(): Promise<void> {
  console.log('📊 API Server Status:');
  const serverInfo = await getCurrentServer('api');
  
  if (!serverInfo) {
    console.log('   Status: ❌ NOT RUNNING');
    return;
  }

  await checkServerStatus(serverInfo, 'api');
}

async function checkWebStatus(): Promise<void> {
  console.log('📊 Web Server Status:');
  const serverInfo = await getCurrentServer('web');
  
  if (!serverInfo) {
    console.log('   Status: ❌ NOT RUNNING');
    return;
  }

  await checkServerStatus(serverInfo, 'web');
}

async function checkDevStatus(): Promise<void> {
  console.log('📊 Development Servers Status:');
  
  const apiRunning = await isPortInUse(8000);
  const webRunning = await isPortInUse(5174);
  
  console.log(`   API (port 8000): ${apiRunning ? '✅ RUNNING' : '❌ STOPPED'}`);
  console.log(`   Web (port 5174): ${webRunning ? '✅ RUNNING' : '❌ STOPPED'}`);
  
  if (apiRunning || webRunning) {
    console.log('\n💡 To stop development servers: npm run server dev:stop');
  } else {
    console.log('\n💡 To start development servers: npm run server dev:both');
  }
}

async function checkAllStatus(): Promise<void> {
  console.log('📊 All Servers Status:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  await checkApiStatus();
  console.log();
  await checkWebStatus();
  console.log();
  await checkDevStatus();
}

async function checkServerStatus(serverInfo: ServerInfo, type: string): Promise<void> {
  try {
    if (process.platform === 'win32') {
      await execAsync(`tasklist /fi "PID eq ${serverInfo.pid}" | find "${serverInfo.pid}"`);
    } else {
      process.kill(serverInfo.pid, 0);
    }
    
    console.log('   Status: ✅ RUNNING');
    console.log(`   PID: ${serverInfo.pid}`);
    console.log(`   Port: ${serverInfo.port}`);
    console.log(`   Started: ${serverInfo.startTime}`);
    console.log(`   Uptime: ${getUptime(serverInfo.startTime)}`);
    console.log(`   URL: http://localhost:${serverInfo.port}`);
    
    // Test server responsiveness
    const healthEndpoint = type === 'api' ? '/health' : '/';
    try {
      const response = await fetch(`http://localhost:${serverInfo.port}${healthEndpoint}`);
      if (response.ok) {
        console.log('   Health: ✅ RESPONDING');
      } else {
        console.log('   Health: ⚠️  NOT HEALTHY');
      }
    } catch {
      console.log('   Health: ❌ NOT RESPONDING');
    }
    
  } catch {
    console.log('   Status: ❌ PROCESS NOT FOUND');
    console.log('   🧹 Cleaning up stale PID file...');
    cleanupPidFile(type);
  }
}

async function getCurrentServer(type?: string): Promise<ServerInfo | null> {
  const pidFile = type ? 
    join(__dirname, '..', `.voila-${type}.pid`) : 
    join(__dirname, '..', '.voila-server.pid');
    
  if (!existsSync(pidFile)) {
    return null;
  }

  try {
    const data = readFileSync(pidFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function cleanupPidFile(type?: string): void {
  const pidFile = type ? 
    join(__dirname, '..', `.voila-${type}.pid`) : 
    join(__dirname, '..', '.voila-server.pid');
    
  if (existsSync(pidFile)) {
    unlinkSync(pidFile);
  }
}

async function isPortInUse(port: number): Promise<boolean> {
  try {
    if (process.platform === 'win32') {
      const result = await execAsync(`netstat -an | findstr :${port}`);
      return result.stdout.includes('LISTENING');
    } else {
      await execAsync(`lsof -i:${port}`);
      return true;
    }
  } catch {
    return false;
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
🏗️  Voila Server Manager - Unified Development & Production Server Management

DEVELOPMENT COMMANDS (Auto-restart/reload):
  npm run server dev:api        Start API dev server only (port 8000) with nodemon
  npm run server dev:web        Start Web dev server only (port 5174) with vite
  npm run server dev:both       Start both API + Web dev servers
  npm run server dev:stop       Stop all development servers
  npm run server dev:restart    Restart all development servers  
  npm run server dev:status     Check development servers status

API PRODUCTION COMMANDS:
  npm run server api:start      Start API server (production-like with tsx)
  npm run server api:stop       Stop API server gracefully
  npm run server api:restart    Restart API server
  npm run server api:status     Check API server status & health

WEB PRODUCTION COMMANDS:
  npm run server web:start      Start Web server (production-like with vite preview)
  npm run server web:stop       Stop Web server gracefully  
  npm run server web:restart    Restart Web server
  npm run server web:status     Check Web server status & health

UNIFIED COMMANDS (Package.json compatibility):
  npm run server dev            Start full dev environment (same as dev:both)
  npm run server start          Start API server (same as api:start)
  npm run server stop           Stop all servers (dev + production)
  npm run server restart        Restart all servers
  npm run server status         Check status of all servers

FEATURES:
  ✨ Automatic port cleanup prevents "EADDRINUSE" errors
  🛡️  Graceful shutdown with proper signal handling
  🔄 PID file tracking for production servers
  🏥 Health check endpoints for monitoring
  🖥️  Cross-platform support (Windows/Unix)
  📊 Detailed status reporting with uptime
  ⚡ Development servers auto-restart/reload on file changes

PORTS & URLS:
  📡 API Server:     http://localhost:8000  (Health: /health)
  🌐 Web Server:     http://localhost:5174  (Health: /)

DEVELOPMENT WORKFLOW:
  npm run server dev:both       # Start full dev environment
  npm run server dev:status     # Check what's running
  npm run server dev:restart    # Clean restart everything

PRODUCTION WORKFLOW:
  npm run server api:start      # Start API for production
  npm run server web:start      # Start Web for production  
  npm run server status         # Check all server health
  npm run server stop           # Stop everything

PID FILES:
  .voila-api.pid    API server process tracking
  .voila-web.pid    Web server process tracking
`);
}

main();