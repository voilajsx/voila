#!/usr/bin/env tsx

/**
 * Voila Generate Script - API structure and testcase generator
 * Usage: npm run generate [command] [target] [-- options]
 * Examples:
 *   npm run generate app:api myapp                    # Generate app (default)
 *   npm run generate app:api myapp -- --application  # Generate app explicitly
 *   npm run generate app:api myapp -- --testcases    # Generate API testcases
 *   npm run generate app:api myapp/feature               # Generate feature (essential validation)
 *   npm run generate app:api myapp/feature -- --none   # Generate feature (no validation) 
 *   npm run generate app:api myapp/feature -- --basic  # Generate feature (basic validation)
 *   npm run generate app:api myapp/feature -- --strict # Generate feature (full validation)
 */

import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
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
  // Validation level flags
  none?: boolean;
  basic?: boolean;
  strict?: boolean;
}

interface TemplateVars {
  APP_NAME: string;
  APP_NAME_UPPER: string;
  FEATURE_NAME?: string;
  FEATURE_NAME_PASCAL?: string;
  CREATED_DATE: string;
  VALIDATION_LEVEL?: string;
}

interface TestCase {
  id: string;
  description: string;
  method: string;
  path: string;
  input: any;
  expected: any;
}

// Helper function to find latest Change Request version
function findLatestCRVersion(planningDir: string, appName: string): string | null {
  try {
    const files = readdirSync(planningDir);
    const businessCRPattern = new RegExp(`^${appName}-business-requirements-cr-v(\\d+\\.\\d+)\\.md$`);
    const techCRPattern = new RegExp(`^${appName}-technical-specification-cr-v(\\d+\\.\\d+)\\.md$`);
    
    const businessVersions: string[] = [];
    const techVersions: string[] = [];
    
    for (const file of files) {
      const businessMatch = file.match(businessCRPattern);
      const techMatch = file.match(techCRPattern);
      
      if (businessMatch) {
        businessVersions.push(businessMatch[1]);
      }
      if (techMatch) {
        techVersions.push(techMatch[1]);
      }
    }
    
    // Only return versions that have BOTH business and technical documents
    const validVersions = businessVersions.filter(version => 
      techVersions.includes(version)
    );
    
    if (validVersions.length === 0) {
      return null;
    }
    
    // Sort versions and return the latest
    const sortedVersions = validVersions.sort((a, b) => {
      const [aMajor, aMinor] = a.split('.').map(Number);
      const [bMajor, bMinor] = b.split('.').map(Number);
      
      if (aMajor !== bMajor) {
        return bMajor - aMajor; // Descending major version
      }
      return bMinor - aMinor; // Descending minor version
    });
    
    return `v${sortedVersions[0]}`;
  } catch (error) {
    return null;
  }
}

// Determine workflow complexity based on change request version
function getWorkflowComplexity(crVersion: string | null): 'simple-change' | 'complex-change' | 'initial-development' {
  if (!crVersion) return 'initial-development';
  
  const version = crVersion.replace('v', '');
  const [major, minor] = version.split('.').map(Number);
  
  if (major === 1) return 'simple-change';  // cr-v1.x = simple changes (content, format, minor logic)
  if (major >= 2) return 'complex-change';  // cr-v2.x+ = major changes (new features, API changes)
  
  return 'initial-development';
}

