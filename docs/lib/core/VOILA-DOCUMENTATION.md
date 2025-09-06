# VoilaJSX - Documentation Generation

## Why Clear Comments Matter

Clear documentation is essential for:
- **AI-Assisted Development**: LLMs understand your codebase better
- **Team Collaboration**: New developers onboard faster
- **Code Maintenance**: Understand complex logic months later
- **API Documentation**: Auto-generated docs stay current

## Documentation Generation

VoilaJSX uses TypeDoc to generate comprehensive documentation from TSDoc comments.

### Generate Documentation

```bash
# Generate documentation
npm run doc

# Generate and open in browser
npm run doc -- --open
npm run doc -- -o

# Open existing documentation
npm run doc open

# Get help
npm run doc -- --help
```

**Output**: `docs/typedocs/` directory with HTML documentation

### Basic Example

```typescript
/**
 * User authentication service with session management
 * @file src/api/auth/auth.service.ts
 * 
 * @llm-rule WHEN: Need secure user authentication with JWT tokens
 * @llm-rule AVOID: Storing passwords in plain text
 * @llm-rule PATTERN: Hash passwords, validate tokens, return user data
 * 
 * Handles user login, registration, and session management with
 * secure password hashing and JWT token validation.
 */

/**
 * Authenticate user credentials and generate JWT token
 * 
 * @param email - User email address
 * @param password - Plain text password
 * @returns Promise resolving to authentication result
 * @throws {UnauthorizedError} When credentials are invalid
 * 
 * @example
 * ```typescript
 * const result = await authenticateUser('user@example.com', 'password123');
 * if (result.success) {
 *   console.log('Token:', result.token);
 * }
 * ```
 */
export async function authenticateUser(
  email: string, 
  password: string
): Promise<AuthResult> {
  // Implementation...
}
```

## What Gets Generated

- **API Reference**: All exported functions, classes, interfaces
- **File Structure**: Navigate by module and file
- **Cross-References**: Links between related functions
- **Examples**: Code samples from `@example` blocks
- **Search**: Find functions and types quickly

## Best Practices

1. **Document Public APIs**: Focus on exported functions and classes
2. **Include Examples**: Show real usage with `@example`
3. **Explain Business Logic**: Use `@llm-rule` for complex decisions
4. **Keep Updated**: Documentation should match current code

---

**Quick Start**: Add TSDoc comments to your functions, then run `npm run doc` to generate documentation.