---
description: 'Testing standards and best practices for the project'
applyTo: '**/*.test.ts,**/*.test.js,**/*.spec.ts,**/*.spec.js'
---

# Testing Guidelines

Comprehensive testing standards for ensuring code quality and reliability.

## Testing Philosophy

- Write tests that verify behavior, not implementation details
- Prefer integration tests over unit tests where it makes sense
- Test edge cases and error scenarios
- Keep tests simple, focused, and readable
- Use descriptive test names that explain the expected behavior

## Test Structure

- Name test files with `.test.ts`, `.test.js`, `.spec.ts`, or `.spec.js` suffix
- Place test files next to the code they test or in dedicated `__tests__` directories
- Use nested describe blocks to organize related tests
- Follow the pattern: `describe('Component/Function/Class', () => { it('should do something', () => {}) })`

## Jest Configuration

- Use Jest as the primary testing framework
- Configure Jest with appropriate test environments (node for backend, jsdom for frontend)
- Use Jest's built-in mocking capabilities
- Set up proper test coverage reporting
- Configure test timeouts appropriately

## Effective Mocking

- Mock external dependencies (APIs, databases, etc.) to isolate your tests
- Use `jest.mock()` for module-level mocks
- Use `jest.spyOn()` for specific function mocks
- Use `mockImplementation()` or `mockReturnValue()` to define mock behavior
- Reset mocks between tests with `jest.resetAllMocks()` in `afterEach`

## Testing Async Code

- Always return promises or use async/await syntax in tests
- Use `resolves`/`rejects` matchers for promises
- Set appropriate timeouts for slow tests with `jest.setTimeout()`
- Mock timers when testing time-dependent code

## Testing React Components

- Use React Testing Library over Enzyme for testing components
- Test user behavior and component accessibility
- Query elements by accessibility roles, labels, or text content
- Use `userEvent` over `fireEvent` for more realistic user interactions
- Test component props and state changes through user interactions

## API and Integration Testing

- Test API endpoints with actual HTTP requests
- Use test databases or proper test data fixtures
- Test error scenarios and edge cases
- Verify response formats and status codes
- Test authentication and authorization flows

## Performance Testing

- Test performance-critical code paths
- Use performance benchmarks for optimization verification
- Test memory usage and prevent memory leaks
- Monitor bundle sizes in frontend applications

## Test Data Management

- Use factories or builders for test data creation
- Keep test data minimal and focused
- Use meaningful test data that reflects real-world scenarios
- Clean up test data after tests complete

## Common Jest Matchers

- Basic: `expect(value).toBe(expected)`, `expect(value).toEqual(expected)`
- Truthiness: `expect(value).toBeTruthy()`, `expect(value).toBeFalsy()`
- Numbers: `expect(value).toBeGreaterThan(3)`, `expect(value).toBeLessThanOrEqual(3)`
- Strings: `expect(value).toMatch(/pattern/)`, `expect(value).toContain('substring')`
- Arrays: `expect(array).toContain(item)`, `expect(array).toHaveLength(3)`
- Objects: `expect(object).toHaveProperty('key', value)`
- Exceptions: `expect(fn).toThrow()`, `expect(fn).toThrow(Error)`
- Mock functions: `expect(mockFn).toHaveBeenCalled()`, `expect(mockFn).toHaveBeenCalledWith(arg1, arg2)`

## Test Organization

- Group related tests using describe blocks
- Use beforeEach/afterEach for test setup and cleanup
- Use beforeAll/afterAll for expensive setup operations
- Keep tests independent of each other
- Run tests in parallel when possible

## Error Testing

- Test error conditions and exception handling
- Verify error messages and error types
- Test recovery scenarios
- Mock network failures and external service errors

## Snapshot Testing

- Use snapshot tests sparingly for stable components
- Review snapshot changes carefully
- Keep snapshots small and focused
- Update snapshots only when changes are intentional

## Test Coverage

- Maintain high test coverage (aim for >80%)
- Focus on critical code paths
- Don't chase 100% coverage at the expense of test quality
- Use coverage reports to identify untested code

## Continuous Integration

- Run all tests in CI/CD pipelines
- Fail builds on test failures
- Run tests on multiple Node.js versions if applicable
- Include linting and type checking in test suites

## Testing Best Practices

- Write tests before fixing bugs (TDD approach when appropriate)
- Keep tests fast and reliable
- Use clear and descriptive test names
- Test one thing at a time
- Make tests easy to debug when they fail
- Regularly review and refactor test code
- Document complex test scenarios