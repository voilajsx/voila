#!/usr/bin/env tsx

/**
 * Voila Generate Script - API structure and testcase generator
 * Usage: npx tsx scripts/voila-generate.ts [command] [target] [-- options]
 * Examples:
 *   npx tsx scripts/voila-generate.ts app:api myapp                    # Generate app (default)
 *   npx tsx scripts/voila-generate.ts app:api myapp -- --application  # Generate app explicitly
 *   npx tsx scripts/voila-generate.ts app:api myapp -- --testcases    # Generate API testcases
 *   npx tsx scripts/voila-generate.ts app:api myapp/feature           # Generate feature
 */

import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { parse as parseYaml } from 'yaml';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface GenerateOptions {
  overwrite?: boolean;
  skipExisting?: boolean;
  application?: boolean;
  testcases?: boolean;
}

interface TemplateVars {
  APP_NAME: string;
  APP_NAME_UPPER: string;
  FEATURE_NAME?: string;
  FEATURE_NAME_PASCAL?: string;
  CREATED_DATE: string;
}

interface TestCase {
  id: string;
  description: string;
  method: string;
  path: string;
  input: any;
  expected: any;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    showHelp();
    return;
  }

  const command = args[0];
  const target = args[1];
  const options = parseOptions(args.slice(2));
  
  console.log('🏗️  Voila Generator');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    switch (command) {
      case 'app:api':
        if (target.includes('/')) {
          // Generate feature: app:api myapp/myfeature
          const [appName, featureName] = target.split('/');
          await generateFeature(appName, featureName, options);
        } else {
          // Generate app or testcases: app:api myapp
          if (options.testcases) {
            await generateTestCases(target, options);
          } else {
            // Default to application generation
            await generateApp(target, options);
          }
        }
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error: any) {
    console.error('💥 Generation error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function generateApp(appName: string, options: GenerateOptions = {}): Promise<void> {
  console.log(`📱 Generating API app: ${appName}`);
  
  // Validate app name
  if (!isValidName(appName)) {
    throw new Error('Invalid app name. Use lowercase letters, numbers, and hyphens only.');
  }

  // Check if planning is approved
  const planningDir = join(__dirname, '..', 'docs', 'planning', appName);
  const businessReqPath = join(planningDir, `${appName}-business-requirements-v1.md`);
  const techSpecPath = join(planningDir, `${appName}-technical-specification-v1.md`);
  
  if (existsSync(businessReqPath) && existsSync(techSpecPath)) {
    const businessContent = readFileSync(businessReqPath, 'utf-8');
    const techContent = readFileSync(techSpecPath, 'utf-8');
    
    const businessApproved = businessContent.includes('STATUS: APPROVED');
    const techApproved = techContent.includes('STATUS: APPROVED');
    
    if (!businessApproved || !techApproved) {
      console.error('❌ Planning not approved for implementation');
      console.error('   Planning documents must be completed and approved before generation.');
      console.error('');
      console.error('📝 Required steps:');
      console.error(`   1. Complete [FILL_IN] sections in docs/planning/${appName}/`);
      console.error(`   2. Change STATUS: UNDER_REVIEW to STATUS: APPROVED in both files`);
      console.error(`   3. Then retry: npm run generate app:api ${appName}`);
      console.error('');
      console.error('💡 Or run: npm run plan approve ${appName} (auto-approves)');
      throw new Error('Planning approval required before implementation');
    }
    
    console.log('✅ Planning approved - proceeding with generation');
  } else {
    console.log('⚠️  No planning found - generating without planning validation');
  }

  const appDir = join(__dirname, '..', 'src', 'api', appName);
  
  // Check if app already exists
  if (await exists(appDir)) {
    if (!options.overwrite) {
      throw new Error(`App '${appName}' already exists. Use --overwrite to replace it.`);
    }
    console.log(`⚠️  Overwriting existing app: ${appName}`);
    await fs.rm(appDir, { recursive: true, force: true });
  }

  // Create app directory structure
  await fs.mkdir(appDir, { recursive: true });
  await fs.mkdir(join(appDir, 'features'), { recursive: true });
  await fs.mkdir(join(appDir, 'spec'), { recursive: true });
  await fs.mkdir(join(appDir, '__apitest__'), { recursive: true });

  const templateVars: TemplateVars = {
    APP_NAME: appName,
    APP_NAME_UPPER: appName.toUpperCase(),
    CREATED_DATE: new Date().toISOString().split('T')[0],
  };

  // Generate app files
  await generateFromTemplate('app.config.json', join(appDir, `${appName}.config.json`), templateVars);
  await generateFromTemplate('app.readme.md', join(appDir, `${appName}.readme.md`), templateVars);
  await generateFromTemplate('app.api.spec.yml', join(appDir, 'spec', `${appName}.api.spec.yml`), templateVars);

  console.log(`✅ App '${appName}' generated successfully!`);
  console.log(`📂 Location: src/api/${appName}/`);
  console.log(`📝 Next steps:`);
  console.log(`   1. Add features: npm run generate app:api ${appName}/myfeature`);
  console.log(`   2. Update spec: edit src/api/${appName}/spec/${appName}.api.spec.yml`);
  console.log(`   3. Run tests: npm run test all ${appName}`);
}

async function generateFeature(appName: string, featureName: string, options: GenerateOptions = {}): Promise<void> {
  console.log(`🔧 Generating feature: ${appName}/${featureName}`);
  
  // Validate names
  if (!isValidName(appName) || !isValidName(featureName)) {
    throw new Error('Invalid app or feature name. Use lowercase letters, numbers, and hyphens only.');
  }

  const appDir = join(__dirname, '..', 'src', 'api', appName);
  const featureDir = join(appDir, 'features', featureName);
  const configPath = join(appDir, `${appName}.config.json`);
  
  // Check if app exists, create it if it doesn't
  if (!await exists(appDir)) {
    console.log(`📱 App '${appName}' doesn't exist. Creating it first...`);
    await generateApp(appName, { skipExisting: true });
    console.log(`✅ App '${appName}' created successfully!`);
    console.log(`🔧 Now generating feature: ${featureName}`);
  }

  // Check if feature already exists
  if (await exists(featureDir)) {
    if (!options.overwrite) {
      throw new Error(`Feature '${featureName}' already exists in '${appName}'. Use --overwrite to replace it.`);
    }
    console.log(`⚠️  Overwriting existing feature: ${featureName}`);
    await fs.rm(featureDir, { recursive: true, force: true });
  }

  // Create feature directory
  await fs.mkdir(featureDir, { recursive: true });

  const templateVars: TemplateVars = {
    APP_NAME: appName,
    APP_NAME_UPPER: appName.toUpperCase(),
    FEATURE_NAME: featureName,
    FEATURE_NAME_PASCAL: toPascalCase(featureName),
    CREATED_DATE: new Date().toISOString().split('T')[0],
  };

  // Generate feature files in proper order
  await generateFromTemplate('feature.index.ts', join(featureDir, `${featureName}.index.ts`), templateVars);
  await generateFromTemplate('feature.types.ts', join(featureDir, `${featureName}.types.ts`), templateVars);
  await generateFromTemplate('feature.services.ts', join(featureDir, `${featureName}.services.ts`), templateVars);
  await generateFromTemplate('feature.routes.ts', join(featureDir, `${featureName}.routes.ts`), templateVars);
  await generateFromTemplate('feature.models.ts', join(featureDir, `${featureName}.models.ts`), templateVars);
  await generateFromTemplate('feature.test.ts', join(featureDir, `${featureName}.test.ts`), templateVars);

  // Update app config to include the feature
  await updateAppConfig(configPath, featureName);

  console.log(`✅ Feature '${featureName}' generated successfully!`);
  console.log(`📂 Location: src/api/${appName}/features/${featureName}/`);
  console.log(`📝 Next steps (contract-driven development):`);
  console.log(`   1. Define contract in ${featureName}.index.ts (VoilaFeatureContract)`);
  console.log(`   2. Implement types & schemas in ${featureName}.types.ts`);
  console.log(`   3. Implement business logic in ${featureName}.services.ts`);
  console.log(`   4. Configure routes in ${featureName}.routes.ts`);
  console.log(`   5. Add database models in ${featureName}.models.ts (if needed)`);
  console.log(`   6. Write tests in ${featureName}.test.ts`);
  console.log(`   7. Validate: npm run validate app:api ${appName}/${featureName}`);
  console.log(`   8. Run tests: npm run test app:api ${appName}/${featureName} -- --unittest`);
}

async function generateFromTemplate(templateName: string, outputPath: string, vars: TemplateVars): Promise<void> {
  const templatePath = join(__dirname, '..', 'templates', templateName);
  
  if (!await exists(templatePath)) {
    throw new Error(`Template not found: ${templateName}`);
  }

  let content = await fs.readFile(templatePath, 'utf-8');
  
  // Replace template variables
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value || '');
  }

  await fs.writeFile(outputPath, content, 'utf-8');
  console.log(`   📄 Generated: ${outputPath.replace(process.cwd(), '.')}`);
}