// Generate workflow from approved tech spec
async function generateWorkflow(appName: string, options: GenerateOptions = {}): Promise<void> {
  console.log(`🔧 Generating workflow for app: ${appName}`);
  
  const planningDir = join(__dirname, '..', 'docs', 'planning', appName);
  
  // 1. DETECT CHANGE REQUEST DOCUMENTS
  const crVersion = findLatestCRVersion(planningDir, appName);
  
  // 2. DETERMINE WORKFLOW COMPLEXITY
  const workflowComplexity = getWorkflowComplexity(crVersion);
  
  // 3. DETERMINE SPEC FILE TO USE
  let techSpecPath: string;
  let workflowType: string;
  
  if (crVersion) {
    // Use CR specs if available - validate both documents exist
    const businessCRPath = join(planningDir, `${appName}-business-requirements-cr-${crVersion}.md`);
    techSpecPath = join(planningDir, `${appName}-technical-specification-cr-${crVersion}.md`);
    
    if (workflowComplexity === 'simple-change') {
      workflowType = `Simple Change Request ${crVersion}`;
      console.log(`📋 Found Simple Change Request ${crVersion} - generating streamlined workflow`);
    } else {
      workflowType = `Complex Change Request ${crVersion}`;
      console.log(`📋 Found Complex Change Request ${crVersion} - generating full workflow`);
    }
    
    // Check both CR documents exist
    if (!existsSync(businessCRPath)) {
      throw new Error(`Change Request business requirements not found: ${businessCRPath}. Please create both CR documents.`);
    }
    if (!existsSync(techSpecPath)) {
      throw new Error(`Change Request technical specification not found: ${techSpecPath}. Please create both CR documents.`);
    }
    
    // Validate both CR documents are approved
    const businessCRContent = readFileSync(businessCRPath, 'utf-8');
    if (!businessCRContent.includes('STATUS: APPROVED')) {
      throw new Error(`Change Request business requirements not approved. Please approve: ${businessCRPath}`);
    }
    
    console.log(`✅ Both CR documents found and approved - generating ${workflowComplexity} workflow`);
  } else {
    // Use original spec 
    techSpecPath = join(planningDir, `${appName}-technical-specification-v1.md`);
    workflowType = 'Initial Development';
    console.log(`📋 Using original specification - generating development workflow`);
    
    if (!existsSync(techSpecPath)) {
      throw new Error(`Technical specification not found: ${techSpecPath}. Run planning first with: npm run plan start ${appName}`);
    }
  }
  
  // Read and parse tech spec
  const techSpecContent = readFileSync(techSpecPath, 'utf-8');
  
  // Check if approved
  if (!techSpecContent.includes('STATUS: APPROVED')) {
    throw new Error(`Technical specification not approved. Please approve with: npm run plan approve ${appName}`);
  }
  
  // Generate workflow based on complexity
  let workflowSection: string;
  
  if (workflowComplexity === 'simple-change') {
    workflowSection = generateSimpleChangeWorkflow(techSpecContent, appName, crVersion, workflowType);
  } else {
    // Use existing complex workflow for initial development and complex changes
    workflowSection = extractWorkflowFromTechSpec(techSpecContent, appName, crVersion, workflowType);
  }
  
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
  
  console.log(`✅ ${workflowType} workflow generated and validated successfully!`);
  console.log(`📂 Location: .voila/workflow.yml`);
  if (crVersion) {
    console.log(`🔄 Change Request: ${crVersion} workflow (${workflowComplexity}) will implement the requested changes`);
  }
  console.log('');
  console.log('📊 Validation Summary:');
  console.log(`   ✅ Features: ${validationResult.featureCount}`);
  console.log(`   ✅ Steps: ${validationResult.stepCount}`);
  console.log(`   ⚠️  Warnings: ${validationResult.warnings.length}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log(`   1. Check workflow status: npm run context status`);
  console.log(`   2. Get next step: npm run context next`);
  
  // Log state
  VoilaWorkflow.logAction('generate_workflow', `Generated workflow for '${appName}' from approved tech spec`, {
    currentApp: appName,
    phase: 'workflow-generation',
    nextSteps: [
      'Review generated workflow in .voila/workflow.yml',
      'Use npm run context status to track progress',
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
function extractWorkflowFromTechSpec(techSpecContent: string, appName: string, crVersion?: string | null, workflowType?: string): string {
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
  
  // Generate YAML workflow with Claude Code instructions
  // Determine source file and project naming based on CR detection
  const sourceFile = crVersion ? `${appName}-technical-specification-cr-${crVersion}.md` : `${appName}-technical-specification-v1.md`;
  const projectName = crVersion ? `${appName}-cr-${crVersion}` : appName;
  const workflowDescription = workflowType || 'Initial Development';
  
  let workflowYaml = `# Generated workflow from ${sourceFile}
project: ${projectName}
workflow_type: "${workflowDescription}"
current_step: 1
created_from: "docs/planning/${appName}/${sourceFile}"
last_updated: "${new Date().toISOString()}"

# Instructions for Claude Code
claude_instructions:
  completion_rule: "ALWAYS run 'npm run context complete '<step name>' immediately after successful step execution"
  failure_rule: "On failure, do NOT mark as complete. Analyze error and fix before proceeding"
  validation_rule: "Steps with 'validate_success' field must pass validation before marking complete"
  general_workflow: |
    1. Read the step name and command/action
    2. Execute the command or perform the action
    3. Check validate_success criteria (if present)
    4. If successful: run on_success command to mark complete
    5. If failed: follow on_failure guidance, do NOT mark complete
    6. Move to next step only after current step is successfully completed

steps:
  1:
    name: "Generate app structure"
    command: "npm run generate app:api ${appName}"
    status: "pending"
    validate_success: "Check that src/api/${appName}/ directory exists with config, readme, and spec files"
    on_success: "npm run context complete 'Generate app structure'"
    on_failure: "Analyze error output, check planning approval, retry command"
    
  2:
    name: "Initialize Git repository"
    command: "npm run git init"
    status: "pending"
    notes: "Initialize git repo, create main/development branches, add .gitignore"
    validate_success: "Check that git status works and .git directory exists"
    on_success: "npm run context complete 'Initialize Git repository'"
    on_failure: "Check git installation, resolve git config issues, retry"
    
  3:
    name: "Create ${appName} app branch"
    command: "npm run git branch ${appName}"
    status: "pending"
    notes: "Create app branch: dev/[username]-${appName}"
    validate_success: "Verify branch dev/[username]-${appName} is created and checked out"
    on_success: "npm run context complete 'Create ${appName} app branch'"
    on_failure: "Check git status, resolve conflicts, ensure clean working directory, retry"
    
  4:
    name: "Update API specification"
    action: "manual_edit"
    file: "src/api/${appName}/spec/${appName}.api.spec.yml"
    status: "pending"
    notes: "Define all API endpoints from technical specification"
    validate_success: "Check that spec file contains all endpoints from technical specification"
    on_success: "npm run context complete 'Update API specification'"
    on_failure: "Review technical specification, fix YAML syntax, add missing endpoints"
    
`;

  // Add feature-specific steps
  let stepNumber = 5;
  sortedFeatures.forEach((feature, index) => {
    const featureName = feature.name;
    
    workflowYaml += `
  ${stepNumber++}:
    name: "Generate ${featureName} feature"
    command: "npm run generate app:api ${appName}/${featureName}"
    status: "pending"
    priority: "${feature.priority}"
    complexity: "${feature.complexity}"
    validate_success: "Check that src/api/${appName}/features/${featureName}/ directory exists with all template files"
    on_success: "npm run context complete 'Generate ${featureName} feature'"
    on_failure: "Check app exists, fix naming issues, retry generation"
    
  ${stepNumber++}:
    name: "Implement ${featureName} contract"
    action: "implement"
    file: "src/api/${appName}/features/${featureName}/${featureName}.index.ts"
    status: "pending"
    notes: "Define VoilaFeatureContract with API endpoints"
    validate_success: "VoilaFeatureContract exported with name, api endpoints, dependencies, and provides sections"
    on_success: "npm run context complete 'Implement ${featureName} contract'"
    on_failure: "Review VoilaFeatureContract interface, fix syntax errors, add required fields"
    
  ${stepNumber++}:
    name: "Implement ${featureName} types"
    action: "implement"
    file: "src/api/${appName}/features/${featureName}/${featureName}.types.ts"
    status: "pending"
    notes: "Add Zod schemas and TypeScript interfaces"
    validate_success: "Zod schemas defined and TypeScript types exported for request/response"
    on_success: "npm run context complete 'Implement ${featureName} types'"
    on_failure: "Review Zod documentation, fix schema validation, ensure type exports"
    
  ${stepNumber++}:
    name: "Implement ${featureName} services"
    action: "implement"
    file: "src/api/${appName}/features/${featureName}/${featureName}.services.ts"
    status: "pending"
    notes: "Add business logic with AppKit integration"
    validate_success: "Service class exported with methods matching contract endpoints"
    on_success: "npm run context complete 'Implement ${featureName} services'"
    on_failure: "Review AppKit patterns, fix import errors, implement missing methods"
    
  ${stepNumber++}:
    name: "Implement ${featureName} routes"
    action: "implement"
    file: "src/api/${appName}/features/${featureName}/${featureName}.routes.ts"
    status: "pending"
    notes: "Add Express routes with validation"
    validate_success: "Express router exported with routes matching contract endpoints"
    on_success: "npm run context complete 'Implement ${featureName} routes'"
    on_failure: "Review Express routing, fix validation middleware, ensure route exports"
    
  ${stepNumber++}:
    name: "Skim ${featureName} feature"
    command: "npm run validate app:api ${appName}/${featureName} -- --skim"
    status: "pending"
    validate_success: "Command exits with code 0 and shows validation success"
    on_success: "npm run context complete 'Skim ${featureName} feature'"
    on_failure: "Review validation errors, fix TypeScript and syntax issues"
    
  ${stepNumber++}:
    name: "Implement ${featureName} tests"
    action: "implement"
    file: "src/api/${appName}/features/${featureName}/${featureName}.test.ts"
    status: "pending"
    notes: "Write unit tests matching contract requirements"
    validate_success: "Test file contains tests matching contract test declarations"
    on_success: "npm run context complete 'Implement ${featureName} tests'"
    on_failure: "Review contract tests, implement missing test cases, ensure proper mocking"
    
  ${stepNumber++}:
    name: "Run ${featureName} tests"
    command: "npm run test app:api ${appName}/${featureName} -- --unittest"
    status: "pending"
    notes: "Ensure 95% test coverage before proceeding"
    validate_success: "Tests pass with >=95% coverage and no failures"
    on_success: "npm run context complete 'Run ${featureName} tests'"
    on_failure: "Fix failing tests, add missing test cases, ensure 95% coverage"
    
  ${stepNumber++}:
    name: "Commit ${featureName} feature"
    command: "npm run git commit ${appName} -- --message='implement ${featureName} feature'"
    status: "pending"
    notes: "Commit completed ${featureName} feature with validation"
    validate_success: "Git commit succeeds and shows commit hash"
    on_success: "npm run context complete 'Commit ${featureName} feature'"
    on_failure: "Review git status, fix validation errors, ensure clean working directory, retry commit"

`;
  });
  
  // Add integration and deployment steps
  workflowYaml += `
  ${stepNumber++}:
    name: "Full app validation"
    command: "npm run validate app:api ${appName}"
    status: "pending"
    validate_success: "All features pass validation with no errors"
    on_success: "npm run context complete 'Full app validation'"
    on_failure: "Review validation errors for each feature, fix contracts and implementations"
    
  ${stepNumber++}:
    name: "Full unit test suite"
    command: "npm run test app:api ${appName} -- --unittest"
    status: "pending"
    notes: "Run all feature unit tests to ensure 95% coverage"
    validate_success: "All tests pass with >=95% total coverage"
    on_success: "npm run context complete 'Full unit test suite'"
    on_failure: "Fix failing tests, add missing test cases, ensure coverage requirements"
    
  ${stepNumber++}:
    name: "Generate API test cases"
    command: "npm run generate app:api ${appName} -- --testcases"
    status: "pending"
    notes: "Generate Excel-based API test cases from specifications"
    validate_success: "Excel test case file generated successfully in __apitest__ directory"
    on_success: "npm run context complete 'Generate API test cases'"
    on_failure: "Check API specification, fix YAML format, ensure endpoints are defined"
    
  ${stepNumber++}:
    name: "Run API integration tests"
    command: "npm run test app:api ${appName} -- --apitest"
    status: "pending"
    notes: "Execute API tests against running server, verify endpoint behavior"
    validate_success: "All API tests pass with correct responses and status codes"
    on_success: "npm run context complete 'Run API integration tests'"
    on_failure: "Start development server, fix endpoint implementations, verify test cases"
    
  ${stepNumber++}:
    name: "Run compliance testing"
    command: "npm run test app:api ${appName} -- --compliance"
    status: "pending"
    notes: "Verify API compliance against requirements, update config with results"
    validate_success: "Compliance tests pass and config updated with results"
    on_success: "npm run context complete 'Run compliance testing'"
    on_failure: "Review compliance requirements, fix API specification, update implementations"
    
  ${stepNumber++}:
    name: "Full test suite validation"
    command: "npm run test app:api ${appName}"
    status: "pending"
    notes: "Run complete test pipeline: unit + API + compliance"
    validate_success: "All tests pass: unit tests, API tests, and compliance checks"
    on_success: "npm run context complete 'Full test suite validation'"
    on_failure: "Review all test failures, fix issues systematically, ensure all test types pass"
    
  ${stepNumber++}:
    name: "Update README documentation"
    action: "implement"
    file: "src/api/${appName}/${appName}.readme.md"
    status: "pending"
    notes: "Update README with API documentation, endpoints, and usage examples"
    validate_success: "README contains complete API documentation with examples and usage instructions"
    on_success: "npm run context complete 'Update README documentation'"
    on_failure: "Review API endpoints, add usage examples, include setup and testing instructions"
    
  ${stepNumber++}:
    name: "Commit ${appName} app"
    command: "npm run git commit ${appName}"
    status: "pending"
    notes: "Commit completed app with validation"
    validate_success: "Git commit succeeds with conventional commit message"
    on_success: "npm run context complete 'Commit ${appName} app'"
    on_failure: "Review git status, fix validation issues, ensure clean commit"
    
  ${stepNumber++}:
    name: "Push ${appName} app for PR"
    command: "npm run git push ${appName}"
    status: "pending"
    notes: "Push app branch for Pull Request creation"
    validate_success: "Branch pushed successfully to remote repository"
    on_success: "npm run context complete 'Push ${appName} app for PR'"
    on_failure: "Check remote repository access, resolve merge conflicts, retry push"
    
  ${stepNumber++}:
    name: "Create Pull Request"
    action: "manual"
    status: "pending"
    notes: "Create PR via GitHub/GitLab: dev/[username]-${appName} → development"
    validate_success: "Pull Request created successfully with proper title and description"
    on_success: "npm run context complete 'Create Pull Request'"
    on_failure: "Check repository permissions, ensure branch is pushed, create PR manually via web interface"

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

// Generate streamlined workflow for simple change requests (cr-v1.x)
function generateSimpleChangeWorkflow(techSpecContent: string, appName: string, crVersion: string | null, workflowType: string): string {
  console.log(`🔧 Generating simple change workflow for ${appName}`);
  console.log(`📋 Creating generic workflow - user will identify specific changes from technical specification`);
  
  const sourceFile = crVersion ? `${appName}-technical-specification-cr-${crVersion}.md` : `${appName}-technical-specification-v1.md`;
  const projectName = crVersion ? `${appName}-cr-${crVersion}` : appName;
  
  let workflowYaml = `# Generated simple change workflow from ${sourceFile}
project: ${projectName}
workflow_type: "${workflowType}"
current_step: 1
created_from: "docs/planning/${appName}/${sourceFile}"
last_updated: "${new Date().toISOString()}"

# Instructions for Claude Code
claude_instructions:
  completion_rule: "ALWAYS run 'npm run context complete '<step name>' immediately after successful step execution"
  failure_rule: "On failure, do NOT mark as complete. Analyze error and fix before proceeding"
  validation_rule: "Steps with 'validate_success' field must pass validation before marking complete"
  general_workflow: |
    Simple Change Request Workflow - streamlined for content and format changes
    Generic workflow that works for any app and any simple modifications
    1. Read the step name and command/action
    2. Execute the command or perform the action
    3. Check validate_success criteria (if present)
    4. If successful: run on_success command to mark complete
    5. If failed: follow on_failure guidance, do NOT mark complete
    6. Move to next step only after current step is successfully completed

steps:
  1:
    name: "Create change request branch"
    command: "npm run git branch ${appName}"
    status: "pending"
    notes: "Create branch: dev/[username]-${appName} for change request"
    validate_success: "Verify branch dev/[username]-${appName} is created and checked out"
    on_success: "npm run context complete 'Create change request branch'"
    on_failure: "Check git status, resolve conflicts, ensure clean working directory, retry"
    
  2:
    name: "Implement code changes"
    action: "manual_edit"
    status: "pending"
    notes: "Review technical specification and implement required changes. Check 'Code Modifications' section for guidance."
    specification_reference: "docs/planning/${appName}/${sourceFile}"
    guidance: "User should identify and modify files according to the technical specification"
    validate_success: "All required code modifications completed as per technical specification"
    on_success: "npm run context complete 'Implement code changes'"
    on_failure: "Review technical specification, fix syntax errors, ensure all changes applied"
    
  3:
    name: "Update unit test expectations"
    action: "manual_edit"
    status: "pending"
    notes: "Update unit tests to match the new behavior/content. Review all affected test files."
    validate_success: "All unit test files updated with new expectations and assertions"
    on_success: "npm run context complete 'Update unit test expectations'"
    on_failure: "Review test files, update assertions, ensure tests match new behavior"
    
  4:
    name: "Run unit tests"
    command: "npm run test app:api ${appName} -- --unittest"
    status: "pending"
    notes: "Ensure all unit tests pass with the changes and maintain >=95% coverage"
    validate_success: "All unit tests pass with >=95% coverage and no failures"
    on_success: "npm run context complete 'Run unit tests'"
    on_failure: "Fix failing unit tests, update test expectations, ensure code works correctly"
    
  5:
    name: "Update API test cases"
    action: "manual_edit"
    status: "pending"
    notes: "Update API test specifications if response format or content changed"
    files: "src/api/${appName}/spec/${appName}.api.spec.yml and any generated test cases"
    validate_success: "API test specifications updated to match new behavior"
    on_success: "npm run generate app:api ${appName} -- --testcases && npm run context complete 'Update API test cases'"
    on_failure: "Review API specification, update test expectations, ensure API tests are accurate"
    
  6:
    name: "Run API integration tests"
    command: "npm run test app:api ${appName} -- --apitest"
    status: "pending"
    notes: "Execute API tests against running server to verify endpoint behavior"
    validate_success: "All API tests pass with correct responses and status codes"
    on_success: "npm run context complete 'Run API integration tests'"
    on_failure: "Start development server, fix endpoint implementations, update API test cases"
    
  7:
    name: "Run compliance testing"
    command: "npm run test app:api ${appName} -- --compliance"
    status: "pending"
    notes: "Verify API compliance against requirements and update config with results"
    validate_success: "Compliance tests pass and config updated with results"
    on_success: "npm run context complete 'Run compliance testing'"
    on_failure: "Review compliance requirements, fix API specification, update implementations"
    
  8:
    name: "Full validation"
    command: "npm run validate app:api ${appName}"
    status: "pending"
    notes: "Run comprehensive validation to ensure all changes meet quality standards"
    validate_success: "All validation checks pass with no errors"
    on_success: "npm run context complete 'Full validation'"
    on_failure: "Review validation errors, fix issues, ensure all quality gates pass"
    
  9:
    name: "Commit change request"
    command: "npm run git -- commit ${appName} --fix"
    status: "pending"
    notes: "Commit changes with conventional commit message (fix for minor changes)"
    validate_success: "Git commit succeeds and shows commit hash"
    on_success: "npm run context complete 'Commit change request'"
    on_failure: "Review git status, fix validation errors, ensure clean working directory, retry commit"
    
  10:
    name: "Push change request for PR"
    command: "npm run git -- push ${appName}"
    status: "pending"
    notes: "Push branch for Pull Request creation"
    validate_success: "Branch pushed successfully to remote repository"
    on_success: "npm run context complete 'Push change request for PR'"
    on_failure: "Check remote repository access, resolve merge conflicts, retry push"

# Git workflow integration
git_workflow:
  branch_structure: "main → development → dev/username-appname"
  branch_strategy: "single change branch: dev/username-appname"
  commit_strategy: "single commit for simple changes with conventional commit message"
  validation_gates: "unit tests, API tests, compliance tests, and validation must pass"
  pr_target: "dev/username-appname → development"
  
# User customizations
user_notes: "Generated simple change workflow for content/format modifications. Comprehensive testing included."
`;

  return workflowYaml;
}

// Extract file changes from technical specification
function extractFileChangesFromTechSpec(techSpecContent: string): { file: string; description: string }[] {
  const changes: { file: string; description: string }[] = [];
  
  // Look for "Code Modifications" or "Files to Modify" sections
  const codeModsMatch = techSpecContent.match(/### Code Modifications[\s\S]*?(?=###|##|$)/);
  const filesToModifyMatch = techSpecContent.match(/### Files to Modify[\s\S]*?(?=###|##|$)/);
  
  const relevantSection = codeModsMatch || filesToModifyMatch;
  
  if (relevantSection) {
    const sectionText = relevantSection[0];
    
    // Pattern 1: "- File: `path/to/file.ts` - description"
    const filePattern1 = /- `([^`]+)` - ([^\n]+)/g;
    let match;
    while ((match = filePattern1.exec(sectionText)) !== null) {
      changes.push({
        file: match[1],
        description: match[2].trim()
      });
    }
    
    // Pattern 2: "**File:** `path/to/file.ts`" followed by description
    const filePattern2 = /\*\*[^*]+\*\*[^`]*`([^`]+)`[^\n]*\n[^-]*- [^:]*: ([^\n]+)/g;
    while ((match = filePattern2.exec(sectionText)) !== null) {
      changes.push({
        file: match[1],
        description: match[2].trim()
      });
    }
    
    // Pattern 3: Simple file listing format from our CR doc
    const lines = sectionText.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('File:') && line.includes('`')) {
        const fileMatch = line.match(/File: `([^`]+)`/);
        if (fileMatch && i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine.includes('Line:') || nextLine.includes('Change:')) {
            changes.push({
              file: fileMatch[1],
              description: nextLine
            });
          }
        }
      }
    }
  }
  
  // If no specific changes found, add a generic note
  if (changes.length === 0) {
    changes.push({
      file: "See technical specification for specific files",
      description: "Refer to Code Modifications section in technical specification"
    });
  }
  
  console.log(`  📝 Found ${changes.length} file changes to implement`);
  changes.forEach(change => {
    console.log(`     - ${change.file}: ${change.description}`);
  });
  
  return changes;
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
  
  if (args.length < 1) {
    showHelp();
    return;
  }

  const command = args[0];
  const target = args[1];
  const options = parseOptions(args.slice(2));
  
  // Special handling for commands that don't require a target
  const noTargetCommands = ['secrets', 'tokens'];
  const requireTargetCommands = ['prisma', 'workflow', 'app:api'];
  
  if (noTargetCommands.includes(command)) {
    if (args.length < 1) {
      showHelp();
      return;
    }
  } else if (args.length < 2) {
    showHelp();
    return;
  }
  
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
        
      case 'secrets':
        await generateSecrets(options);
        break;
        
      case 'tokens':
        await generateTokens(options);
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

  // Determine validation level from flags (essential is default)
  let validationLevel = 'essential';
  if (options.none) {
    validationLevel = 'none';
  } else if (options.basic) {
    validationLevel = 'basic';
  } else if (options.essential) {
    validationLevel = 'essential';
  } else if (options.strict) {
    validationLevel = 'strict';
  }
  // If multiple flags are provided, precedence is: none > basic > essential > strict

  const templateVars: TemplateVars = {
    APP_NAME: appName,
    APP_NAME_UPPER: appName.toUpperCase(),
    FEATURE_NAME: featureName,
    FEATURE_NAME_PASCAL: toPascalCase(featureName),
    CREATED_DATE: new Date().toISOString().split('T')[0],
    VALIDATION_LEVEL: validationLevel,
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
  console.log(`🎯 Validation Level: ${validationLevel} ${getValidationLevelDescription(validationLevel)}`);
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
      case '--none':
        options.none = true;
        break;
      case '--basic':
        options.basic = true;
        break;
      case '--essential':
        options.essential = true;
        break;
      case '--strict':
        options.strict = true;
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

function getValidationLevelDescription(level: string): string {
  switch (level) {
    case 'none':
      return '(prototyping - no validation)';
    case 'basic':
      return '(startups - endpoints only)';
    case 'strict':
      return '(enterprise - full validation)';
    default:
      return '';
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

// Generate all secrets for .env file
async function generateSecrets(options: GenerateOptions = {}): Promise<void> {
  console.log('🔐 Generating Application Secrets');
  
  const mainEnvPath = join(__dirname, '..', '.env');
  const crypto = await import('crypto');
  
  // Generate secure random secrets
  const authSecret = crypto.randomBytes(32).toString('hex');
  const csrfSecret = crypto.randomBytes(16).toString('hex');
  const encryptionKey = crypto.randomBytes(32).toString('hex');
  
  console.log('✅ Generated secure random secrets');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Auth Secret:', authSecret.substring(0, 16) + '...');
  console.log('🔑 CSRF Secret:', csrfSecret.substring(0, 16) + '...');
  console.log('🔑 Encryption Key:', encryptionKey.substring(0, 16) + '...');
  console.log('');
  
  // Check if .env exists and has secrets
  let envExists = existsSync(mainEnvPath);
  let hasSecrets = false;
  
  if (envExists) {
    const envContent = readFileSync(mainEnvPath, 'utf-8');
    hasSecrets = envContent.includes('VOILA_AUTH_SECRET') || 
                 envContent.includes('VOILA_SECURITY_CSRF_SECRET') ||
                 envContent.includes('VOILA_SECURITY_ENCRYPTION_KEY');
  }
  
  // Safety check
  if (hasSecrets && !options.overwrite) {
    console.log('🛑 SECRETS ALREADY EXIST IN .env');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚨 SAFETY HALT - Preventing accidental secret overwrite');
    console.log('');
    console.log('✅ To regenerate with new secrets:');
    console.log('   npm run generate secrets -- --overwrite');
    console.log('');
    console.log('⚠️  This will invalidate all existing tokens');
    throw new Error('Secrets already exist - use --overwrite flag to regenerate');
  }
  
  // Create/update .env file
  let envContent = '';
  if (envExists && !options.overwrite) {
    envContent = readFileSync(mainEnvPath, 'utf-8');
  } else if (envExists && options.overwrite) {
    // Remove existing secrets and recreate
    envContent = readFileSync(mainEnvPath, 'utf-8')
      .replace(/VOILA_AUTH_SECRET=.*/g, '')
      .replace(/VOILA_SECURITY_CSRF_SECRET=.*/g, '')
      .replace(/VOILA_SECURITY_ENCRYPTION_KEY=.*/g, '')
      .replace(/\n\n+/g, '\n\n'); // Clean up extra newlines
  }
  
  // Add new secrets
  const secretsSection = `
