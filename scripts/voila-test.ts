#!/usr/bin/env tsx

/**
 * Voila Test Script - Unified testing interface
 * Usage: npx tsx scripts/voila-test.ts [command] [target] [-- options]
 * Examples:
 *   npx tsx scripts/voila-test.ts app:api greeting                    # Run all tests (default)
 *   npx tsx scripts/voila-test.ts app:api greeting -- --unittest     # Unit tests only
 *   npx tsx scripts/voila-test.ts app:api greeting -- --apitest      # API tests only
 *   npx tsx scripts/voila-test.ts app:api greeting -- --compliance   # Compliance only
 *   npx tsx scripts/voila-test.ts app:api greeting/hello -- --unittest # Feature unit tests
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TestResult {
  type: string;
  success: boolean;
  output: string;
  error?: string;
}

interface TestOptions {
  unittest?: boolean;
  apitest?: boolean;
  compliance?: boolean;
}

interface ComplianceStatus {
  api_compliance: {
    last_test_run: string;
    total_tests: number;
    passed_tests: number;
    failed_tests: number;
    success_rate: string;
    overall_status: 'COMPLIANT' | 'NON_COMPLIANT';
    requirements_met: boolean;
    test_results_file: string;
    updated_at: string;
  };
}

interface ApiTestCase {
  id: string;
  description: string;
  method: string;
  path: string;
  requestBody: string;
  expectedStatus: number;
  expectedResponse: string;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    showHelp();
    return;
  }

  const command = args[0];
  const target = args[1];
  const options = parseTestOptions(args.slice(2));
  
  console.log('🧪 Voila Test Suite');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const [prefix, action] = command.includes(':') ? command.split(':') : [command, ''];
    
    if (prefix === 'app' && action === 'api') {
      if (!target) {
        throw new Error('App name or app/feature is required for testing');
      }
      await runAppApiTests(target, options);
    } else {
      console.log(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
    }
  } catch (error: any) {
    console.error('💥 Test error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function runAppApiTests(target: string, options: TestOptions): Promise<void> {
  const isFeatureTest = target.includes('/');
  const [appName, featureName] = isFeatureTest ? target.split('/') : [target, undefined];
  
  console.log(`🎯 Running tests for ${isFeatureTest ? `${appName}/${featureName}` : appName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const results: TestResult[] = [];
  let allPassed = true;
  
  // Determine what to run based on flags
  const hasFlags = options.unittest || options.apitest || options.compliance;
  const runUnit = !hasFlags || options.unittest;
  const runApi = !hasFlags || options.apitest;
  const runCompliance = !hasFlags || options.compliance;
  
  try {
    // 1. Unit Tests
    if (runUnit) {
      console.log('\n📍 Step 1: Unit Tests');
      const unitResult = isFeatureTest 
        ? await runFeatureUnitTests(appName, featureName!) 
        : await runUnitTests(appName);
      results.push(unitResult);
      if (!unitResult.success) allPassed = false;
    }
    
    // 2. API Tests (only for apps, not individual features)
    if (runApi && !isFeatureTest) {
      console.log('\n📍 Step 2: API Integration Tests');
      const apiResult = await runApiTests(appName);
      results.push(apiResult);
      if (!apiResult.success) allPassed = false;
    } else if (runApi && isFeatureTest) {
      console.log('\n⚠️  Skipping API tests (not applicable for individual features)');
    }
    
    // 3. Compliance Check (only for apps, not individual features)
    if (runCompliance && !isFeatureTest) {
      console.log('\n📍 Step 3: Compliance Check');
      const complianceResult = await runComplianceCheck(appName);
      results.push(complianceResult);
      if (!complianceResult.success) allPassed = false;
    } else if (runCompliance && isFeatureTest) {
      console.log('\n⚠️  Skipping compliance check (not applicable for individual features)');
    }
    
  } catch (error: any) {
    console.error(`💥 Error in test pipeline: ${error.message}`);
    allPassed = false;
  }
  
  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Test Pipeline Summary:');
  
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`   ${index + 1}. ${result.type}: ${status}`);
  });
  
  const passedCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n🎯 Overall Result: ${passedCount}/${totalCount} test suites passed`);
  
  if (allPassed) {
    console.log('✅ All tests passed successfully!');
  } else {
    console.log('❌ Some tests failed. Review the output above.');
    process.exit(1);
  }
}

async function runUnitTests(appName?: string, options: string[] = []): Promise<TestResult> {
  console.log(`🔬 Running unit tests${appName ? ` for ${appName}` : ''}`);
  
  const vitestArgs = ['vitest', 'run'];
  
  // Add app-specific filter if provided
  if (appName) {
    vitestArgs.push('--config', 'vitest.config.ts');
    // Use pattern matching to run tests for specific app
    vitestArgs.push(`src/api/${appName}`);
  }
  
  // Add any additional options
  vitestArgs.push(...options);
  
  return executeCommand('npx', vitestArgs, 'Unit Tests');
}

async function runFeatureUnitTests(appName: string, featureName: string): Promise<TestResult> {
  console.log(`🔬 Running unit tests for ${appName}/${featureName}`);
  
  const vitestArgs = ['vitest', 'run'];
  
  // Target specific feature test file
  vitestArgs.push(`src/api/${appName}/features/${featureName}/${featureName}.test.ts`);
  
  return executeCommand('npx', vitestArgs, 'Feature Unit Tests');
}

async function runComplianceCheck(appName: string): Promise<TestResult> {
  console.log(`📊 Running compliance check for ${appName}`);
  
  try {
    const apitestDir = join(__dirname, '..', 'src', 'api', appName, '__apitest__');
    const configPath = join(__dirname, '..', 'src', 'api', appName, `${appName}.config.json`);
    
    if (!existsSync(apitestDir)) {
      throw new Error(`API test directory not found: ${apitestDir}. Run API tests first.`);
    }

    if (!existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    // Find latest results file
    const resultsFiles = readdirSync(apitestDir)
      .filter(file => file.startsWith(`${appName}.testresults-`) && file.endsWith('.xlsx'))
      .sort()
      .reverse(); // Most recent first

    if (resultsFiles.length === 0) {
      throw new Error(`No test results found in ${apitestDir}. Run API tests first.`);
    }

    const latestResultsFile = resultsFiles[0];
    const resultsFilePath = join(apitestDir, latestResultsFile);
    
    console.log(`📋 Reading latest results: ${latestResultsFile}`);

    // Read Excel results file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(resultsFilePath);
    
    const resultsSheet = workbook.getWorksheet('Test Results');
    const summarySheet = workbook.getWorksheet('Summary');
    
    if (!resultsSheet || !summarySheet) {
      throw new Error('Required sheets not found in results file. Please regenerate test results.');
    }

    // Extract summary data from Summary sheet
    let summaryData: any = {};
    if (summarySheet.rowCount >= 2) {
      const summaryRow = summarySheet.getRow(2); // First data row after header
      summaryData = {
        testRun: summaryRow.getCell('A').value,
        timestamp: summaryRow.getCell('B').value,
        total: summaryRow.getCell('C').value as number,
        passed: summaryRow.getCell('D').value as number,
        failed: summaryRow.getCell('E').value as number,
        successRate: summaryRow.getCell('F').value as string,
        status: summaryRow.getCell('G').value as string
      };
    }

    // Determine compliance status
    const requirementsMet = summaryData.failed === 0 && summaryData.total > 0;
    const overallStatus = requirementsMet ? 'COMPLIANT' : 'NON_COMPLIANT';
    
    // Read current config
    const configContent = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    
    // Create compliance section
    const complianceStatus: ComplianceStatus['api_compliance'] = {
      last_test_run: summaryData.timestamp || new Date().toISOString(),
      total_tests: summaryData.total || 0,
      passed_tests: summaryData.passed || 0,
      failed_tests: summaryData.failed || 0,
      success_rate: summaryData.successRate || '0%',
      overall_status: overallStatus,
      requirements_met: requirementsMet,
      test_results_file: latestResultsFile,
      updated_at: new Date().toISOString()
    };

    // Update config with compliance section
    config.api_compliance = complianceStatus;
    
    // Write updated config
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Compliance Summary for ${appName}:`);
    console.log(`   📋 Total Tests: ${summaryData.total || 0}`);
    console.log(`   ✅ Passed: ${summaryData.passed || 0}`);
    console.log(`   ❌ Failed: ${summaryData.failed || 0}`);
    console.log(`   📈 Success Rate: ${summaryData.successRate || '0%'}`);
    console.log(`   🎯 Requirements Met: ${requirementsMet ? 'YES' : 'NO'}`);
    console.log(`   📊 Overall Status: ${overallStatus}`);
    console.log(`   📄 Results File: ${latestResultsFile}`);
    console.log(`   📝 Config Updated: ${configPath}`);
    
    if (!requirementsMet) {
      console.log(`\n⚠️  NON-COMPLIANT: Review failed tests and fix issues`);
      return {
        type: 'Compliance Check',
        success: false,
        output: `NON-COMPLIANT: ${summaryData.failed || 0} tests failed`,
        error: 'Some API requirements not met'
      };
    } else {
      console.log(`\n✅ COMPLIANT: All API requirements met successfully`);
      return {
        type: 'Compliance Check',
        success: true,
        output: `COMPLIANT: All ${summaryData.total || 0} tests passed`,
      };
    }
    
  } catch (error: any) {
    return {
      type: 'Compliance Check',
      success: false,
      output: '',
      error: error.message
    };
  }
}

async function runApiTests(appName: string, options: string[] = []): Promise<TestResult> {
  if (!appName) {
    throw new Error('App name is required for API tests');
  }
  
  console.log(`🚀 Running API tests for ${appName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Step 1: Stop any existing servers to ensure clean restart
  console.log('🛑 Step 1: Stopping any existing API servers...');
  try {
    await executeCommand('npm', ['run', 'server', 'api:stop'], 'Server Stop');
    console.log('✅ Server stop completed');
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.log('ℹ️  No servers to stop');
  }
  
  // Step 2: Check if server is running, if not guide user to start it
  console.log('\n🔍 Step 2: Checking for API server...');
  const serverRunning = await waitForServer('http://localhost:3001/health', 5000);
  
  if (!serverRunning) {
    console.log('\n📌 API server not detected. Please start it now:');
    console.log('   npm run server api:start     (manual start)');
    console.log('   npm run dev:api              (with auto-restart)');
    console.log('\n💡 This will pick up any newly generated apps/features');
    
    console.log('\n⏳ Waiting for server to start at http://localhost:3001...');
    const serverReady = await waitForServer('http://localhost:3001/health', 60000);
    if (!serverReady) {
      return {
        type: 'API Tests',
        success: false,
        output: '',
        error: 'Server not detected within 60 seconds. Please ensure server is running on port 3001.'
      };
    }
  }
  
  console.log('✅ Server is ready and responding!');
  
  // Step 3: Run Excel-based API tests
  console.log('\n🧪 Step 3: Running Excel-based API tests...');
  
  try {
    const result = await runExcelBasedApiTests(appName);
    return {
      type: 'API Tests',
      success: result.success,
      output: result.output,
      error: result.error
    };
  } catch (error: any) {
    return {
      type: 'API Tests',
      success: false,
      output: '',
      error: error.message
    };
  }
}

async function runExcelBasedApiTests(appName: string): Promise<{success: boolean, output: string, error?: string}> {
  const apitestDir = join(__dirname, '..', 'src', 'api', appName, '__apitest__');
  
  if (!existsSync(apitestDir)) {
    throw new Error(`API test directory not found: ${apitestDir}. Generate testcases first: npm run generate app:api ${appName} -- --testcases`);
  }

  // Find the latest testcases file
  const testcaseFiles = readdirSync(apitestDir)
    .filter(file => file.startsWith(`${appName}.testcases-`) && file.endsWith('.xlsx'))
    .sort()
    .reverse();

  if (testcaseFiles.length === 0) {
    throw new Error(`No testcases file found. Generate testcases first: npm run generate app:api ${appName} -- --testcases`);
  }

  const filename = testcaseFiles[0]; // Use the latest
  const excelPath = join(apitestDir, filename);
  
  console.log(`📖 Loading test cases from: ${filename}`);
  
  // Read Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);
  
  const testCasesSheet = workbook.getWorksheet('Test Cases');
  
  if (!testCasesSheet) {
    throw new Error('Test Cases sheet not found in Excel file.');
  }
  
  // Try to detect active server automatically
  const possiblePorts = [3001, 3002, 3003, 4001, 4002, 6000, 7000, 8000];
  let baseUrl = '';
  
  console.log(`🔍 Detecting active Voila server...`);
  
  for (const port of possiblePorts) {
    const testUrl = `http://localhost:${port}`;
    try {
      const healthResponse = await fetch(`${testUrl}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      
      if (healthResponse.ok) {
        baseUrl = testUrl;
        console.log(`✅ Found active server at: ${baseUrl}`);
        break;
      }
    } catch (error) {
      // Server not available on this port, continue
      continue;
    }
  }
  
  if (!baseUrl) {
    throw new Error(`❌ No active Voila server found on any of these ports: ${possiblePorts.join(', ')}\n\n💡 Please start the server first:\n   npm run dev:api\n\nOr specify a custom port with PORT=XXXX npm run dev:api`);
  }
  
  console.log(`🚀 Testing against: ${baseUrl}`);
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  const runTimestamp = new Date().toISOString();
  const testResults: any[] = []; // Store results for timestamped file
  
  // Process each test case row from Test Cases sheet (skip header)
  if (testCasesSheet) {
    for (let rowNumber = 2; rowNumber <= testCasesSheet.rowCount; rowNumber++) {
      const row = testCasesSheet.getRow(rowNumber);
      
      // Skip empty rows
      if (!row.getCell('A').value) continue;
      
      totalTests++;
      const testCase: ApiTestCase = {
        id: row.getCell('A').value as string,
        description: row.getCell('B').value as string,
        method: row.getCell('C').value as string,
        path: row.getCell('D').value as string,
        requestBody: row.getCell('E').value as string,
        expectedStatus: Number(row.getCell('F').value) || 200,
        expectedResponse: row.getCell('G').value as string
      };

      console.log(`[${totalTests}] ${testCase.id}: ${testCase.description}`);
      
      try {
        const result = await executeApiTestCase(baseUrl, testCase);
        
        // Store result data for timestamped file
        const resultData = {
          runTimestamp: runTimestamp,
          id: testCase.id,
          description: testCase.description,
          method: testCase.method,
          path: testCase.path,
          expectedStatus: testCase.expectedStatus,
          actualStatus: result.response.status,
          expectedResponse: testCase.expectedResponse,
          actualResponse: JSON.stringify(result.response.body),
          result: result.passed ? 'PASS' : 'FAIL',
          errorDetails: result.error || '',
          fill: result.passed ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF92D050' } } : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF6B6B' } }
        };
        testResults.push(resultData);
        
        // Update counters
        if (result.passed) {
          passedTests++;
          console.log(`   ✅ PASSED`);
        } else {
          failedTests++;
          console.log(`   ❌ FAILED: ${result.error}`);
        }
        
      } catch (error: any) {
        // Store error data for timestamped file
        const errorData = {
          runTimestamp: runTimestamp,
          id: testCase.id,
          description: testCase.description,
          method: testCase.method,
          path: testCase.path,
          expectedStatus: testCase.expectedStatus,
          actualStatus: 'ERROR',
          expectedResponse: testCase.expectedResponse,
          actualResponse: '',
          result: 'ERROR',
          errorDetails: error.message,
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF6B6B' } }
        };
        testResults.push(errorData);
        
        // Update counters
        failedTests++;
        console.log(`   💥 ERROR: ${error.message}`);
      }
      
      console.log(''); // Empty line between tests
    }
  }

  // Calculate summary data
  const successRate = totalTests > 0 ? Math.round((passedTests/totalTests)*100) : 0;
  const status = failedTests === 0 ? 'PASS' : 'FAIL';
  
  // Create results file with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const resultsPath = join(apitestDir, `${appName}.testresults-${timestamp}.xlsx`);
  await writeApiTestResults(resultsPath, testResults, {
    totalTests,
    passedTests,
    failedTests,
    successRate,
    status
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 API Test Summary:`);
  console.log(`   📋 Total Tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   📈 Success Rate: ${successRate}%`);
  console.log(`   📄 Results File: ${appName}.testresults-${timestamp}.xlsx`);
  
  if (failedTests > 0) {
    console.log(`\n❌ ${failedTests} test(s) failed. Review the results file for details.`);
    return {
      success: false,
      output: `API Tests: ${passedTests}/${totalTests} passed (${successRate}%)`,
      error: `${failedTests} test(s) failed`
    };
  } else {
    console.log(`\n✅ All tests passed successfully!`);
    return {
      success: true,
      output: `API Tests: ${passedTests}/${totalTests} passed (${successRate}%)`
    };
  }
}

async function executeApiTestCase(baseUrl: string, testCase: ApiTestCase): Promise<{passed: boolean, response: any, error?: string}> {
  try {
    const url = `${baseUrl}${testCase.path}`;
    
    const options: RequestInit = {
      method: testCase.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (testCase.requestBody && testCase.requestBody.trim() !== '') {
      options.body = testCase.requestBody;
    }
    
    const response = await fetch(url, options);
    const responseBody = await response.json();
    
    // Check status code
    if (response.status !== testCase.expectedStatus) {
      return {
        passed: false,
        response: { status: response.status, body: responseBody },
        error: `Expected status ${testCase.expectedStatus}, got ${response.status}`
      };
    }
    
    // Basic validation - more sophisticated checks can be added
    return {
      passed: true,
      response: { status: response.status, body: responseBody }
    };
    
  } catch (error: any) {
    return {
      passed: false,
      response: { status: 'ERROR', body: {} },
      error: error.message
    };
  }
}

async function writeApiTestResults(filePath: string, results: any[], summary: any): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  
  // Test Results sheet
  const resultsSheet = workbook.addWorksheet('Test Results');
  resultsSheet.addRow([
    'Run Timestamp', 'Test ID', 'Description', 'Method', 'Path', 
    'Expected Status', 'Actual Status', 'Expected Response', 'Actual Response', 
    'Result', 'Error Details'
  ]);
  
  results.forEach(result => {
    const row = resultsSheet.addRow([
      result.runTimestamp, result.id, result.description, result.method, result.path,
      result.expectedStatus, result.actualStatus, result.expectedResponse, result.actualResponse,
      result.result, result.errorDetails
    ]);
    
    // Apply color formatting
    if (result.fill) {
      row.eachCell(cell => {
        cell.fill = result.fill;
      });
    }
  });
  
  // Summary sheet
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.addRow(['Test Run', 'Timestamp', 'Total Tests', 'Passed', 'Failed', 'Success Rate', 'Status']);
  summarySheet.addRow([
    `${results[0]?.id || 'API'} Tests`,
    results[0]?.runTimestamp || new Date().toISOString(),
    summary.totalTests,
    summary.passedTests,
    summary.failedTests,
    `${summary.successRate}%`,
    summary.status
  ]);
  
  // Format headers
  [resultsSheet, summarySheet].forEach(sheet => {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
  });
  
  await workbook.xlsx.writeFile(filePath);
}

function parseTestOptions(args: string[]): TestOptions {
  const options: TestOptions = {};
  
  for (const arg of args) {
    switch (arg) {
      case '--unittest':
        options.unittest = true;
        break;
      case '--apitest':
        options.apitest = true;
        break;
      case '--compliance':
        options.compliance = true;
        break;
    }
  }
  
  return options;
}

async function executeCommand(command: string, args: string[], testType: string): Promise<TestResult> {
  return new Promise((resolve) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname + '/..'
    });

    let output = '';
    let error = '';

    process.on('close', (code) => {
      const success = code === 0;
      resolve({
        type: testType,
        success,
        output,
        error: success ? undefined : `Process exited with code ${code}`
      });
    });

    process.on('error', (err) => {
      resolve({
        type: testType,
        success: false,
        output,
        error: err.message
      });
    });
  });
}

async function waitForServer(url: string, timeoutMs: number): Promise<boolean> {
  const startTime = Date.now();
  const checkInterval = 1000; // Check every 1 second

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch {
      // Server not ready yet, continue waiting
    }
    
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }
  
  return false;
}

function showHelp() {
  console.log(`
🧪 Voila Test Suite - Unified Testing Interface

USAGE:
  npm run test app:api <target> [-- options]

COMMANDS:
  app:api <app-name>               Test entire app (all test types)
  app:api <app-name>/<feature>     Test specific feature

TEST TYPE FLAGS:
  --unittest                       Run unit tests only
  --apitest                        Run API integration tests only
  --compliance                     Run compliance checks only
  (no flags)                       Run all test types (unit + api + compliance)

EXAMPLES:
  npm run test app:api greeting                        # Run all tests for greeting app
  npm run test app:api greeting -- --unittest          # Unit tests only for greeting
  npm run test app:api greeting -- --apitest           # API tests only for greeting
  npm run test app:api greeting -- --compliance        # Compliance check only for greeting
  npm run test app:api greeting/hello -- --unittest    # Unit tests for hello feature only

FEATURE-SPECIFIC TESTING:
  - Unit tests: Available for individual features
  - API tests: Only available at app level (not feature level)
  - Compliance: Only available at app level (not feature level)

FULL PIPELINE (no flags):
  1. 🔬 Unit Tests (Vitest) - all features in app
  2. 🚀 API Integration Tests (auto-restarts server, Excel-based)
  3. 🔍 Compliance Check (requirements verification)

TESTCASE GENERATION (separate command):
  npm run generate app:api <app> -- --testcases    # Generate API testcases from specs

API TEST WORKFLOW (--apitest):
  1. 🛑 Stop existing servers (clean restart)
  2. ⏳ Wait for fresh server startup (picks up new apps)
  3. 🧪 Run API tests once server is ready

REQUIREMENTS:
  - Unit tests: src/api/{app}/**/*.test.ts
  - API specs: src/api/{app}/spec/{app}.api.spec.yml  
  - Running server: npm run dev:api (for API tests)
`);
}

main();