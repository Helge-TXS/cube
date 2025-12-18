<!-- Based on: https://github.com/github/awesome-copilot/blob/main/instructions/nodejs-javascript-vitest.instructions.md -->
---
description: 'Guidelines for writing Node.js and JavaScript code'
applyTo: '**/*.js,**/*.mjs,**/*.cjs'
---

# Node.js Development Guidelines

## Coding Standards

- Use JavaScript with ES2022 features and Node.js (20+) ESM modules
- Use Node.js built-in modules and avoid external dependencies where possible
- Always use async/await for asynchronous code, and use 'node:util' promisify function to avoid callbacks
- Keep the code simple and maintainable
- Use descriptive variable and function names
- Do not add comments unless absolutely necessary, the code should be self-explanatory
- Never use `null`, always use `undefined` for optional values
- Prefer functions over classes

## Architecture Patterns

- Follow modular design principles
- Use dependency injection for better testability
- Implement proper error handling with meaningful error messages
- Use event-driven architecture where appropriate
- Implement proper logging and monitoring
- Follow RESTful API design principles for HTTP services

## Performance Considerations

- Use streaming for large data processing
- Implement proper caching strategies
- Use connection pooling for database connections
- Implement rate limiting for API endpoints
- Use compression for HTTP responses
- Monitor memory usage and prevent memory leaks

## Security Best Practices

- Validate and sanitize all input data
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use HTTPS for all external communications
- Keep dependencies up to date
- Never hardcode secrets or credentials
- Use environment variables for configuration

## Error Handling

- Use proper error handling with try/catch blocks
- Create custom error classes for specific error types
- Implement proper error logging
- Return meaningful error messages to clients
- Use error-first callbacks when appropriate
- Handle unhandled promise rejections and exceptions

## Testing

- Write tests for all new features and bug fixes
- Ensure tests cover edge cases and error handling
- Use Jest or similar testing frameworks
- Mock external dependencies in tests
- Write integration tests for API endpoints
- Maintain high test coverage

## Documentation

- When adding new features or making significant changes, update the README.md file where necessary
- Document API endpoints with proper examples
- Include JSDoc comments for complex functions
- Maintain up-to-date API documentation

## Package Management

- Use yarn for package management in this monorepo
- Keep dependencies minimal and well-maintained
- Regularly audit dependencies for security vulnerabilities
- Use exact versions for critical dependencies
- Document any peer dependencies