# VoilaJSX Application Secrets (Generated: ${new Date().toISOString()})
VOILA_AUTH_SECRET=${authSecret}
VOILA_SECURITY_CSRF_SECRET=${csrfSecret}
VOILA_SECURITY_ENCRYPTION_KEY=${encryptionKey}
`;
  
  const finalContent = envContent + secretsSection;
  await fs.writeFile(mainEnvPath, finalContent, 'utf-8');
  
  console.log('📁 File Status:');
  if (options.overwrite) {
    console.log('   🔄 Updated .env with new secrets');
  } else {
    console.log('   ✅ Added secrets to .env');
  }
  
  console.log('');
  console.log('🚀 Secrets Setup Complete!');
  console.log('   📂 Location: .env (main environment file)');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   npm run generate tokens  # Generate all test tokens');
}

// Load environment variables from .env
async function loadEnvVars(): Promise<Record<string, string>> {
  const mainEnvPath = join(__dirname, '..', '.env');
  
  if (!existsSync(mainEnvPath)) {
    console.error('❌ Environment file not found: .env');
    console.error('   Run first: npm run generate secrets');
    throw new Error('Environment configuration required');
  }
  
  const envContent = readFileSync(mainEnvPath, 'utf-8');
  const envVars: Record<string, string> = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

// Create JWT manually using Node.js crypto
async function createJWT(payload: any, secret: string, expiresIn: string = '7d'): Promise<string> {
  const crypto = await import('crypto');
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  // Calculate expiration
  const now = Math.floor(Date.now() / 1000);
  let exp = now + (7 * 24 * 60 * 60); // 7 days default
  
  if (expiresIn.endsWith('d')) {
    const days = parseInt(expiresIn.slice(0, -1));
    exp = now + (days * 24 * 60 * 60);
  } else if (expiresIn.endsWith('h')) {
    const hours = parseInt(expiresIn.slice(0, -1));
    exp = now + (hours * 60 * 60);
  } else if (expiresIn.endsWith('y')) {
    const years = parseInt(expiresIn.slice(0, -1));
    exp = now + (years * 365 * 24 * 60 * 60);
  }
  
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: exp
  };
  
  // Encode header and payload
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  
  // Create signature
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Generate all test tokens at once
async function generateTokens(options: GenerateOptions = {}): Promise<void> {
  console.log('🔐 Generating All Test Tokens');
  
  const envVars = await loadEnvVars();
  const authSecret = envVars.VOILA_AUTH_SECRET;
  
  if (!authSecret) {
    console.error('❌ VOILA_AUTH_SECRET not found in .env');
    console.error('   Run first: npm run generate secrets');
    throw new Error('Auth secret required');
  }
  
  console.log('✅ Auth secret loaded from .env');
  
  // Initialize AppKit auth for proper token generation
  process.env.VOILA_AUTH_SECRET = authSecret;
  const { authClass } = await import('@voilajsx/appkit/auth');
  const auth = authClass.get();
  
  console.log('✅ AppKit auth initialized');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Define all 9 test users as per AppKit role hierarchy
  // admin.system > admin.org > admin.tenant > moderator.manage > moderator.approve > moderator.review > user.max > user.pro > user.basic
  const testUsers = [
    // Admin levels (highest permissions)
    { username: 'admin_system', role: 'admin', level: 'system', type: 'login', expires: '7d' },
    { username: 'admin_org', role: 'admin', level: 'org', type: 'login', expires: '7d' },
    { username: 'admin_tenant', role: 'admin', level: 'tenant', type: 'login', expires: '7d' },
    
    // Moderator levels (medium permissions)
    { username: 'moderator_manage', role: 'moderator', level: 'manage', type: 'login', expires: '7d' },
    { username: 'moderator_approve', role: 'moderator', level: 'approve', type: 'login', expires: '7d' },
    { username: 'moderator_review', role: 'moderator', level: 'review', type: 'login', expires: '7d' },
    
    // User levels (basic permissions)
    { username: 'user_max', role: 'user', level: 'max', type: 'login', expires: '7d' },
    { username: 'user_pro', role: 'user', level: 'pro', type: 'login', expires: '7d' },
    { username: 'user_basic', role: 'user', level: 'basic', type: 'login', expires: '7d' }
  ];
  
  const apiServices = [
    { keyId: 'webhook_service', role: 'admin', level: 'system', type: 'api', expires: '1y' }
  ];
  
  // Generate tokens and save to .env.auth for testing
  const authEnvPath = join(__dirname, '..', '.env.auth');
  let tokenList = `# Test Tokens - Generated: ${new Date().toISOString()}
