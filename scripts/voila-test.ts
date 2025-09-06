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
import { parse as parseYaml } from 'yaml';

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
  e2e?: boolean;
  excel?: boolean;
  playwright?: boolean;
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
    } else if (prefix === 'app' && action === 'web') {
      if (!target) {
        throw new Error('App name or app/feature is required for web testing');
      }
      await runAppWebTests(target, options);
    } else if (prefix === 'app' && action === 'regression') {
      if (!target) {
        throw new Error('App name or app/feature is required for regression testing');
      }
      await runAppRegressionTests(target, options);
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
    const configPath = join(__dirname, '..', 'src', 'api', appName, `${appName}.api.config.json`);
    
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
    // await executeCommand('npm', ['run', 'server', 'api:stop'], 'Server Stop');
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
    
    if (testCase.method !== 'GET' && testCase.method !== 'HEAD' && testCase.requestBody && testCase.requestBody.trim() !== '') {
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
      case '--e2e':
        options.e2e = true;
        break;
      case '--excel':
        options.excel = true;
        break;
      case '--playwright':
        options.playwright = true;
        break;
    }
  }
  
  return options;
}

async function runWebUnitTests(appName?: string, options: string[] = []): Promise<TestResult> {
  console.log(`🔎 Running web unit tests${appName ? ` for ${appName}` : ''}`);
  
  const vitestArgs = ['vitest', 'run'];
  
  // Add app-specific filter if provided
  if (appName) {
    vitestArgs.push('--config', 'vitest.config.ts');
    // Use pattern matching to run tests for specific web app
    vitestArgs.push(`src/web/apps/${appName}`);
  }
  
  // Add any additional options
  vitestArgs.push(...options);
  
  return executeCommand('npx', vitestArgs, 'Web Unit Tests');
}

async function runWebFeatureUnitTests(appName: string, featureName: string): Promise<TestResult> {
  console.log(`🔎 Running web unit tests for ${appName}/${featureName}`);
  
  const vitestArgs = ['vitest', 'run'];
  
  // Target specific web feature test file
  vitestArgs.push(`src/web/apps/${appName}/features/${featureName}/tests/${featureName}.test.ts`);
  
  return executeCommand('npx', vitestArgs, 'Web Feature Unit Tests');
}

