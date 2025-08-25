# Voila Change Request Process

**Systematic approach for handling any app modification - from small fixes to major features.**

## Philosophy

**Change Requests handle business-driven updates** - when users want something different than what currently exists. Unlike technical bugs, these are functional requirement changes that need proper documentation and workflow generation.

**Two-Document Approach**: Every change request requires both business justification and technical implementation planning, just like initial app development.

## Change Request Types

### **Version Classification**
- **Minor Changes (v1.0 → cr-v1.1)**: Content updates, format changes, small rule modifications
- **Major Changes (v1.0 → cr-v2.0)**: New features, API changes, significant business logic updates

### **Commit Type Mapping**
- **Minor Changes** → `--fix` commit: `fix(appname): description`  
- **Major Changes** → `--feat` commit: `feat(appname): description`

## File Structure

### **Naming Convention**
```
docs/planning/appname/
├── appname-business-requirements-v1.md              # Original specs
├── appname-technical-specification-v1.md           # Original specs
├── appname-business-requirements-cr-v1.1.md        # Change Request Business
├── appname-technical-specification-cr-v1.1.md      # Change Request Technical
├── appname-business-requirements-cr-v1.2.md        # Next Minor Change
├── appname-technical-specification-cr-v1.2.md      # Next Minor Change  
└── appname-business-requirements-cr-v2.0.md        # Major Change Request
```

### **Benefits of This Structure**
- ✅ **Consistent Pattern** - Follows existing Voila documentation format
- ✅ **Clear Identification** - `cr-` prefix clearly marks change requests
- ✅ **Version Progression** - Easy to track v1.0 → cr-v1.1 → cr-v1.2
- ✅ **Tool Compatible** - Existing workflow generation works seamlessly
- ✅ **Alphabetical Sorting** - Files organize naturally in directories

## Complete Workflow

### **Phase 1: Document Change Requirements** 📋

**1.1 Create Business Requirements**
```markdown
# File: docs/planning/appname/appname-business-requirements-cr-v1.1.md
```

**1.2 Create Technical Specification**  
```markdown
# File: docs/planning/appname/appname-technical-specification-cr-v1.1.md
```

**1.3 Set Both to STATUS: APPROVED**
Both documents must have `STATUS: APPROVED` before workflow generation.

### **Phase 2: Generate Implementation Workflow** 🔄

```bash
npm run generate workflow appname               # Reads latest cr-v1.1 technical spec
npm run context status                         # View generated workflow
npm run context next                           # Get first step to execute
```

### **Phase 3: Implement Changes Systematically** 🔧

```bash
npm run git branch appname                      # Switch to dev/username-appname branch

# Follow workflow steps one by one:
npm run context next                           # Get current step
# Execute the step (modify code, update tests, etc.)
npm run context complete "description"         # Mark current step complete
# Repeat until workflow complete

npm run validate app:api appname                # Validate after major changes
```

### **Phase 4: Test & Validate** 🧪

```bash
npm run test app:api appname -- --unittest     # Unit tests with updated expectations  
npm run test app:api appname -- --apitest      # API integration tests (if applicable)
npm run test app:api appname                   # Full test suite
npm run validate app:api appname               # Final contract validation
```

### **Phase 5: Commit & Deploy** 🚀

```bash
# For Minor Changes (cr-v1.x)
npm run git -- commit appname --fix            # fix(appname): description from change request

# For Major Changes (cr-v2.x)  
npm run git -- commit appname --feat           # feat(appname): description from change request

npm run git -- push appname                    # Push dev/username-appname for review
```

## Document Templates

### **Business Requirements Template**

```markdown
# Business Requirements - Change Request v1.1
## [App Name] Application

### Version: cr-v1.1.0
### Base Version: v1.0.0  
### Change Request Date: [YYYY-MM-DD]

***

## 1. Change Overview

### What Changed
[Clear description of functional change requested]

### Business Justification
- [Why this change is needed]
- [User feedback or business driver]
- [Expected benefit or outcome]

### Impact Assessment  
- **User Experience:** [How users will be affected]
- **API Compatibility:** [Breaking changes: Yes/No]
- **Integration Impact:** [Effect on existing clients]

***

## 2. Updated Business Rules

### Modified Requirements
- **Original Rule:** [What the current behavior is]
- **New Rule:** [What the new behavior should be]
- **Example Change:** [Before and after example]

### Acceptance Criteria
- [Specific testable criteria for the change]
- [Performance or quality requirements]
- [Compatibility requirements]

***

## 3. Constraints & Assumptions

### Business Constraints
- [Time, budget, or scope limitations]
- [Must maintain compatibility with existing X]

### Technical Constraints  
- [Must follow Voila framework patterns]
- [Minimum 95% test coverage required]

***

## 4. Approval

**Business Requirements:** **STATUS: [UNDER_REVIEW/APPROVED]**
**Technical Specification:** **STATUS: [PENDING/APPROVED]**

**Note:** Both must be APPROVED before workflow generation.
```