# Use these tokens for testing authentication in all apps and features
# Format: USERNAME=TOKEN_VALUE

# ========================================
# LOGIN TOKENS (User Authentication)
# ========================================
`;

  // API tokens section will be added after login tokens
  
  console.log('\n📋 TEST TOKENS GENERATED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('| USERNAME          | ROLE      | LEVEL   | TYPE  |');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Generate login tokens using AppKit auth
  for (const user of testUsers) {
    const token = auth.generateLoginToken({
      userId: user.username,
      role: user.role,
      level: user.level,
    }, user.expires);
    
    console.log(`| ${user.username.padEnd(17)} | ${user.role.padEnd(9)} | ${user.level.padEnd(7)} | ${user.type.padEnd(5)} |`);
    tokenList += `${user.username.toUpperCase()}=${token}\n`;
  }
  
  // Add API tokens section separator
  tokenList += `
# ========================================
# API TOKENS (Service Authentication)
# ========================================
`;
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Generate API tokens using AppKit auth
  for (const service of apiServices) {
    const token = auth.generateApiToken({
      keyId: service.keyId,
      role: service.role,
      level: service.level,
    }, service.expires);
    
    console.log(`| ${service.keyId.padEnd(17)} | ${service.role.padEnd(9)} | ${service.level.padEnd(7)} | ${service.type.padEnd(5)} |`);
    tokenList += `${service.keyId.toUpperCase()}_API_TOKEN=${token}\n`;
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Save tokens to .env.auth for easy testing
  await fs.writeFile(authEnvPath, tokenList, 'utf-8');
  
  console.log('\n📁 Tokens saved to .env.auth for testing');
  console.log('   💡 Use these environment variables for testing');
  console.log('   🔄 Tokens regenerate each time you run this command');
  
  console.log('\n📋 AVAILABLE TOKENS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('LOGIN TOKENS (9 combinations):');
  console.log('  • ADMIN_SYSTEM, ADMIN_ORG, ADMIN_TENANT');
  console.log('  • MODERATOR_MANAGE, MODERATOR_APPROVE, MODERATOR_REVIEW');
  console.log('  • USER_MAX, USER_PRO, USER_BASIC');
  console.log('');
  console.log('API TOKENS:');
  console.log('  • WEBHOOK_SERVICE_API_TOKEN');
  console.log('');
  console.log('💡 Load tokens: source .env.auth');
  console.log('💡 Use tokens for testing authentication in any app/feature');
}


function showHelp() {
  console.log(`