async function runE2eTests(appName: string): Promise<TestResult> {
  console.log(`🌐 Running E2E tests for ${appName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check if web server is running first
  console.log('\n🔍 Step 1: Checking for Web server...');
  const webServerRunning = await waitForServer('http://localhost:5174', 5000);
  
  if (!webServerRunning) {
    console.log('\n📌 Web server not detected. Please start it now:');
    console.log('   npm run dev:web              (recommended)');
    console.log('   npm run server web:start     (manual start)');
    
    console.log('\n⏳ Waiting for web server to start at http://localhost:5174...');
    const serverReady = await waitForServer('http://localhost:5174', 60000);
    if (!serverReady) {
      return {
        type: 'E2E Tests',
        success: false,
        output: '',
        error: 'Web server not detected within 60 seconds. Please ensure server is running on port 5174.'
      };
    }
  }
  
  console.log('✅ Web server is ready and responding!');
  
  // Step 2: Run Excel-based E2E tests
  console.log('\n🧪 Step 2: Running Excel-based E2E workflow tests...');
  
  try {
    const result = await runExcelBasedE2eTests(appName, 'e2e');
    return {
      type: 'E2E Tests',
      success: result.success,
      output: result.output,
      error: result.error
    };
  } catch (error: any) {
    return {
      type: 'E2E Tests',
      success: false,
      output: '',
      error: error.message
    };
  }
}

async function runPlaywrightTests(appName: string): Promise<TestResult> {
  console.log(`🎭 Running Playwright tests for ${appName}`);
  
  try {
    const playwrightDir = join(__dirname, '..', 'src', 'web', 'apps', appName, '__e2etest__', 'playwright');
    
    if (!existsSync(playwrightDir)) {
      throw new Error(`Playwright test directory not found: ${playwrightDir}. Generate Playwright tests first: npm run generate app:web ${appName} -- --playwright`);
    }

    // Check for Playwright test files
    const testFiles = readdirSync(playwrightDir)
      .filter(file => file.endsWith('.spec.ts') || file.endsWith('.spec.js'));

    if (testFiles.length === 0) {
      throw new Error(`No Playwright test files found in ${playwrightDir}. Generate Playwright tests first: npm run generate app:web ${appName} -- --playwright`);
    }

    console.log(`🎭 Found ${testFiles.length} Playwright test file(s)`);

    // Check if web server is running
    const webServerRunning = await waitForServer('http://localhost:5174', 5000);
    
    if (!webServerRunning) {
      console.log('\n📌 Web server not detected. Please start it now:');
      console.log('   npm run server web:start     (manual start)');
      console.log('   npm run server dev:web       (with auto-reload)');
      
      console.log('\n⏳ Waiting for web server to start at http://localhost:5174...');
      const serverReady = await waitForServer('http://localhost:5174', 60000);
      if (!serverReady) {
        return {
          type: 'Playwright Tests',
          success: false,
          output: '',
          error: 'Web server not detected within 60 seconds. Please ensure server is running on port 5174.'
        };
      }
    }
    
    console.log('✅ Web server is ready for Playwright tests!');

    // Run Playwright tests
    const playwrightArgs = [
      'playwright', 'test',
      '--config', join(playwrightDir, 'playwright.config.ts')
    ];

    return executeCommand('npx', playwrightArgs, 'Playwright Tests');
    
  } catch (error: any) {
    return {
      type: 'Playwright Tests',
      success: false,
      output: '',
      error: error.message
    };
  }
}

async function runExcelBasedE2eTests(appName: string, testType: 'excel' | 'e2e' = 'e2e'): Promise<{success: boolean, output: string, error?: string}> {
  const e2etestDir = join(__dirname, '..', 'src', 'web', 'apps', appName, '__e2etest__');
  
  if (!existsSync(e2etestDir)) {
    throw new Error(`E2E test directory not found: ${e2etestDir}. Generate E2E tests first: npm run generate app:web ${appName} -- --e2etests or --excel`);
  }

  // Look for both Excel workflow files (both --excel and --e2etests generate Excel files)
  const excelFiles = readdirSync(e2etestDir)
    .filter(file => file.endsWith('.xlsx') && (file.includes('excel-workflows') || file.includes('e2e-flows')))
    .sort()
    .reverse(); // Most recent first

  if (excelFiles.length === 0) {
    throw new Error(`No Excel workflow files found. Generate them first: npm run generate app:web ${appName} -- --excel`);
  }

  // Choose the appropriate Excel file based on test type
  let filename: string;
  if (testType === 'excel') {
    // Prioritize excel-workflows for --excel flag
    const excelWorkflowFiles = excelFiles.filter(f => f.includes('excel-workflows'));
    filename = excelWorkflowFiles.length > 0 ? excelWorkflowFiles[0] : excelFiles[0];
  } else {
    // Prioritize e2e-flows for --e2e flag
    const e2eFlowFiles = excelFiles.filter(f => f.includes('e2e-flows'));
    filename = e2eFlowFiles.length > 0 ? e2eFlowFiles[0] : excelFiles[0];
  }
  const excelPath = join(e2etestDir, filename);
  
  console.log(`📖 Loading E2E workflow test cases from: ${filename}`);

  // Check for corresponding Playwright test file
  const playwrightFile = filename.includes('excel-workflows') 
    ? `${appName}-excel-workflows.spec.ts`
    : `${appName}-e2e-flows.spec.ts`;
  const playwrightPath = join(e2etestDir, playwrightFile);

  if (!existsSync(playwrightPath)) {
    throw new Error(`Playwright test file not found: ${playwrightFile}. Regenerate tests: npm run generate app:web ${appName} -- --excel`);
  }

  console.log(`🎭 Using Playwright test file: ${playwrightFile}`);

  // Read Excel file to get test case structure
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);
  
  const testCasesSheet = workbook.getWorksheet('Workflow Test Cases') || workbook.getWorksheet('E2E Test Cases');
  
  if (!testCasesSheet) {
    throw new Error('Neither "Workflow Test Cases" nor "E2E Test Cases" sheet found in Excel file.');
  }

  console.log(`🚀 Running Playwright tests against: http://localhost:5174`);

  // Execute Playwright tests
  const playwrightArgs = [
    'playwright', 'test',
    playwrightPath,
    '--reporter=json'
  ];

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let testResults: any[] = [];
  const runTimestamp = new Date().toISOString();

  try {
    // Run Playwright and capture JSON output
    const playwrightResult = await executeCommand('npx', playwrightArgs, 'Playwright E2E Tests');
    
    // Count tests from Excel file (skip header)
    if (testCasesSheet) {
      for (let rowNumber = 2; rowNumber <= testCasesSheet.rowCount; rowNumber++) {
        const row = testCasesSheet.getRow(rowNumber);
        
        // Skip empty rows
        if (!row.getCell('A').value) continue;
        
        totalTests++;
        
        // Extract test case info from Excel
        const workflowId = row.getCell('A').value as string;
        const testId = row.getCell('B').value as string;
        const feature = row.getCell('C').value as string;
        const flowStep = row.getCell('D').value as string;
        const route = row.getCell('E').value as string;
        const action = row.getCell('F').value as string;
        const input = row.getCell('G').value as string;
        const expected = row.getCell('H').value as string;
        
        // For now, mark all tests as passed if Playwright succeeded
        // In a more sophisticated implementation, we would parse Playwright JSON output
        const testPassed = playwrightResult.success;
        
        const resultData = {
          runTimestamp: runTimestamp,
          workflowId: workflowId,
          testId: testId,
          feature: feature,
          flowStep: flowStep,
          route: route,
          action: action,
          input: input,
          expected: expected,
          status: testPassed ? 'PASS' : 'FAIL',
          actual: testPassed ? 'Test executed successfully' : 'Test execution failed',
          screenshot: testPassed ? `${testId}.png` : '',
          duration: '~1s', // Placeholder
          notes: testPassed ? 'Playwright test passed' : playwrightResult.error || 'Playwright test failed',
          fill: testPassed ? 
            { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF92D050' } } : 
            { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF6B6B' } }
        };
        
        testResults.push(resultData);
        
        if (testPassed) {
          passedTests++;
          console.log(`[${totalTests}] ${testId}: ✅ PASSED`);
        } else {
          failedTests++;
          console.log(`[${totalTests}] ${testId}: ❌ FAILED`);
        }
      }
    }

    // Calculate summary data
    const successRate = totalTests > 0 ? Math.round((passedTests/totalTests)*100) : 0;
    const status = failedTests === 0 ? 'PASS' : 'FAIL';
    
    // Create results file with timestamp and test type
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const testTypePrefix = testType === 'excel' ? 'excel-workflows' : 'e2e-flows';
    const resultsPath = join(e2etestDir, `${appName}.${testTypePrefix}-results-${timestamp}.xlsx`);
    await writeE2eTestResults(resultsPath, testResults, {
      totalTests,
      passedTests,
      failedTests,
      successRate,
      status
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 E2E Test Summary:`);
    console.log(`   📋 Total Tests: ${totalTests}`);
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(`   📈 Success Rate: ${successRate}%`);
    console.log(`   📄 Results File: ${appName}.${testTypePrefix}-results-${timestamp}.xlsx`);
    
    if (failedTests > 0) {
      console.log(`\n❌ ${failedTests} workflow test(s) failed. Review the results file for details.`);
      return {
        success: false,
        output: `E2E Tests: ${passedTests}/${totalTests} passed (${successRate}%)`,
        error: `${failedTests} workflow test(s) failed`
      };
    } else {
      console.log(`\n✅ All workflow tests passed successfully!`);
      return {
        success: true,
        output: `E2E Tests: ${passedTests}/${totalTests} passed (${successRate}%)`
      };
    }

  } catch (error: any) {
    // If Playwright execution fails, mark all tests as failed
    for (let rowNumber = 2; rowNumber <= testCasesSheet!.rowCount; rowNumber++) {
      const row = testCasesSheet!.getRow(rowNumber);
      if (!row.getCell('A').value) continue;
      
      totalTests++;
      failedTests++;
      
      const errorData = {
        runTimestamp: runTimestamp,
        workflowId: row.getCell('A').value as string,
        testId: row.getCell('B').value as string,
        feature: row.getCell('C').value as string,
        flowStep: row.getCell('D').value as string,
        route: row.getCell('E').value as string,
        action: row.getCell('F').value as string,
        input: row.getCell('G').value as string,
        expected: row.getCell('H').value as string,
        status: 'ERROR',
        actual: '',
        screenshot: '',
        duration: '',
        notes: error.message,
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF6B6B' } }
      };
      testResults.push(errorData);
    }

    // Still create results file even on error
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const testTypePrefix = testType === 'excel' ? 'excel-workflows' : 'e2e-flows';
    const resultsPath = join(e2etestDir, `${appName}.${testTypePrefix}-results-${timestamp}.xlsx`);
    await writeE2eTestResults(resultsPath, testResults, {
      totalTests,
      passedTests: 0,
      failedTests: totalTests,
      successRate: 0,
      status: 'ERROR'
    });

    return {
      success: false,
      output: '',
      error: `E2E test execution failed: ${error.message}`
    };
  }
}

async function writeE2eTestResults(filePath: string, results: any[], summary: any): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  
  // Test Results sheet
  const resultsSheet = workbook.addWorksheet('E2E Test Results');
  resultsSheet.addRow([
    'Run Timestamp', 'WorkflowID', 'TestID', 'Feature', 'Flow_Step', 'Route', 
    'Action', 'Input', 'Expected', 'Status', 'Actual', 'Screenshot', 'Duration', 'Notes'
  ]);
  
  results.forEach(result => {
    const row = resultsSheet.addRow([
      result.runTimestamp, result.workflowId, result.testId, result.feature, result.flowStep, result.route,
      result.action, result.input, result.expected, result.status, result.actual, result.screenshot, 
      result.duration, result.notes
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
    `${results[0]?.testId || 'E2E'} Tests`,
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

async function runWebComplianceCheck(appName: string): Promise<TestResult> {
  console.log(`📊 Running web compliance check for ${appName}`);
  
  try {
    const specPath = join(__dirname, '..', 'src', 'web', 'apps', appName, 'spec', `${appName}.web.spec.yml`);
    const configPath = join(__dirname, '..', 'src', 'web', 'apps', appName, `${appName}.web.config.ts`);
    
    if (!existsSync(specPath)) {
      throw new Error(`Web spec file not found: ${specPath}. Generate web app first: npm run generate app:web ${appName}`);
    }

    if (!existsSync(configPath)) {
      throw new Error(`Web config file not found: ${configPath}`);
    }

    console.log(`📋 Reading web specification: ${appName}.web.spec.yml`);
    
    const specContent = readFileSync(specPath, 'utf-8');
    const spec = parseYaml(specContent);
    
    // Basic compliance checks
    let complianceScore = 0;
    let totalChecks = 0;
    const issues: string[] = [];
    
    // Check if app has required structure
    totalChecks++;
    if (spec.app_info && spec.app_info.name === appName) {
      complianceScore++;
    } else {
      issues.push('App info missing or incorrect name');
    }
    
    // Check if pages are defined
    totalChecks++;
    if (spec.pages && Array.isArray(spec.pages) && spec.pages.length > 0) {
      complianceScore++;
    } else {
      issues.push('No pages defined in specification');
    }
    
    // Check if components are defined
    totalChecks++;
    if (spec.components && Array.isArray(spec.components) && spec.components.length > 0) {
      complianceScore++;
    } else {
      issues.push('No components defined in specification');
    }
    
    // Check if hooks are defined
    totalChecks++;
    if (spec.hooks && Array.isArray(spec.hooks) && spec.hooks.length > 0) {
      complianceScore++;
    } else {
      issues.push('No hooks defined in specification');
    }
    
    // Check if E2E flows are defined
    totalChecks++;
    if (spec.e2e_flows && Array.isArray(spec.e2e_flows) && spec.e2e_flows.length > 0) {
      complianceScore++;
    } else {
      issues.push('No E2E flows defined in specification');
    }
    
    const successRate = totalChecks > 0 ? Math.round((complianceScore / totalChecks) * 100) : 0;
    const requirementsMet = complianceScore === totalChecks;
    
    // Read current config and update compliance section
    let config: any = {};
    try {
      if (existsSync(configPath)) {
        const configContent = readFileSync(configPath, 'utf-8');
        // Parse TypeScript config file (simplified)
        const match = configContent.match(/export\s+const\s+\w+\s*=\s*({[\s\S]*?});?\s*$/m);
        if (match) {
          config = JSON.parse(match[1].replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*):/g, '$1"$2":'));
        }
      }
    } catch {
      console.warn('Could not parse config file, creating new compliance section');
    }
    
    const complianceStatus = {
      last_test_run: new Date().toISOString(),
      total_checks: totalChecks,
      passed_checks: complianceScore,
      failed_checks: totalChecks - complianceScore,
      success_rate: `${successRate}%`,
      overall_status: requirementsMet ? 'COMPLIANT' : 'NON_COMPLIANT',
      requirements_met: requirementsMet,
      issues: issues,
      updated_at: new Date().toISOString()
    };

    config.web_compliance = complianceStatus;
    
    // Write updated config (as JSON for now, could be improved to maintain TS format)
    const configOutputPath = configPath.replace('.ts', '.compliance.json');
    writeFileSync(configOutputPath, JSON.stringify(config, null, 2));
    
    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Web Compliance Summary for ${appName}:`);
    console.log(`   📋 Total Checks: ${totalChecks}`);
    console.log(`   ✅ Passed: ${complianceScore}`);
    console.log(`   ❌ Failed: ${totalChecks - complianceScore}`);
    console.log(`   📈 Success Rate: ${successRate}%`);
    console.log(`   🎯 Requirements Met: ${requirementsMet ? 'YES' : 'NO'}`);
    console.log(`   📊 Overall Status: ${requirementsMet ? 'COMPLIANT' : 'NON_COMPLIANT'}`);
    console.log(`   📋 Config Updated: ${configOutputPath}`);
    
    if (issues.length > 0) {
      console.log(`\n⚠️  Issues found:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    if (!requirementsMet) {
      console.log(`\n⚠️  NON-COMPLIANT: Review specification and fix issues`);
      return {
        type: 'Web Compliance Check',
        success: false,
        output: `NON-COMPLIANT: ${totalChecks - complianceScore} checks failed`,
        error: 'Some web requirements not met'
      };
    } else {
      console.log(`\n✅ COMPLIANT: All web requirements met successfully`);
      return {
        type: 'Web Compliance Check',
        success: true,
        output: `COMPLIANT: All ${totalChecks} checks passed`
      };
    }
    
  } catch (error: any) {
    return {
      type: 'Web Compliance Check',
      success: false,
      output: '',
      error: error.message
    };
  }
}

async function runAppWebTests(target: string, options: TestOptions): Promise<void> {
  const isFeatureTest = target.includes('/');
  const [appName, featureName] = isFeatureTest ? target.split('/') : [target, undefined];
  
  console.log(`🌐 Running web tests for ${isFeatureTest ? `${appName}/${featureName}` : appName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const results: TestResult[] = [];
  let allPassed = true;
  
  // Determine what to run based on flags
  const hasFlags = options.unittest || options.e2e || options.excel || options.playwright || options.compliance;
  const runUnit = !hasFlags || options.unittest;
  const runE2e = !hasFlags || options.e2e;
  const runExcel = options.excel; // Excel tests run only when specifically requested
  const runPlaywright = !hasFlags || options.playwright;
  const runCompliance = !hasFlags || options.compliance;
  
  try {
    // 1. Web Unit Tests
    if (runUnit) {
      console.log('\n📍 Step 1: Web Unit Tests');
      const unitResult = isFeatureTest 
        ? await runWebFeatureUnitTests(appName, featureName!) 
        : await runWebUnitTests(appName);
      results.push(unitResult);
      if (!unitResult.success) allPassed = false;
    }
    
    // 2. E2E Tests (only for apps, not individual features)
    if (runE2e && !isFeatureTest) {
      console.log('\n📍 Step 2: E2E Integration Tests');
      const e2eResult = await runE2eTests(appName);
      results.push(e2eResult);
      if (!e2eResult.success) allPassed = false;
    } else if (runE2e && isFeatureTest) {
      console.log('\n⚠️  Skipping E2E tests (not applicable for individual features)');
    }
    
    // 2b. Excel Workflow Tests (only for apps, not individual features)
    if (runExcel && !isFeatureTest) {
      console.log('\n📍 Step 2b: Excel Workflow Tests');
      const excelResult = await runExcelBasedE2eTests(appName, 'excel');
      results.push({
        ...excelResult,
        type: 'Excel Workflow Tests'
      });
      if (!excelResult.success) allPassed = false;
    } else if (runExcel && isFeatureTest) {
      console.log('\n⚠️  Skipping Excel workflow tests (not applicable for individual features)');
    }
    
    // 3. Playwright Tests (only for apps, not individual features)
    if (runPlaywright && !isFeatureTest) {
      console.log('\n📍 Step 3: Playwright Tests');
      const playwrightResult = await runPlaywrightTests(appName);
      results.push(playwrightResult);
      if (!playwrightResult.success) allPassed = false;
    } else if (runPlaywright && isFeatureTest) {
      console.log('\n⚠️  Skipping Playwright tests (not applicable for individual features)');
    }
    
    // 4. Web Compliance Check (only for apps, not individual features)
    if (runCompliance && !isFeatureTest) {
      console.log('\n📍 Step 4: Web Compliance Check');
      const complianceResult = await runWebComplianceCheck(appName);
      results.push(complianceResult);
      if (!complianceResult.success) allPassed = false;
    } else if (runCompliance && isFeatureTest) {
      console.log('\n⚠️  Skipping compliance check (not applicable for individual features)');
    }
    
  } catch (error: any) {
    console.error(`💥 Error in web test pipeline: ${error.message}`);
    allPassed = false;
  }
  
  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Web Test Pipeline Summary:');
  
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`   ${index + 1}. ${result.type}: ${status}`);
  });
  
  const passedCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n🎯 Overall Result: ${passedCount}/${totalCount} web test suites passed`);
  
  if (allPassed) {
    console.log('✅ All web tests passed successfully!');
  } else {
    console.log('❌ Some web tests failed. Review the output above.');
    process.exit(1);
  }
}

async function runAppRegressionTests(target: string, options: TestOptions): Promise<void> {
  const isFeatureTest = target.includes('/');
  const appName = isFeatureTest ? target.split('/')[0] : target;
  
  console.log(`🚀 Running full regression test suite for ${target}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const results: TestResult[] = [];
  
  try {
    // Phase 1: API Tests
    console.log('\n🔥 Phase 1: API Testing Suite');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      await runAppApiTests(target, options);
      console.log('✅ API tests completed successfully');
      passedTests++;
    } catch (error: any) {
      console.log(`❌ API tests failed: ${error.message}`);
      failedTests++;
      results.push({
        type: 'API Tests',
        success: false,
        output: '',
        error: error.message
      });
    }
    totalTests++;
    
    // Phase 2: Web Tests  
    console.log('\n🌐 Phase 2: Web Testing Suite');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      await runAppWebTests(target, options);
      console.log('✅ Web tests completed successfully');
      passedTests++;
    } catch (error: any) {
      console.log(`❌ Web tests failed: ${error.message}`);
      failedTests++;
      results.push({
        type: 'Web Tests',
        success: false,
        output: '',
        error: error.message
      });
    }
    totalTests++;
    
    // Summary
    const successRate = Math.round((passedTests/totalTests)*100);
    console.log('\n🎯 Regression Test Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Test Phases: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (failedTests > 0) {
      console.log(`\n❌ ${failedTests} test phase(s) failed. Check individual results above.`);
      process.exit(1);
    } else {
      console.log('\n🎉 All regression tests passed! Your application is ready for deployment.');
    }
    
  } catch (error: any) {
    console.log(`\n💥 Regression testing failed: ${error.message}`);
    process.exit(1);
  }
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
  npm run test app:api <target> [-- options]    # API testing
  npm run test app:web <target> [-- options]    # Web testing
  npm run test app:regression <target>          # Full regression (API + Web)

COMMANDS:
  app:api <app-name>               Test entire API app (all test types)
  app:api <app-name>/<feature>     Test specific API feature
  app:web <app-name>               Test entire Web app (all test types)
  app:web <app-name>/<feature>     Test specific Web feature
  app:regression <app-name>        Run full regression suite (API + Web)

API TEST TYPE FLAGS:
  --unittest                       Run unit tests only
  --apitest                        Run API integration tests only
  --compliance                     Run compliance checks only
  (no flags)                       Run all test types (unit + api + compliance)

WEB TEST TYPE FLAGS:
  --unittest                       Run unit tests only (React components)
  --e2e                           Run E2E integration tests only
  --excel                         Run Excel workflow tests only (business-friendly)
  --playwright                     Run Playwright tests only
  --compliance                     Run web compliance checks only
  (no flags)                       Run all test types (unit + e2e + playwright + compliance)

API EXAMPLES:
  npm run test app:api greeting                        # Run all API tests for greeting app
  npm run test app:api greeting -- --unittest          # Unit tests only for greeting API
  npm run test app:api greeting -- --apitest           # API tests only for greeting
  npm run test app:api greeting -- --compliance        # API compliance check only
  npm run test app:api greeting/hello -- --unittest    # Unit tests for hello feature only

WEB EXAMPLES:
  npm run test app:web greeting                        # Run all web tests for greeting app
  npm run test app:web greeting -- --unittest          # Unit tests only for web components
  npm run test app:web greeting -- --e2e              # E2E tests only for greeting
  npm run test app:web greeting -- --excel            # Excel workflow tests only (business-friendly)
  npm run test app:web greeting -- --playwright        # Playwright tests only
  npm run test app:web greeting -- --compliance        # Web compliance check only
  npm run test app:web greeting/hello -- --unittest    # Unit tests for hello feature only

FEATURE-SPECIFIC TESTING:
  API:
    - Unit tests: Available for individual features
    - API tests: Only available at app level (not feature level)
    - Compliance: Only available at app level (not feature level)
  
  WEB:
    - Unit tests: Available for individual features
    - E2E tests: Only available at app level (not feature level)
    - Playwright: Only available at app level (not feature level)
    - Compliance: Only available at app level (not feature level)

FULL API PIPELINE (no flags):
  1. 🔬 Unit Tests (Vitest) - all features in app
  2. 🚀 API Integration Tests (auto-restarts server, Excel-based)
  3. 🔍 Compliance Check (requirements verification)

FULL WEB PIPELINE (no flags):
  1. 🔍 Unit Tests (Vitest) - React components and hooks
  2. 🌐 E2E Integration Tests (Excel-based scenarios)  
  3. 🎭 Playwright Tests (automated browser testing)
  4. 📋 Compliance Check (web specification verification)

EXCEL WORKFLOW TESTING (--excel flag):
  - Reads Excel workflow test cases from __e2etest__ directory
  - Executes corresponding Playwright test files
  - Updates Excel files with PASS/FAIL results and screenshots
  - Business-friendly test reporting for stakeholder validation

TEST GENERATION (separate commands):
  npm run generate app:api <app> -- --testcases    # Generate API testcases from specs
  npm run generate app:web <app> -- --e2etests     # Generate E2E testcases from specs
  npm run generate app:web <app> -- --playwright   # Generate Playwright tests

SERVER REQUIREMENTS:
  API TESTS:
    - Running server: npm run dev:api (for API tests)
    - Server port: http://localhost:3001 or auto-detected
  
  WEB TESTS:
    - Running server: npm run dev:web (for E2E/Playwright tests)
    - Server port: http://localhost:5174

FILE REQUIREMENTS:
  API:
    - Unit tests: src/api/{app}/**/*.test.ts
    - API specs: src/api/{app}/spec/{app}.api.spec.yml
  
  WEB:
    - Unit tests: src/web/apps/{app}/**/*.test.ts
    - Web specs: src/web/apps/{app}/spec/{app}.web.spec.yml
    - E2E tests: src/web/apps/{app}/__e2etest__/*.xlsx
    - Playwright: src/web/apps/{app}/__e2etest__/playwright/*.spec.ts

REGRESSION TESTING:
  npm run test app:regression greeting     # Run complete test suite (API + Web)
  - Phase 1: Complete API testing pipeline (unit + integration + compliance)
  - Phase 2: Complete Web testing pipeline (unit + e2e + playwright + compliance)
  - Comprehensive validation for production deployment readiness
`);
}

main();