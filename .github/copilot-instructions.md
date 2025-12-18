# Cube.js GitHub Copilot Instructions

This repository contains comprehensive GitHub Copilot configuration for the Cube.js analytics platform.

## Project Overview

Cube.js is a comprehensive analytics platform that provides:
- Multi-language client libraries (React, Vue, Angular, Core JS)
- Multiple database drivers and connectors
- Query orchestration and caching
- REST and WebSocket APIs
- Analytics dashboards and visualizations

## Technology Stack

- **Frontend**: TypeScript, React, Vue, Angular
- **Backend**: Node.js, TypeScript
- **Systems**: Rust (Cubestore, native utilities)
- **Testing**: Jest, testing frameworks
- **Build**: Lerna monorepo, Rollup, TypeScript
- **Package Management**: Yarn workspaces

## Architecture Principles

1. **Modular Design**: Each package serves a specific purpose
2. **Type Safety**: Strong TypeScript usage throughout
3. **Performance**: Optimized query execution and caching
4. **Extensibility**: Plugin architecture for drivers and extensions
5. **Developer Experience**: Comprehensive APIs and documentation

## Code Quality Standards

- Follow existing code patterns within each package
- Maintain backward compatibility for public APIs
- Use descriptive naming for functions and variables
- Write comprehensive tests for new features
- Document complex logic and public interfaces
- Follow the established error handling patterns

## File Organization

- Package-specific code goes in `packages/[package-name]/`
- Shared utilities in appropriate shared packages
- Tests alongside source code or in `__tests__` directories
- Documentation in package README files

## Getting Started

Before contributing:
1. Run `yarn install` from the project root
2. Run `yarn tsc` to ensure TypeScript compilation
3. Run tests with `yarn test` in relevant packages
4. Follow the contribution guidelines in CONTRIBUTING.md

## Specialized Instructions

Refer to specific instruction files in `.github/instructions/` for:
- [TypeScript Development](instructions/typescript.instructions.md)
- [React Development](instructions/react.instructions.md)
- [Node.js Development](instructions/nodejs.instructions.md)
- [Rust Development](instructions/rust.instructions.md)
- [Testing Standards](instructions/testing.instructions.md)
- [Documentation Guidelines](instructions/documentation.instructions.md)
- [Security Best Practices](instructions/security.instructions.md)
- [Performance Optimization](instructions/performance.instructions.md)
- [Code Review Standards](instructions/code-review.instructions.md)

## Useful Prompts

Use specialized prompts in `.github/prompts/` for:
- [Component Setup](prompts/setup-component.prompt.md)
- [Test Writing](prompts/write-tests.prompt.md)
- [Code Review](prompts/code-review.prompt.md)
- [Refactoring](prompts/refactor-code.prompt.md)
- [Documentation](prompts/generate-docs.prompt.md)
- [Debugging](prompts/debug-issue.prompt.md)

## Chat Modes

Use specialized agents in `.github/agents/` for:
- [Architecture Planning](agents/architect.agent.md)
- [Code Review Mode](agents/reviewer.agent.md)
- [Debugging Mode](agents/debugger.agent.md)