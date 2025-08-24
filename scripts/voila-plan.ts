#!/usr/bin/env tsx

/**
 * Voila Planning Script - Agentic planning workflow with human control
 * Usage: npx tsx scripts/voila-plan.ts [command] [app-name] [description]
 * Examples:
 *   npx tsx scripts/voila-plan.ts start greeting "multi-language greeting app"
 *   npx tsx scripts/voila-plan.ts review greeting
 *   npx tsx scripts/voila-plan.ts approve greeting
 */

import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import readline from 'readline';
import { VoilaWorkflow } from './voila-context.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PlanningContext {
  appName: string;
  description: string;
  businessQuestions: Question[];
  businessAnswers: Answer[];
  approved: {
    businessRequirements: boolean;
    technicalSpecification: boolean;
  };
  version: string;
}

interface Question {
  id: string;
  question: string;
  category: 'purpose' | 'users' | 'features' | 'constraints';
}

interface Answer {
  questionId: string;
  answer: string;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    showHelp();
    return;
  }

  const command = args[0];
  const appName = args[1];
  const description = args[2];
  
  console.log('📋 Voila Planning Assistant');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    switch (command) {
      case 'start':
        if (!description) {
          console.error('❌ Description is required for start command');
          console.error('   Example: npm run plan start greeting "multi-language greeting app"');
          process.exit(1);
        }
        await startPlanning(appName, description);
        break;
      case 'review':
        await reviewPlan(appName);
        break;
      case 'approve':
        await approvePlan(appName);
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error: any) {
    console.error('💥 Planning error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function startPlanning(appName: string, description: string): Promise<void> {
  console.log(`📝 Starting planning for: ${appName}`);
  console.log(`💡 Description: ${description}`);
  console.log('');

  // Create planning directory
  const planningDir = join(__dirname, '..', 'docs', 'planning', appName);
  if (!existsSync(planningDir)) {
    mkdirSync(planningDir, { recursive: true });
  }

  console.log('📋 Generating template files for completion...');
  
  // Generate template files with placeholder sections
  const businessTemplate = generateBusinessRequirementsTemplate(appName, description);
  const technicalTemplate = generateTechnicalSpecificationTemplate(appName, description);
  
  await fs.writeFile(
    join(planningDir, `${appName}-business-requirements-v1.md`),
    businessTemplate,
    'utf-8'
  );

  await fs.writeFile(
    join(planningDir, `${appName}-technical-specification-v1.md`),
    technicalTemplate,
    'utf-8'
  );

  // No need for planning context JSON - approval status is in the documents

  console.log('\n✅ Planning template files generated!');
  console.log(`📂 Location: docs/planning/${appName}/`);
  console.log('');
  console.log('📝 Files created:');
  console.log(`   • ${appName}-business-requirements-v1.md`);
  console.log(`   • ${appName}-technical-specification-v1.md`);
  console.log('');
  console.log('📝 Next steps:');
  console.log(`   1. Complete the [FILL_IN] sections in both files`);
  console.log(`   2. Change STATUS: UNDER_REVIEW to STATUS: APPROVED in both files`);
  console.log(`   3. Generate app structure: npm run generate app:api ${appName}`);
  console.log(`   4. Start development: npm run dev:api`);

  // Log state
  VoilaWorkflow.logAction('plan_start', `Started planning for '${appName}' app - business requirements and technical spec templates generated`, {
    currentApp: appName,
    phase: 'planning',
    nextSteps: [
      `Complete [FILL_IN] sections in docs/planning/${appName}/`,
      `Change STATUS: UNDER_REVIEW to STATUS: APPROVED in both files`,
      `Run: npm run generate app:api ${appName}`
    ],
    context: {
      planning: {
        businessRequirementsCompleted: false,
        technicalSpecCompleted: false,
        approved: false
      }
    }
  });
}

async function reviewPlan(appName: string): Promise<void> {
  console.log(`📋 Planning Review: ${appName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const planningDir = join(__dirname, '..', 'docs', 'planning', appName);
  
  if (!existsSync(planningDir)) {
    console.error(`❌ No planning found for app: ${appName}`);
    console.error(`   Start planning with: npm run plan start ${appName} "description"`);
    return;
  }

  const businessReqPath = join(planningDir, `${appName}-business-requirements-v1.md`);
  const techSpecPath = join(planningDir, `${appName}-technical-specification-v1.md`);

  if (!existsSync(businessReqPath) || !existsSync(techSpecPath)) {
    console.error('❌ Planning documents not found');
    return;
  }

  // Check approval status in documents
  const businessContent = await fs.readFile(businessReqPath, 'utf-8');
  const techContent = await fs.readFile(techSpecPath, 'utf-8');

  const businessApproved = businessContent.includes('STATUS: APPROVED');
  const techApproved = techContent.includes('STATUS: APPROVED');

  console.log('\n📊 PLANNING STATUS:');
  console.log(`   • App: ${appName}`);
  console.log(`   • Business Requirements: ${businessApproved ? '✅ APPROVED' : '📋 UNDER_REVIEW'}`);
  console.log(`   • Technical Specification: ${techApproved ? '✅ APPROVED' : '📋 UNDER_REVIEW'}`);

  // Check for remaining FILL_IN sections
  const businessFillIns = (businessContent.match(/\[FILL_IN/g) || []).length;
  const techFillIns = (techContent.match(/\[FILL_IN/g) || []).length;

  console.log('\n📝 COMPLETION STATUS:');
  console.log(`   • Business Requirements: ${businessFillIns} [FILL_IN] sections remaining`);
  console.log(`   • Technical Specification: ${techFillIns} [FILL_IN] sections remaining`);

  console.log('\n📁 Documents:');
  console.log(`   • ${appName}-business-requirements-v1.md`);
  console.log(`   • ${appName}-technical-specification-v1.md`);

  if (businessApproved && techApproved) {
    console.log('\n✅ Planning approved! Ready for generation:');
    console.log(`   npm run generate app:api ${appName}`);
  } else {
    console.log('\n📝 Next steps:');
    console.log('   1. Complete remaining [FILL_IN] sections');
    console.log('   2. Change STATUS: UNDER_REVIEW to STATUS: APPROVED in both files');
    console.log(`   3. Generate: npm run generate app:api ${appName}`);
  }
}

async function approvePlan(appName: string): Promise<void> {
  console.log(`✅ Plan Approval: ${appName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const planningDir = join(__dirname, '..', 'docs', 'planning', appName);
  
  if (!existsSync(planningDir)) {
    console.error(`❌ No planning found for app: ${appName}`);
    return;
  }

  const businessReqPath = join(planningDir, `${appName}-business-requirements-v1.md`);
  const techSpecPath = join(planningDir, `${appName}-technical-specification-v1.md`);

  if (!existsSync(businessReqPath) || !existsSync(techSpecPath)) {
    console.error('❌ Planning documents not found');
    return;
  }

  // Auto-approve by changing STATUS in documents
  let businessContent = await fs.readFile(businessReqPath, 'utf-8');
  let techContent = await fs.readFile(techSpecPath, 'utf-8');

  businessContent = businessContent.replace(/STATUS: UNDER_REVIEW/g, 'STATUS: APPROVED');
  techContent = techContent.replace(/STATUS: UNDER_REVIEW/g, 'STATUS: APPROVED');

  await fs.writeFile(businessReqPath, businessContent, 'utf-8');
  await fs.writeFile(techSpecPath, techContent, 'utf-8');

  console.log('\n🎉 Planning approved successfully!');
  console.log('   • Business Requirements: STATUS changed to APPROVED');
  console.log('   • Technical Specification: STATUS changed to APPROVED');
  console.log('');
  console.log('📝 Ready for implementation:');
  console.log(`   npm run generate app:api ${appName}`);

  // Log state
  VoilaWorkflow.logAction('plan_approve', `Planning approved for '${appName}' app - ready for development`, {
    currentApp: appName,
    phase: 'planning',
    nextSteps: [
      `Run: npm run generate app:api ${appName}`,
      `Start feature development`
    ],
    context: {
      planning: {
        businessRequirementsCompleted: true,
        technicalSpecCompleted: true,
        approved: true
      }
    }
  });
}

function generateBusinessQuestions(description: string): Question[] {
  // Claude would generate these based on description, for now we have defaults
  return [
    {
      id: 'Q1',
      question: 'What is the primary business purpose of this application?',
      category: 'purpose'
    },
    {
      id: 'Q2', 
      question: 'Who are the target users and what are their main needs?',
      category: 'users'
    },
    {
      id: 'Q3',
      question: 'What are the core features/capabilities users need?',
      category: 'features'
    },
    {
      id: 'Q4',
      question: 'What are the key business rules or constraints?',
      category: 'constraints'
    },
    {
      id: 'Q5',
      question: 'What defines success for this application?',
      category: 'purpose'
    }
  ];
}

function generateBusinessRequirementsTemplate(appName: string, description: string): string {
  const today = new Date().toISOString().split('T')[0];
  
  return `# Business & Functional Requirements
## ${appName} Application

### Version: v1.0.0
### Last Updated: ${today}

***

## 1. Business Overview

### Purpose
${description}

[FILL_IN: Expand on the business purpose and goals]

### Target Users
[FILL_IN: Who will use this application? What are their characteristics?]

### Success Criteria
[FILL_IN: What defines success for this application?]

***

## 2. User Requirements

### User Stories

[FILL_IN: Complete user stories in format:]
**As a [user type], I want to [action] so that [benefit]**

Example:
- As a user, I want to search weather by city name so that I can get current conditions
- As a user, I want to see temperature only so that I get focused information

### Acceptance Criteria
[FILL_IN: Define what constitutes acceptable functionality:]
- Response time requirements
- Accuracy requirements  
- User interface requirements
- Error handling requirements

***

## 3. Functional Scope

### Core Features
[FILL_IN: List the main features this application must provide]

### API Requirements
[FILL_IN: Define API structure and requirements:]
- Endpoint patterns
- Input/output formats
- Validation rules
- Error responses

### Business Rules
[FILL_IN: Important business logic and constraints]

***

## 4. Constraints & Assumptions

### Technical Constraints
- Must follow Voila framework patterns
- TypeScript for type safety
- Contract-driven development
- Minimum 95% test coverage

### Business Constraints
[FILL_IN: Business limitations, budget, timeline, etc.]

### External Dependencies
[FILL_IN: Third-party services, APIs, etc.]

***

## 5. Timeline & Approval

### Development Timeline
[FILL_IN: Estimated timeline for completion]

### Stakeholder Approval
- Business Requirements: **STATUS: UNDER_REVIEW**
- Technical Specification: **STATUS: UNDER_REVIEW**

**Note:** Complete all [FILL_IN] sections, then change STATUS to APPROVED and run generation.

***
`;
}

function generateTechnicalSpecificationTemplate(appName: string, description: string): string {
  const today = new Date().toISOString().split('T')[0];
  
  return `# Technical Specification
## ${appName} Implementation Guide

### Version: v1.0.0
### Last Updated: ${today}

***

## 1. Application Overview

| Aspect | Specification |
|--------|---------------|
| **Application Name** | ${appName} |
| **Framework** | Voila Framework with Express.js |
| **Language** | TypeScript (strict mode) |
| **Architecture** | Contract-driven development |
| **Deployment** | Single server, microservice-ready |
| **Description** | ${description} |

***

## 2. Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Backend Framework** | Express.js | Web application framework |
| **Language** | TypeScript | Type safety and development experience |
| **Validation** | Zod schemas | Runtime type validation |
| **Testing Framework** | Vitest | Unit and integration testing |
| **API Testing** | Excel-based | Comprehensive API validation |
| **Logging** | VoilaJSX AppKit | Structured application logging |
| **Security** | VoilaJSX AppKit | Input validation and sanitization |

[FILL_IN: Add any additional technologies needed]

***

## 3. Feature Specifications

[FILL_IN: Complete the feature specifications table]

| Feature | Endpoint Pattern | Description | Priority |
|---------|------------------|-------------|----------|
| [FILL_IN] | \`GET /api/${appName}/[endpoint]\` | [FILL_IN] | High |

***

## 4. API Endpoint Requirements

[FILL_IN: Define all API endpoints]

| Endpoint | Method | Input | Output | Validation |
|----------|--------|-------|--------|------------|
| \`/api/${appName}/[endpoint]\` | [METHOD] | [INPUT_SCHEMA] | [OUTPUT_SCHEMA] | [VALIDATION_RULES] |

***

## 5. Data Models & Validation

[FILL_IN: Define all data models and validation rules]

| Model | Schema | Validation Rules |
|-------|--------|------------------|
| **[ModelName]Request** | \`{ field: type }\` | [VALIDATION_RULES] |
| **[ModelName]Response** | \`{ field: type }\` | [VALIDATION_RULES] |

***

## 6. Quality Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| **Test Coverage** | ≥95% | Automated coverage reports |
| **Response Time** | <200ms | Load testing |
| **Error Rate** | <1% | Monitoring dashboards |
| **Uptime** | 99.9% | Health check monitoring |
| **Code Quality** | TypeScript strict mode | Linting and type checking |

[FILL_IN: Add any additional quality requirements]

***

## 7. Component Structure

\`\`\`
src/api/${appName}/
├── features/
│   ├── [feature-name]/
│   │   ├── [feature].routes.ts    # Express routes
│   │   ├── [feature].services.ts  # Business logic
│   │   ├── [feature].types.ts     # Zod schemas & TypeScript types
│   │   ├── [feature].test.ts      # Unit tests
│   │   └── [feature].index.ts     # Feature contract
├── spec/
│   └── ${appName}.api.spec.yml
├── __apitest__/
│   └── ${appName}-api-tests.xlsx
├── ${appName}.config.json
└── ${appName}.readme.md
\`\`\`

[FILL_IN: Customize the structure based on your specific features]

***

## 8. VoilaJSX AppKit Integration

| Component | Import | Usage |
|-----------|--------|-------|
| **Utilities** | \`import { utilClass } from '@voilajsx/appkit/util'\` | Helper functions and utilities |
| **Logging** | \`import { loggerClass } from '@voilajsx/appkit/logger'\` | Structured logging with request IDs |
| **Error Handling** | \`import { errorClass } from '@voilajsx/appkit/error'\` | Centralized error management |
| **Security** | \`import { securityClass } from '@voilajsx/appkit/security'\` | Input validation and sanitization |

[FILL_IN: Add any additional AppKit modules needed]

***

## 9. External Integrations

[FILL_IN: Define external API integrations]

| Service | Purpose | API Details | Error Handling |
|---------|---------|-------------|---------------|
| [API_NAME] | [PURPOSE] | [BASE_URL, AUTH, LIMITS] | [ERROR_STRATEGY] |

***

## 10. Development Workflow

| Phase | Command | Description |
|-------|---------|-------------|
| **Generation** | \`npm run generate app:api ${appName}\` | Create application structure |
| **Development** | \`npm run dev:api\` | Start development server |
| **Validation** | \`npm run validate app:api ${appName}\` | Validate contracts and structure |
| **Testing** | \`npm run test app:api ${appName}\` | Run full test suite |
| **Build** | \`npm run build:api\` | Build for production |

***

## 11. Implementation Notes

[FILL_IN: Important implementation details and considerations]

### Security Considerations
[FILL_IN: Security requirements and implementations]

### Performance Considerations  
[FILL_IN: Performance requirements and optimizations]

### Error Handling Strategy
[FILL_IN: How errors should be handled and reported]

***

## 12. Implementation Workflow

### Feature Implementation Order
**⚠️ CRITICAL: Implement ONE feature at a time in this order:**

[FILL_IN: Define feature implementation sequence]

Example:
1. **core** (Priority: High, Complexity: High)
   - Most complex feature with main business logic
   - Foundation for understanding application patterns
   
2. **secondary** (Priority: High, Complexity: Medium)  
   - Builds on core patterns established
   - Moderate complexity implementation
   
3. **utilities** (Priority: Medium, Complexity: Low)
   - Support functionality
   - Simplest implementation

### Per-Feature Definition of Done
Each feature is complete when:
- [ ] Feature generated (\`npm run generate app:api ${appName}/feature\`)
- [ ] Contract implemented (VoilaFeatureContract with endpoints)
- [ ] Types implemented (Zod schemas + TypeScript interfaces)
- [ ] Services implemented (business logic with error handling)
- [ ] Routes implemented (Express endpoints with validation)
- [ ] Feature validated (\`npm run validate app:api ${appName}/feature\`)
- [ ] Feature tested (\`npm run test app:api ${appName}/feature -- --unittest\`)

### Workflow Rules
- **🛑 STOP**: Complete current feature 100% before starting next
- **✅ GATE**: All validation and tests must pass before proceeding
- **📋 TRACK**: Update workflow status after each completed feature

### LLM Development Instructions
- **@llm-rule SEQUENCE**: Follow the feature order exactly as specified
- **@llm-rule STOP**: Do not generate next feature until current is complete
- **@llm-rule VALIDATE**: Run validation and tests before proceeding
- **@llm-rule WORKFLOW**: Use \`npm run context workflow:next\` to get next step

***

## 13. Implementation Approval

### Technical Review Status
- 📋 Architecture design under review
- 📋 Technology stack pending confirmation  
- 📋 Quality requirements being defined
- 📋 Implementation approach pending validation

### Development Ready
**STATUS: UNDER_REVIEW**

**Note:** Complete all [FILL_IN] sections, then change STATUS to APPROVED and run generation.

***
`;
}

async function generateBusinessRequirements(context: PlanningContext): Promise<string> {
  const today = new Date().toISOString().split('T')[0];
  
  return `# Business & Functional Requirements
## ${context.appName} Application

### Version: v1.0.0
### Last Updated: ${today}

***

## 1. Business Overview

### Purpose
${context.businessAnswers.find(a => a.questionId === 'Q1')?.answer || context.description}

### Target Users
${context.businessAnswers.find(a => a.questionId === 'Q2')?.answer || 'General public users'}

### Success Criteria
${context.businessAnswers.find(a => a.questionId === 'Q5')?.answer || 'User satisfaction and system reliability'}

***

## 2. User Requirements

### User Stories

Based on the requirements analysis, the following user stories define the functional scope:

**As a user, I want to:**
- Access the application without requiring login or authentication
- Receive greeting messages in multiple languages
- Get personalized greetings by providing my name
- Use the application on both web and mobile devices

### Acceptance Criteria
- All features must be accessible without authentication
- Response time must be under 200ms for all requests
- Application must work on modern browsers (Chrome, Firefox, Safari, Edge)
- Error messages must be user-friendly and actionable

***

## 3. Functional Scope

### Core Features
${context.businessAnswers.find(a => a.questionId === 'Q3')?.answer || 'Multi-language greeting functionality'}

### API Requirements
- RESTful API endpoints for all features
- JSON response format with consistent structure
- Proper HTTP status codes for all responses
- Input validation and error handling

### Business Rules
${context.businessAnswers.find(a => a.questionId === 'Q4')?.answer || 'No authentication required, public access'}

***

## 4. Constraints & Assumptions

### Technical Constraints
- Must follow Voila framework patterns and conventions
- TypeScript for type safety
- Contract-driven development approach
- Minimum 95% test coverage

### Business Constraints
- No user authentication or data storage required
- Public application accessible to all users
- Simple and intuitive user interface

***

## 5. Timeline & Approval

### Development Timeline
- Planning: Completed
- Development: 2 weeks
- Testing: 1 week
- Deployment: 3 days

### Stakeholder Approval
- Business Requirements: ✅ Approved
- Ready for technical implementation

***
`;
}

async function generateTechnicalSpecification(context: PlanningContext): Promise<string> {
  const today = new Date().toISOString().split('T')[0];
  
  return `# Technical Specification
## ${context.appName} Implementation Guide

### Version: v1.0.0
### Last Updated: ${today}

***

## 1. Application Overview

| Aspect | Specification |
|--------|---------------|
| **Application Name** | ${context.appName} |
| **Framework** | Voila Framework with Express.js |
| **Language** | TypeScript (strict mode) |
| **Architecture** | Contract-driven development |
| **Deployment** | Single server, microservice-ready |
| **Description** | ${context.description} |

***

## 2. Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Backend Framework** | Express.js | Web application framework |
| **Language** | TypeScript | Type safety and development experience |
| **Validation** | Zod schemas | Runtime type validation |
| **Testing Framework** | Vitest | Unit and integration testing |
| **API Testing** | Excel-based | Comprehensive API validation |
| **Logging** | VoilaJSX AppKit | Structured application logging |
| **Security** | VoilaJSX AppKit | Input validation and sanitization |

***

## 3. Feature Specifications

Based on business requirements, implement these features:

| Feature | Endpoint Pattern | Description | Priority |
|---------|------------------|-------------|----------|
| **Greeting Service** | \`GET /api/${context.appName}/hello\` | Multi-language greetings with personalization | High |
| **Echo Service** | \`POST /api/${context.appName}/echo\` | Message echo functionality | High |
| **Health Check** | \`GET /api/${context.appName}/health\` | Application health monitoring | High |
| **API Documentation** | \`GET /api/${context.appName}/docs\` | Interactive API documentation | Medium |

***

## 4. API Endpoint Requirements

| Endpoint | Method | Input | Output | Validation |
|----------|--------|-------|--------|------------|
| \`/api/${context.appName}/hello\` | GET | \`name?: string, lang?: 'en'\\|'es'\\|'fr'\` | \`{ message: string, language: string }\` | Name max 50 chars |
| \`/api/${context.appName}/echo\` | POST | \`{ message: string }\` | \`{ echo: string }\` | Message max 500 chars |
| \`/api/${context.appName}/health\` | GET | None | \`{ status: 'healthy', timestamp: string }\` | None |

***

## 5. Data Models & Validation

| Model | Schema | Validation Rules |
|-------|--------|------------------|
| **GreetingRequest** | \`{ name?: string, language?: string }\` | Name: optional, max 50 chars; Language: enum ['en', 'es', 'fr'] |
| **GreetingResponse** | \`{ message: string, language: string }\` | Message: required string; Language: required enum |
| **EchoRequest** | \`{ message: string }\` | Message: required, max 500 chars |
| **EchoResponse** | \`{ echo: string }\` | Echo: required string |
| **HealthResponse** | \`{ status: string, timestamp: string }\` | Status: required; Timestamp: ISO string |

***

## 6. Quality Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| **Test Coverage** | ≥95% | Automated coverage reports |
| **Response Time** | <200ms | Load testing |
| **Error Rate** | <1% | Monitoring dashboards |
| **Uptime** | 99.9% | Health check monitoring |
| **Code Quality** | TypeScript strict mode | Linting and type checking |

***

## 7. Component Structure

\`\`\`
src/api/${context.appName}/
├── features/
│   ├── greeting/
│   │   ├── greeting.routes.ts    # Express routes
│   │   ├── greeting.services.ts  # Business logic
│   │   ├── greeting.types.ts     # Zod schemas & TypeScript types
│   │   ├── greeting.test.ts      # Unit tests
│   │   └── greeting.index.ts     # Feature contract
│   └── echo/
│       ├── echo.routes.ts
│       ├── echo.services.ts
│       ├── echo.types.ts
│       ├── echo.test.ts
│       └── echo.index.ts
├── spec/
│   └── ${context.appName}.api.spec.yml
├── __apitest__/
│   └── ${context.appName}-api-tests.xlsx
├── ${context.appName}.config.json
└── ${context.appName}.readme.md
\`\`\`

***

## 8. VoilaJSX AppKit Integration

| Component | Import | Usage |
|-----------|--------|-------|
| **Utilities** | \`import { utilClass } from '@voilajsx/appkit/util'\` | Helper functions and utilities |
| **Logging** | \`import { loggerClass } from '@voilajsx/appkit/logger'\` | Structured logging with request IDs |
| **Error Handling** | \`import { errorClass } from '@voilajsx/appkit/error'\` | Centralized error management |
| **Security** | \`import { securityClass } from '@voilajsx/appkit/security'\` | Input validation and sanitization |

***

## 9. Development Workflow

| Phase | Command | Description |
|-------|---------|-------------|
| **Generation** | \`npm run generate app:api ${context.appName}\` | Create application structure |
| **Development** | \`npm run dev:api\` | Start development server |
| **Validation** | \`npm run validate app:api ${context.appName}\` | Validate contracts and structure |
| **Testing** | \`npm run test app:api ${context.appName}\` | Run full test suite |
| **Build** | \`npm run build:api\` | Build for production |

***

## 10. Monitoring & Operations

| Aspect | Implementation | Tools |
|--------|---------------|-------|
| **Request Logging** | Structured logs with unique IDs | VoilaJSX Logger |
| **Performance Metrics** | Response time tracking | Built-in middleware |
| **Error Tracking** | Centralized error handling | VoilaJSX Error Class |
| **Health Monitoring** | Health check endpoint | Custom health service |
| **API Documentation** | Auto-generated from contracts | Voila Framework |

***

## 11. Implementation Approval

### Technical Review Status
- ✅ Architecture design approved
- ✅ Technology stack confirmed
- ✅ Quality requirements defined
- ✅ Implementation approach validated

### Development Ready
✅ **Technical specification approved**  
✅ **Ready to proceed with implementation**

***
`;
}

async function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${question}\n> `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function askYesNo(question: string): Promise<boolean> {
  const answer = await askQuestion(`${question} (y/n)`);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

function showHelp() {
  console.log(`
📋 Voila Planning Assistant - Simple planning workflow

USAGE:
  npm run plan <command> <app-name> [options]

COMMANDS:
  start <app> "<description>"    Generate planning document templates
  review <app>                   Review planning completion and approval status
  approve <app>                  Auto-approve planning documents (changes STATUS to APPROVED)

EXAMPLES:
  npm run plan start weather "weather application"
  npm run plan review weather
  npm run plan approve weather

SIMPLIFIED WORKFLOW:
  1. start   - Generate planning documents with [FILL_IN] sections
  2. [Edit]  - Complete all [FILL_IN] sections manually
  3. review  - Check completion status and remaining tasks
  4. approve - Change STATUS: UNDER_REVIEW to STATUS: APPROVED (or do manually)
  5. generate - npm run generate app:api <app> (requires approved status)

DOCUMENTS GENERATED:
  docs/planning/{app}/{app}-business-requirements-v1.md
  docs/planning/{app}/{app}-technical-specification-v1.md

APPROVAL MECHANISM:
  • Documents start with STATUS: UNDER_REVIEW
  • Complete [FILL_IN] sections manually
  • Change STATUS to APPROVED (manually or via approve command)
  • Generation blocked until both documents show STATUS: APPROVED
`);
}

main();