async function updateAppConfig(configPath: string, featureName: string): Promise<void> {
  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    
    // Add feature to config if not already present
    if (!config.features) {
      config.features = {};
    }
    
    if (!config.features[featureName]) {
      config.features[featureName] = {
        enabled: true,
        environments: ['development', 'staging', 'production'],
        description: `${toPascalCase(featureName)} feature for ${config.app} application`
      };
      
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
      console.log(`   🔧 Updated config: enabled feature '${featureName}'`);
    }
  } catch (error) {
    console.warn(`⚠️  Could not update app config: ${error}`);
  }
}

async function generateTestCases(appName: string, options: GenerateOptions = {}): Promise<void> {
  console.log(`📋 Generating API test cases for ${appName}`);
  
  const specPath = join(__dirname, '..', 'src', 'api', appName, 'spec', `${appName}.api.spec.yml`);
  
  if (!existsSync(specPath)) {
    throw new Error(`Spec file not found: ${specPath}. Please generate the app first with: npm run generate app:api ${appName}`);
  }

  // Read and parse spec file
  const specContent = readFileSync(specPath, 'utf-8');
  const spec = parseYaml(specContent);
  
  // Extract test cases
  const testCases: TestCase[] = [];
  
  for (const specification of spec.specifications || []) {
    const endpoint = specification.endpoint;
    
    for (const test of specification.tests || []) {
      testCases.push({
        id: test.id,
        description: test.description,
        method: endpoint.method,
        path: endpoint.path.replace(/{(\w+)}/g, (match: string, param: string) => {
          // Replace path parameters with actual values from test input
          return test.input?.path_parameters?.[param] || `:${param}`;
        }),
        input: test.input,
        expected: test.expected
      });
    }
  }

  if (testCases.length === 0) {
    throw new Error(`No test cases found in spec file: ${specPath}. Please add test specifications.`);
  }

  // Create API test directory
  const apitestDir = join(__dirname, '..', 'src', 'api', appName, '__apitest__');
  if (!existsSync(apitestDir)) {
    mkdirSync(apitestDir, { recursive: true });
  }

  // Generate Excel file with test cases
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const excelPath = join(apitestDir, `${appName}.testcases-${timestamp}.xlsx`);

  const workbook = new ExcelJS.Workbook();
  
  // Create Test Cases sheet
  const testSheet = workbook.addWorksheet('Test Cases');
  
  // Headers
  testSheet.addRow([
    'Test ID', 'Description', 'Method', 'Path', 'Input', 'Expected Output',
    'Status', 'Actual Output', 'Response Time', 'Notes'
  ]);

  // Test case data
  for (const testCase of testCases) {
    testSheet.addRow([
      testCase.id,
      testCase.description,
      testCase.method,
      testCase.path,
      JSON.stringify(testCase.input || {}, null, 2),
      JSON.stringify(testCase.expected || {}, null, 2),
      'PENDING', // Status
      '', // Actual Output
      '', // Response Time
      '' // Notes
    ]);
  }

  // Format the sheet
  testSheet.columns = [
    { key: 'id', width: 25 },
    { key: 'description', width: 40 },
    { key: 'method', width: 10 },
    { key: 'path', width: 30 },
    { key: 'input', width: 30 },
    { key: 'expected', width: 30 },
    { key: 'status', width: 12 },
    { key: 'actual', width: 30 },
    { key: 'responseTime', width: 15 },
    { key: 'notes', width: 30 }
  ];

  // Style header row
  const headerRow = testSheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Save Excel file
  await workbook.xlsx.writeFile(excelPath);

  console.log(`✅ API test cases generated successfully!`);
  console.log(`📂 Location: ${excelPath}`);
  console.log(`📊 Test Cases: ${testCases.length}`);
  console.log(`📝 Next steps:`);
  console.log(`   1. Review test cases in Excel file`);
  console.log(`   2. Run API tests: npm run test app:api ${appName} -- --apitest`);
  console.log(`   3. Check compliance: npm run test app:api ${appName} -- --compliance`);
}

