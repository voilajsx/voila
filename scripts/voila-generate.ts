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
import { VoilaWorkflow } from './voila-context.js';

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

// Generate workflow from approved tech spec
async function generateWorkflow(appName: string, options: GenerateOptions = {}): Promise<void> {
  console.log(`🔧 Generating workflow for app: ${appName}`);
  
  // Check if planning is approved
  const planningDir = join(__dirname, '..', 'docs', 'planning', appName);
  const techSpecPath = join(planningDir, `${appName}-technical-specification-v1.md`);
  
  if (!existsSync(techSpecPath)) {
    throw new Error(`Technical specification not found: ${techSpecPath}. Run planning first with: npm run plan start ${appName}`);
  }
  
  // Read and parse tech spec
  const techSpecContent = readFileSync(techSpecPath, 'utf-8');
  
  // Check if approved
  if (!techSpecContent.includes('STATUS: APPROVED')) {
    throw new Error(`Technical specification not approved. Please approve with: npm run plan approve ${appName}`);
  }
  
  // Parse workflow section from tech spec
  const workflowSection = extractWorkflowFromTechSpec(techSpecContent, appName);
  
  // Ensure .voila directory exists
  const voilaDir = join(__dirname, '..', '.voila');
  if (!existsSync(voilaDir)) {
    mkdirSync(voilaDir, { recursive: true });
  }
  
  // Validate the generated workflow before saving
  const validationResult = validateWorkflowContent(workflowSection, appName);
  
  if (!validationResult.isValid) {
    console.error(`❌ Workflow generation failed validation:`);
    validationResult.errors.forEach(error => console.error(`   • ${error}`));
    console.error('');
    console.error('💡 Please fix the technical specification and try again:');
    console.error(`   1. Review: docs/planning/${appName}/${appName}-technical-specification-v1.md`);
    console.error(`   2. Fix the Implementation Workflow section`);
    console.error(`   3. Retry: npm run generate workflow ${appName}`);
    throw new Error('Workflow validation failed - refusing to generate invalid workflow');
  }
  
  if (validationResult.warnings.length > 0) {
    console.warn('⚠️  Workflow generated with warnings:');
    validationResult.warnings.forEach(warning => console.warn(`   • ${warning}`));
    console.warn('');
  }
  
  // Generate workflow.yml
  const workflowPath = join(voilaDir, 'workflow.yml');
  await fs.writeFile(workflowPath, workflowSection, 'utf-8');
  
  console.log(`✅ Workflow generated and validated successfully!`);
  console.log(`📂 Location: .voila/workflow.yml`);
  console.log('');
  console.log('📊 Validation Summary:');
  console.log(`   ✅ Features: ${validationResult.featureCount}`);
  console.log(`   ✅ Steps: ${validationResult.stepCount}`);
  console.log(`   ⚠️  Warnings: ${validationResult.warnings.length}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log(`   1. Check workflow status: npm run context workflow:status`);
  console.log(`   2. Get next step: npm run context workflow:next`);
  
  // Log state
  VoilaWorkflow.logAction('generate_workflow', `Generated workflow for '${appName}' from approved tech spec`, {
    currentApp: appName,
    phase: 'workflow-generation',
    nextSteps: [
      'Review generated workflow in .voila/workflow.yml',
      'Use npm run context workflow:status to track progress',
      'Follow workflow steps one by one'
    ],
    context: {
      workflow: {
        generated: true,
        source: 'technical-specification',
        file: '.voila/workflow.yml'
      }
    }
  });
}

// Validation result interface
interface WorkflowValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  featureCount: number;
  stepCount: number;
}

// Validate workflow content before saving
function validateWorkflowContent(workflowContent: string, appName: string): WorkflowValidationResult {
  const result: WorkflowValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    featureCount: 0,
    stepCount: 0
  };
  
  // Basic structure validation
  if (!workflowContent.includes('project:')) {
    result.errors.push('Missing project name in workflow');
    result.isValid = false;
  }
  
  if (!workflowContent.includes('steps:')) {
    result.errors.push('Missing steps section in workflow');
    result.isValid = false;
  }
  
  // Count steps and validate structure
  const stepMatches = workflowContent.match(/^\s*\d+:/gm);
  result.stepCount = stepMatches ? stepMatches.length : 0;
  
  if (result.stepCount === 0) {
    result.errors.push('No workflow steps found');
    result.isValid = false;
  } else if (result.stepCount < 3) {
    result.warnings.push(`Only ${result.stepCount} steps found - workflow may be incomplete`);
  }
  
  // Count features (feature generation steps)
  const featureMatches = workflowContent.match(/Generate \w+ feature/g);
  result.featureCount = featureMatches ? featureMatches.length : 0;
  
  if (result.featureCount === 0) {
    result.warnings.push('No feature generation steps found - using default structure');
  }
  
  // Validate step sequence
  if (stepMatches) {
    const stepNumbers = stepMatches.map(match => parseInt(match.match(/\d+/)?.[0] || '0'));
    for (let i = 0; i < stepNumbers.length - 1; i++) {
      if (stepNumbers[i + 1] - stepNumbers[i] !== 1) {
        result.errors.push(`Gap in step sequence: ${stepNumbers[i]} → ${stepNumbers[i + 1]}`);
        result.isValid = false;
      }
    }
  }
  
  // Validate required commands exist
  const requiredCommands = [
    'npm run generate app:api',
    'npm run validate app:api',
    'npm run test app:api'
  ];
  
  for (const cmd of requiredCommands) {
    if (!workflowContent.includes(cmd)) {
      result.warnings.push(`Missing recommended command: ${cmd}`);
    }
  }
  
  return result;
}

// Extract workflow section from technical specification
function extractWorkflowFromTechSpec(techSpecContent: string, appName: string): string {
  console.log(`🔍 Parsing technical specification for workflow generation...`);
  
  // Parse the Implementation Workflow section
  const workflowMatch = techSpecContent.match(/## \d+\. Implementation Workflow([\s\S]*?)(?=## \d+\.|$)/);
  
  if (!workflowMatch) {
    console.warn(`⚠️  No 'Implementation Workflow' section found in tech spec`);
    console.warn(`   Generating default workflow with single 'main' feature`);
    return generateDefaultWorkflow(appName);
  }
  
  const workflowText = workflowMatch[1];
  
  // Enhanced feature parsing with multiple patterns and validation
  const features = parseFeatures(workflowText, techSpecContent, appName);
  
  if (features.length === 0) {
    console.warn(`⚠️  No valid features found in workflow section`);
    console.warn(`   Expected format: "1. **feature-name** (Priority: X, Complexity: Y)"`);
    console.warn(`   Generating default workflow with single 'main' feature`);
    return generateDefaultWorkflow(appName);
  }
  
  console.log(`✅ Found ${features.length} features: ${features.map(f => f.name).join(', ')}`);
  
  // Validate features against API endpoints
  validateFeaturesAgainstEndpoints(features, techSpecContent);
  
  // Sort features by dependencies and priority
  const sortedFeatures = sortFeaturesByDependencies(features);
  
  // Generate YAML workflow
  let workflowYaml = `# Generated workflow from ${appName}-technical-specification-v1.md
project: ${appName}
current_step: 1
created_from: "docs/planning/${appName}/${appName}-technical-specification-v1.md"
last_updated: "${new Date().toISOString()}"

steps:
  1:
    name: "Generate app structure"
    command: "npm run generate app:api ${appName}"
    status: "pending"
    
  2:
    name: "Initialize Git repository"
    command: "npm run git init"
    status: "pending"
    notes: "Initialize git repo, create main/dev branches, add .gitignore"
    
  3:
    name: "Create ${appName} app branch"
    command: "npm run git branch ${appName}"
    status: "pending"
    notes: "Create app branch: dev/[username]-${appName}"
    
  4:
    name: "Update API specification"
    action: "manual_edit"
    file: "src/api/${appName}/spec/${appName}.api.spec.yml"
    status: "pending"
    notes: "Define all API endpoints from technical specification"
    
  5:
    name: "Validate app structure"
    command: "npm run validate app:api ${appName}"
    status: "pending"

`;

  // Add feature-specific steps
  let stepNumber = 6;
  sortedFeatures.forEach((feature, index) => {
    const featureName = feature.name;
    
    workflowYaml += `
  ${stepNumber++}:
    name: "Generate ${featureName} feature"
    command: "npm run generate app:api ${appName}/${featureName}"
    status: "pending"
    priority: "${feature.priority}"
    complexity: "${feature.complexity}"
    
  ${stepNumber++}:
    name: "Implement ${featureName} contract"
    action: "implement"
    file: "src/api/${appName}/features/${featureName}/${featureName}.index.ts"
    status: "pending"
    notes: "Define VoilaFeatureContract with API endpoints"
    
  ${stepNumber++}:
    name: "Implement ${featureName} types"
    action: "implement"
    file: "src/api/${appName}/features/${featureName}/${featureName}.types.ts"
    status: "pending"
    notes: "Add Zod schemas and TypeScript interfaces"
    
  ${stepNumber++}:
    name: "Implement ${featureName} services"
    action: "implement"
    file: "src/api/${appName}/features/${featureName}/${featureName}.services.ts"
    status: "pending"
    notes: "Add business logic with AppKit integration"
    
  ${stepNumber++}:
    name: "Implement ${featureName} routes"
    action: "implement"
    file: "src/api/${appName}/features/${featureName}/${featureName}.routes.ts"
    status: "pending"
    notes: "Add Express routes with validation"
    
  ${stepNumber++}:
    name: "Validate ${featureName} feature"
    command: "npm run validate app:api ${appName}/${featureName}"
    status: "pending"
    
  ${stepNumber++}:
    name: "Test ${featureName} feature"
    command: "npm run test app:api ${appName}/${featureName} -- --unittest"
    status: "pending"
    notes: "Ensure 95% test coverage before proceeding"
    
  ${stepNumber++}:
    name: "Commit ${featureName} feature"
    command: "npm run git commit ${appName} -- --message=\"implement ${featureName} feature\""
    status: "pending"
    notes: "Commit completed ${featureName} feature with validation"

`;
  });
  
  // Add integration and deployment steps
  workflowYaml += `
  ${stepNumber++}:
    name: "Full app validation"
    command: "npm run validate app:api ${appName}"
    status: "pending"
    
  ${stepNumber++}:
    name: "Full unit test suite"
    command: "npm run test app:api ${appName} -- --unittest"
    status: "pending"
    notes: "Run all feature unit tests to ensure 95% coverage"
    
  ${stepNumber++}:
    name: "Generate API test cases"
    command: "npm run generate app:api ${appName} -- --testcases"
    status: "pending"
    notes: "Generate Excel-based API test cases from specifications"
    
  ${stepNumber++}:
    name: "Run API integration tests"
    command: "npm run test app:api ${appName} -- --apitest"
    status: "pending"
    notes: "Execute API tests against running server, verify endpoint behavior"
    
  ${stepNumber++}:
    name: "Run compliance testing"
    command: "npm run test app:api ${appName} -- --compliance"
    status: "pending"
    notes: "Verify API compliance against requirements, update config with results"
    
  ${stepNumber++}:
    name: "Full test suite validation"
    command: "npm run test app:api ${appName}"
    status: "pending"
    notes: "Run complete test pipeline: unit + API + compliance"
    
  ${stepNumber++}:
    name: "Update README documentation"
    action: "implement"
    file: "src/api/${appName}/${appName}.readme.md"
    status: "pending"
    notes: "Update README with API documentation, endpoints, and usage examples"
    
  ${stepNumber++}:
    name: "Commit ${appName} app"
    command: "npm run git commit ${appName}"
    status: "pending"
    notes: "Commit completed app with validation"
    
  ${stepNumber++}:
    name: "Push ${appName} app for PR"
    command: "npm run git push ${appName}"
    status: "pending"
    notes: "Push app branch for Pull Request creation"
    
  ${stepNumber++}:
    name: "Create Pull Request"
    action: "manual"
    status: "pending"
    notes: "Create PR via GitHub/GitLab: dev/[username]-${appName} → development"

# Git workflow integration
git_workflow:
  branch_structure: "main → development → dev/username-appname"
  branch_strategy: "single app branch: dev/username-appname"
  commit_strategy: "progressive commits per feature, push for PR to development"
  validation_gates: "before every commit and push"
  pr_target: "dev/username-appname → development"
  
# User customizations
user_notes: "Generated from technical specification. Customize as needed."
`;

  return workflowYaml;
}

// Enhanced feature parsing with multiple patterns and validation
interface ParsedFeature {
  name: string;
  priority: string;
  complexity: string;
  description?: string;
  dependencies?: string[];
  order?: number;
}

function parseFeatures(workflowText: string, techSpecContent: string, appName: string): ParsedFeature[] {
  const features: ParsedFeature[] = [];
  
  // Pattern 1: Standard format "1. **feature-name** (Priority: X, Complexity: Y)"
  const standardPattern = /(\d+)\.\s+\*\*([^*]+)\*\*\s*\(Priority:\s*([^,]+),\s*Complexity:\s*([^)]+)\)/g;
  let match;
  
  while ((match = standardPattern.exec(workflowText)) !== null) {
    const [, number, name, priority, complexity] = match;
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    if (isValidFeatureName(cleanName)) {
      features.push({
        name: cleanName,
        priority: priority.trim(),
        complexity: complexity.trim()
      });
      console.log(`  ✅ Parsed feature: ${cleanName} (${priority.trim()}, ${complexity.trim()})`);
    } else {
      console.warn(`  ⚠️  Invalid feature name: "${name}" -> cleaned to "${cleanName}"`);
      console.warn(`     Feature names must contain only lowercase letters, numbers, and hyphens`);
    }
  }
  
  // Pattern 2: Simple format "1. **feature-name**"
  if (features.length === 0) {
    const simplePattern = /\d+\.\s+\*\*([^*]+)\*\*/g;
    while ((match = simplePattern.exec(workflowText)) !== null) {
      const name = match[1].trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      if (isValidFeatureName(name)) {
        features.push({
          name,
          priority: 'Medium',
          complexity: 'Medium'
        });
        console.log(`  ✅ Parsed feature (simple): ${name} (Medium, Medium)`);
      }
    }
  }
  
  // Pattern 3: Bullet points "- **feature-name**"
  if (features.length === 0) {
    const bulletPattern = /-\s+\*\*([^*]+)\*\*/g;
    while ((match = bulletPattern.exec(workflowText)) !== null) {
      const name = match[1].trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      if (isValidFeatureName(name)) {
        features.push({
          name,
          priority: 'Medium',
          complexity: 'Medium'
        });
        console.log(`  ✅ Parsed feature (bullet): ${name} (Medium, Medium)`);
      }
    }
  }
  
  return features;
}

function isValidFeatureName(name: string): boolean {
  return /^[a-z0-9-]+$/.test(name) && name.length > 0 && name.length <= 50;
}

function validateFeaturesAgainstEndpoints(features: ParsedFeature[], techSpecContent: string): void {
  console.log(`🔍 Validating features against API endpoints...`);
  
  // Extract API endpoints table
  const endpointsMatch = techSpecContent.match(/## \d+\. API Endpoint Requirements([\s\S]*?)(?=## \d+\.|$)/);
  
  if (!endpointsMatch) {
    console.warn(`⚠️  No 'API Endpoint Requirements' section found for validation`);
    return;
  }
  
  const endpointsText = endpointsMatch[1];
  
  // Check if each feature appears in endpoints
  features.forEach(feature => {
    const featureInEndpoints = endpointsText.toLowerCase().includes(feature.name) ||
                              endpointsText.includes(`/${feature.name}/`) ||
                              endpointsText.includes(`api/${feature.name}`);
    
    if (!featureInEndpoints) {
      console.warn(`⚠️  Feature "${feature.name}" not found in API endpoints section`);
      console.warn(`     Consider adding endpoints like: /api/appname/${feature.name}/...`);
    } else {
      console.log(`  ✅ Feature "${feature.name}" validated against API endpoints`);
    }
  });
}

function sortFeaturesByDependencies(features: ParsedFeature[]): ParsedFeature[] {
  console.log(`🔍 Analyzing feature dependencies...`);
  
  // Create a dependency map
  const featureMap = new Map(features.map(f => [f.name, f]));
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const sorted: ParsedFeature[] = [];
  
  function visitFeature(featureName: string): void {
    if (visited.has(featureName)) return;
    if (visiting.has(featureName)) {
      console.warn(`⚠️  Circular dependency detected involving feature: ${featureName}`);
      console.warn(`     Proceeding with original order`);
      return;
    }
    
    const feature = featureMap.get(featureName);
    if (!feature) return;
    
    visiting.add(featureName);
    
    // Visit dependencies first
    if (feature.dependencies) {
      for (const dep of feature.dependencies) {
        if (featureMap.has(dep)) {
          visitFeature(dep);
        } else {
          console.warn(`⚠️  Feature "${featureName}" depends on "${dep}" which was not found`);
        }
      }
    }
    
    visiting.delete(featureName);
    visited.add(featureName);
    sorted.push(feature);
  }
  
  // Priority-based sorting for features without explicit dependencies
  const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
  const complexityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
  
  // Sort by priority first, then complexity (simpler features first within same priority)
  features.sort((a, b) => {
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority; // High priority first
    }
    
    const aComplexity = complexityOrder[a.complexity as keyof typeof complexityOrder] || 2;
    const bComplexity = complexityOrder[b.complexity as keyof typeof complexityOrder] || 2;
    
    return aComplexity - bComplexity; // Low complexity first within same priority
  });
  
  // Process features in dependency order
  for (const feature of features) {
    visitFeature(feature.name);
  }
  
  // Add any features that weren't processed (shouldn't happen)
  for (const feature of features) {
    if (!visited.has(feature.name)) {
      sorted.push(feature);
    }
  }
  
  // Log the final order
  console.log(`✅ Feature implementation order:`);
  sorted.forEach((feature, index) => {
    const deps = feature.dependencies?.length ? ` (depends on: ${feature.dependencies.join(', ')})` : '';
    console.log(`  ${index + 1}. ${feature.name} (${feature.priority}, ${feature.complexity})${deps}`);
  });
  
  return sorted;
}

// Generate default workflow if no workflow section found in tech spec
function generateDefaultWorkflow(appName: string): string {
  return `# Default workflow for ${appName}
project: ${appName}
current_step: 1
created_from: "default-template"
last_updated: "${new Date().toISOString()}"

steps:
  1:
    name: "Generate app structure"
    command: "npm run generate app:api ${appName}"
    status: "pending"
    
  2:
    name: "Update API specification"
    action: "manual_edit"
    file: "src/api/${appName}/spec/${appName}.api.spec.yml"
    status: "pending"
    
  3:
    name: "Implement core features"
    action: "implement"
    status: "pending"
    notes: "Add features based on requirements"
    
  4:
    name: "Validate and test"
    command: "npm run validate app:api ${appName}"
    status: "pending"

# User customizations
user_notes: "Default workflow - customize based on your specific requirements."
`;
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
      
      case 'workflow':
        await generateWorkflow(target, options);
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

  // Log state
  VoilaWorkflow.logAction('generate_app', `Generated app structure for '${appName}' - created src/api/${appName}/ with config and spec files`, {
    currentApp: appName,
    phase: 'app-structure',
    nextSteps: [
      `Add features: npm run generate app:api ${appName}/myfeature`,
      `Update spec: edit src/api/${appName}/spec/${appName}.api.spec.yml`,
      `Run tests: npm run test all ${appName}`
    ],
    context: {
      development: {
        appStructureGenerated: true,
        currentFeatureInProgress: false,
        testsWritten: false,
        integrationTestsPassed: false
      }
    }
  });
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

  // Log state
  VoilaWorkflow.logAction('generate_feature', `Generated feature '${featureName}' for ${appName} app - created contract, types, services, routes, tests templates`, {
    currentApp: appName,
    currentFeature: featureName,
    phase: 'feature-development',
    nextSteps: [
      `Define contract in ${featureName}.index.ts (VoilaFeatureContract)`,
      `Implement types & schemas in ${featureName}.types.ts`,
      `Implement business logic in ${featureName}.services.ts`,
      `Configure routes in ${featureName}.routes.ts`
    ],
    context: {
      development: {
        appStructureGenerated: true,
        currentFeatureInProgress: true,
        testsWritten: false,
        integrationTestsPassed: false
      }
    }
  });
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
  workflow <app-name>             Generate workflow from approved tech specification

GENERATION TYPES:
  --application                   Generate application structure (default if no flags)
  --testcases                     Generate API test cases from specifications

EXAMPLES:
  npm run generate app:api user                         # Generate user API app (default)
  npm run generate app:api user -- --application       # Generate user API app explicitly
  npm run generate app:api user -- --testcases         # Generate API test cases for user
  npm run generate app:api user/profile                # Add profile feature to user app
  npm run generate app:api shop/cart -- --overwrite    # Overwrite existing cart feature
  npm run generate workflow converter                   # Generate workflow from tech spec

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