### **Technical Specification Template**

```markdown
# Technical Specification - Change Request v1.1
## [App Name] Application

### Version: cr-v1.1.0
### Base Version: v1.0.0
### Change Request Date: [YYYY-MM-DD]

***

## 1. Technical Changes Required

### Code Modifications
1. **[Component/Service Name]**
   - File: `path/to/file.ts`
   - Lines: [specific lines if known]
   - Change: [specific technical change needed]

2. **Test Updates**
   - File: `path/to/test.ts`
   - Change: [update test expectations/scenarios]

### API Changes (if applicable)
- **Endpoints Modified:** [list affected endpoints]
- **Request/Response Changes:** [detail any format changes]  
- **Breaking Changes:** [Yes/No - list if yes]

***

## 2. Implementation Workflow

### Step-by-Step Plan
1. **[Feature/Change Name]** (Priority: High/Medium/Low, Complexity: High/Medium/Low)
   - [Specific implementation task]
   - [Expected outcome]

2. **Update Tests** (Priority: High, Complexity: Low)
   - Update unit tests for new behavior
   - Add regression tests for the change
   - Ensure 95% coverage maintained

3. **Validation** (Priority: High, Complexity: Low)
   - Run contract validation
   - Execute full test suite  
   - Verify no unintended side effects

### Files to Modify
- `src/api/appname/features/feature/feature.services.ts` - [change description]
- `src/api/appname/features/feature/feature.test.ts` - [test updates]
- `src/api/appname/features/feature/feature.types.ts` - [if schema changes]

***

## 3. Quality Gates

### Validation Requirements
- Contract validation passes (`npm run validate app:api appname`)
- Unit tests achieve 95% coverage
- Integration tests pass (if applicable)
- No TypeScript errors

### Testing Requirements
- All existing tests updated for new behavior
- New test scenarios covering the change
- Regression testing completed  
- Edge case testing performed

***

## 4. Dependencies & Integration

### AppKit Modules Required
- [List AppKit modules: util, logger, error, etc.]

### External Dependencies
- [Any new packages or services needed]

### Integration Points
- [Other features or apps affected by this change]

***

## 5. Approval

**Business Requirements:** **STATUS: [PENDING/APPROVED]**
**Technical Specification:** **STATUS: [UNDER_REVIEW/APPROVED]**

**Note:** Both documents must show STATUS: APPROVED before running workflow generation.
```

## Example: Welcome App Greeting Enhancement

### **Real-World Scenario**
User requests: "Make the greeting more enthusiastic - change 'Hello!' to 'Hello!!'"

### **Business Requirements**
`docs/planning/welcome/welcome-business-requirements-cr-v1.1.md`

```markdown
# Business Requirements - Change Request v1.1  
## Welcome Application

### Version: cr-v1.1.0
### Base Version: v1.0.0
### Change Request Date: 2025-08-25

## 1. Change Overview

### What Changed
Greeting format enhancement from single to double exclamation marks

### Business Justification  
- User feedback requesting more enthusiastic, welcoming tone
- Current "Hello!" feels too formal for our friendly brand
- Double exclamation "Hello!!" conveys more energy and warmth

### Impact Assessment
- **User Experience:** More friendly and engaging greeting
- **API Compatibility:** No breaking changes - response structure unchanged  
- **Integration Impact:** Existing clients continue working normally

## 2. Updated Business Rules

### Modified Requirements
- **Original Rule:** All greetings end with single exclamation mark
- **New Rule:** All greetings end with double exclamation marks  
- **Example Change:** "Hello, World!" → "Hello, World!!"

### Acceptance Criteria
- All greeting endpoints return double exclamation format
- Response JSON structure remains identical
- All existing API contracts continue to work
- Change applies to all greeting messages consistently

## 3. Approval

**Business Requirements:** **STATUS: APPROVED**
**Technical Specification:** **STATUS: APPROVED**
```

### **Technical Specification**
`docs/planning/welcome/welcome-technical-specification-cr-v1.1.md`

```markdown  
# Technical Specification - Change Request v1.1
## Welcome Application

### Version: cr-v1.1.0
### Base Version: v1.0.0
### Change Request Date: 2025-08-25

## 1. Technical Changes Required

### Code Modifications
1. **HelloService**
   - File: `src/api/welcome/features/hello/hello.services.ts`
   - Line: 34
   - Change: `'Hello, World!'` → `'Hello, World!!'`

2. **Test Updates**
   - File: `src/api/welcome/features/hello/hello.test.ts`
   - Line: 66  
   - Change: Update expectation from `'Hello, World!'` to `'Hello, World!!'`

## 2. Implementation Workflow

1. **Update HelloService Message** (Priority: High, Complexity: Low)
   - Modify HelloService.getHelloWorld() method
   - Change greeting message format to include double exclamation

2. **Update Test Expectations** (Priority: High, Complexity: Low)
   - Update unit tests to expect new greeting format
   - Ensure all test scenarios pass with new format

3. **Validation** (Priority: High, Complexity: Low)
   - Run contract validation to ensure no breaking changes
   - Execute full test suite to verify functionality
   - Confirm response structure remains unchanged

## 3. Quality Gates

### Validation Requirements
- Contract validation passes
- Unit tests achieve 95% coverage  
- No TypeScript errors
- No breaking changes introduced

## 4. Approval

**Business Requirements:** **STATUS: APPROVED**
**Technical Specification:** **STATUS: APPROVED**
```