function parseOptions(args: string[]): GenerateOptions {
  const options: GenerateOptions = {};
  
  for (const arg of args) {
    switch (arg) {
      case '--overwrite':
        options.overwrite = true;
        break;
      case '--skip-existing':
        options.skipExisting = true;
        break;
      case '--application':
        options.application = true;
        break;
      case '--testcases':
        options.testcases = true;
        break;
    }
  }
  
  return options;
}

function isValidName(name: string): boolean {
  return /^[a-z][a-z0-9-]*[a-z0-9]$/.test(name) || /^[a-z]$/.test(name);
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

function showHelp() {
  console.log(`
🏗️  Voila Generator - API Structure & Test Case Generator

USAGE:
  npm run generate app:api <target> [-- options]

COMMANDS:
  app:api <app-name>              Generate new API application structure (default)
  app:api <app-name>/<feature>    Generate new feature within existing app

GENERATION TYPES:
  --application                   Generate application structure (default if no flags)
  --testcases                     Generate API test cases from specifications

EXAMPLES:
  npm run generate app:api user                         # Generate user API app (default)
  npm run generate app:api user -- --application       # Generate user API app explicitly
  npm run generate app:api user -- --testcases         # Generate API test cases for user
  npm run generate app:api user/profile                # Add profile feature to user app
  npm run generate app:api shop/cart -- --overwrite    # Overwrite existing cart feature

OPTIONS:
  --overwrite                     Overwrite existing files/directories
  --skip-existing                 Skip files that already exist

TYPICAL WORKFLOW:
  1. npm run generate app:api myapp                     # Create app structure
  2. npm run generate app:api myapp/feature1           # Add features as needed
  3. npm run generate app:api myapp -- --testcases     # Generate test cases from spec
  4. npm run test app:api myapp -- --apitest          # Run API tests
  5. npm run test app:api myapp -- --compliance       # Check compliance

APP STRUCTURE (app:api myapp):
  src/api/myapp/
  ├── features/                   # Feature modules directory
  ├── spec/                       # API specifications
  │   └── myapp.api.spec.yml     # OpenAPI/test specifications
  ├── __apitest__/               # Generated API test results & testcases
  ├── myapp.config.json          # App configuration
  └── myapp.readme.md            # Documentation

FEATURE STRUCTURE (app:api myapp/feature):
  src/api/myapp/features/feature/
  ├── feature.index.ts           # VoilaFeatureContract definition (define first)
  ├── feature.types.ts           # TypeScript types & Zod schemas
  ├── feature.services.ts        # Business logic & service layer
  ├── feature.routes.ts          # Express route definitions
  ├── feature.models.ts          # Database models (optional)
  └── feature.test.ts            # Unit tests (Vitest)

NAMING RULES:
  - Use lowercase letters, numbers, and hyphens
  - Start with a letter
  - Examples: user, user-profile, shop-cart, auth-service
`);
}

main();