🏗️  Voila Generator - API Structure, Test Cases & Auth Tokens

USAGE:
  npm run generate <command> [target] [-- options]

COMMANDS:
  app:api <app-name>              Generate new API application structure (default)
  app:api <app-name>/<feature>    Generate new feature within existing app
  workflow <app-name>             Generate workflow from approved tech specification


AUTHENTICATION SETUP (Simple 2-step):
  secrets                         Generate all secrets (JWT, CSRF, encryption) in .env
  tokens                          Generate all test tokens with user roles in .env.auth

GENERATION TYPES:
  --application                   Generate application structure (default if no flags)
  --testcases                     Generate API test cases from specifications

VALIDATION LEVELS (for features only):
  --strict                        Full validation - enterprise
  --essential                     Core validation - recommended (default)  
  --basic                         Endpoints only - rapid prototyping
  --none                          No validation - quick testing

EXAMPLES:
  npm run generate app:api user                         # Generate user API app (default)
  npm run generate app:api user -- --application       # Generate user API app explicitly
  npm run generate app:api user -- --testcases         # Generate API test cases for user
  npm run generate app:api user/profile                # Add profile feature (essential validation)
  npm run generate app:api user/profile -- --basic     # Add profile feature (basic validation)
  npm run generate app:api user/profile -- --strict    # Add profile feature (strict validation)
  npm run generate app:api user/profile -- --none      # Add profile feature (no validation)
  npm run generate app:api shop/cart -- --overwrite    # Overwrite existing cart feature
  npm run generate workflow converter                   # Generate workflow from tech spec
  
  
  # Authentication Setup (simple 2-step):
  npm run generate secrets                              # Step 1: Generate secrets in .env
  npm run generate tokens                               # Step 2: Generate all test tokens

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