### **Implementation Commands**

```bash
# 1. Generate Workflow (reads cr-v1.1 technical spec)
npm run generate workflow welcome

# 2. Follow Workflow  
npm run context status                          # View progress
npm run context next                            # Get: "Update HelloService Message"

# 3. Implement
npm run git branch welcome                      # Switch to dev/username-welcome
# Edit hello.services.ts line 34: 'Hello, World!' → 'Hello, World!!'
# Edit hello.test.ts line 66: update test expectation

# 4. Validate & Test
npm run validate app:api welcome                # Validate contracts
npm run test app:api welcome -- --unittest     # Unit tests pass

# 5. Commit & Deploy
npm run git -- commit welcome --fix            # fix(welcome): enhance greeting enthusiasm per user feedback
npm run git -- push welcome                    # Push for review
```

## Integration with Existing Voila System

### **Seamless Workflow Generation**
- Change request technical specifications follow exact same format as original specs
- `npm run generate workflow appname` automatically reads latest `cr-v1.x` technical spec  
- Generated workflow includes step-by-step implementation plan
- Progress tracking works identically: `status`, `next`

### **Quality Gates Maintained**
- Same validation requirements: contract validation, 95% test coverage
- Same testing pipeline: unit tests, API tests, compliance tests
- Same commit workflow: conventional commits, validation gates
- Same deployment process: staging, production validation

### **State Management Integration**
- Change requests logged in `.voila/actions.log` for session continuity
- LLM context preserved across sessions with `npm run context state:resume`
- Full audit trail maintained for all changes

## Best Practices

### **Documentation Standards**
- **Be Specific:** Include exact file paths and line numbers when known
- **Business Context:** Always explain why the change is needed
- **Impact Assessment:** Document what will and won't break
- **Version Clearly:** Use consistent cr-v1.x, cr-v2.x naming

### **Implementation Standards**
- **Follow Workflow:** Use generated workflow steps, don't skip ahead
- **Test First:** Update tests before or immediately after code changes
- **Validate Often:** Run validation after each significant change
- **Commit Clearly:** Use conventional commits with descriptive messages

### **Quality Standards**
- **Maintain Coverage:** Keep 95% test coverage throughout changes
- **Preserve Compatibility:** Document and minimize breaking changes  
- **Follow Patterns:** Use AppKit modules and Voila conventions
- **Document Changes:** Update inline code comments for significant logic changes

## Troubleshooting

### **Common Issues**

**Planning Not Approved**
```bash
# Error: Technical specification not approved
# Fix: Edit cr-v1.x files and change STATUS to APPROVED
```

**Workflow Generation Fails**
```bash
# Error: No valid features found in workflow section
# Fix: Ensure technical spec has proper Implementation Workflow section
# Check: Features follow format "1. **feature-name** (Priority: X, Complexity: Y)"
```

**Validation Failures**
```bash
npm run validate app:api appname                # See specific contract errors
# Fix identified issues and retry validation
```

**Test Failures**
```bash
npm run test app:api appname -- --unittest     # See specific test failures  
# Update test expectations or fix implementation
```

### **Command Reference**

**Planning & Documentation**
- Edit business requirements: `docs/planning/appname/appname-business-requirements-cr-v1.1.md`
- Edit technical specification: `docs/planning/appname/appname-technical-specification-cr-v1.1.md`

**Workflow Management**
- Generate workflow: `npm run generate workflow appname`  
- Check status: `npm run context status`
- Get next step: `npm run context next`
- Mark step complete: `npm run context complete "description of what was done"`
- Jump to specific step: `npm run context goto 5`
- Reset project state: `npm run context reset`

**Development**
- Switch branch: `npm run git branch appname`
- Validate changes: `npm run validate app:api appname`
- Run tests: `npm run test app:api appname`

**Deployment**
- Commit changes: `npm run git -- commit appname --fix` (or `--feat`)
- Push for review: `npm run git -- push appname`

## Summary

**Voila Change Requests provide systematic handling of business-driven modifications:**

✅ **Structured Documentation** - Business and technical specifications required  
✅ **Workflow Generation** - Automated step-by-step implementation plans  
✅ **Quality Assurance** - Same validation and testing standards as new development  
✅ **Version Control** - Clear progression tracking with semantic versioning  
✅ **Tool Integration** - Seamless integration with existing Voila commands  

**The result:** Every change request, from small fixes to major features, follows the same rigorous, documented, and validated approach as initial application development.