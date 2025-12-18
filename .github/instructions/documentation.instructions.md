---
description: 'Documentation standards and guidelines'
applyTo: '**/*.md,**/*.mdx'
---

# Documentation Guidelines

Clear and comprehensive documentation standards for maintaining high-quality project documentation.

## Documentation Philosophy

- Write documentation for humans, not machines
- Keep documentation up-to-date with code changes
- Use clear, concise language
- Provide examples for complex concepts
- Structure information logically and hierarchically

## Types of Documentation

### API Documentation

- Use JSDoc comments for TypeScript/JavaScript functions and classes
- Include parameter types, return types, and examples
- Document error conditions and edge cases
- Use `@param`, `@returns`, `@throws`, `@example` tags appropriately
- Generate API documentation automatically from code comments

### README Files

- Include clear project description and purpose
- Provide installation and setup instructions
- Include usage examples and basic tutorials
- Document prerequisites and dependencies
- Add contributing guidelines and license information

### Code Comments

- Write comments that explain "why," not "what"
- Use comments sparingly for self-explanatory code
- Document complex algorithms and business logic
- Add TODO comments for future improvements
- Keep comments up-to-date with code changes

### Architecture Documentation

- Document overall system architecture and design decisions
- Create architectural decision records (ADRs) for major decisions
- Maintain diagrams for complex systems
- Document data flows and integration points
- Explain design patterns and conventions used

## Markdown Standards

- Use consistent heading hierarchies (H1 for title, H2 for main sections, etc.)
- Use code blocks with appropriate syntax highlighting
- Include table of contents for longer documents
- Use lists and tables for structured information
- Add links to related documentation and external resources

## Code Examples

- Provide working code examples that can be copy-pasted
- Include both basic and advanced usage examples
- Show common error handling patterns
- Include example inputs and expected outputs
- Keep examples up-to-date with current APIs

## Documentation Structure

### Package Documentation

- Each package should have its own README.md
- Include package-specific installation instructions
- Document package APIs and exports
- Provide usage examples specific to the package
- Link to related packages and dependencies

### Project-Level Documentation

- Maintain a comprehensive main README.md
- Include getting started guides
- Document development setup and workflows
- Provide troubleshooting guides
- Maintain changelog and release notes

## Writing Style

- Use active voice where possible
- Write in second person ("you should") for instructions
- Use present tense for descriptions
- Be consistent with terminology
- Avoid jargon without explanation

## Visual Elements

- Use diagrams for complex concepts
- Include screenshots for UI-related documentation
- Use syntax highlighting for code blocks
- Add badges for build status, coverage, etc.
- Use emoji sparingly and consistently

## Maintenance

- Review documentation during code reviews
- Update documentation as part of feature development
- Regular documentation audits and cleanup
- Remove outdated information promptly
- Keep external links current and valid

## Tools and Automation

- Use automated documentation generation where appropriate
- Lint markdown files for consistency
- Check for broken links regularly
- Generate documentation from code comments
- Use documentation templates for consistency

## Accessibility

- Use descriptive alt text for images
- Ensure proper heading structure
- Use meaningful link text
- Provide text alternatives for visual information
- Consider screen reader compatibility

## Localization

- Use clear, simple language for international audiences
- Avoid colloquialisms and cultural references
- Structure content for easy translation
- Consider multiple language versions for key documentation
- Use consistent terminology across all documentation