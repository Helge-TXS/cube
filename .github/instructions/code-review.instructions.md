---
description: 'Code review standards and GitHub review guidelines'
applyTo: '**/*'
---

# Code Review Guidelines

Standards for conducting effective and constructive code reviews to maintain code quality and knowledge sharing.

## Code Review Philosophy

- Reviews are about learning and improving, not finding fault
- Focus on the code, not the person
- Be constructive and provide actionable feedback
- Praise good practices and clever solutions
- Share knowledge and alternative approaches
- Maintain a respectful and collaborative tone

## Review Checklist

### Functionality
- [ ] Does the code do what it's supposed to do?
- [ ] Are edge cases handled appropriately?
- [ ] Is error handling implemented correctly?
- [ ] Are the requirements fully met?
- [ ] Does the code work as expected?

### Code Quality
- [ ] Is the code readable and well-structured?
- [ ] Are naming conventions followed consistently?
- [ ] Is the code properly modularized?
- [ ] Are functions and classes appropriately sized?
- [ ] Is there appropriate separation of concerns?

### Testing
- [ ] Are there adequate tests for new functionality?
- [ ] Do tests cover edge cases and error scenarios?
- [ ] Are existing tests still passing?
- [ ] Is test coverage maintained or improved?
- [ ] Are integration tests included where appropriate?

### Security
- [ ] Is user input properly validated and sanitized?
- [ ] Are authentication and authorization handled correctly?
- [ ] Are sensitive data and secrets protected?
- [ ] Are security best practices followed?
- [ ] Are dependencies secure and up-to-date?

### Performance
- [ ] Are there any obvious performance issues?
- [ ] Is the code efficient for the expected load?
- [ ] Are database queries optimized?
- [ ] Is caching used appropriately?
- [ ] Are resources properly managed?

### Documentation
- [ ] Is the code self-documenting with clear names?
- [ ] Are complex algorithms explained with comments?
- [ ] Is API documentation updated if needed?
- [ ] Are README files updated for new features?
- [ ] Are breaking changes documented?

## Review Process

### For Authors

- Keep pull requests small and focused
- Write clear and descriptive commit messages
- Provide context in the pull request description
- Self-review code before requesting review
- Respond to feedback promptly and thoughtfully
- Address all review comments before merging

### For Reviewers

- Review code within 24 hours when possible
- Read the entire change before commenting
- Test the changes locally if needed
- Provide specific and actionable feedback
- Explain the reasoning behind suggestions
- Approve when ready, don't nitpick minor issues

## Types of Comments

### Must Fix (Blocking)
- Functional bugs or incorrect behavior
- Security vulnerabilities
- Breaking changes without proper deprecation
- Test failures or inadequate test coverage
- Major performance issues

### Should Fix (Non-blocking but Important)
- Code quality improvements
- Better error handling
- Performance optimizations
- Improved readability or maintainability
- Minor security concerns

### Could Fix (Suggestions)
- Alternative implementations
- Style preferences
- Minor optimizations
- Educational comments
- Future improvement suggestions

### Positive Feedback
- Clever solutions or good practices
- Well-written code or tests
- Good documentation
- Innovative approaches
- Learning opportunities

## Comment Guidelines

### Writing Effective Comments

- Be specific about what needs to change
- Explain the reasoning behind suggestions
- Provide examples or links to documentation
- Use a respectful and constructive tone
- Ask questions when you don't understand something

### Comment Examples

**Good Comments:**
- "This could cause a memory leak if the component unmounts before the promise resolves. Consider using useEffect cleanup."
- "Great use of the adapter pattern here! This makes the code much more testable."
- "Could we add input validation here to handle the edge case where userId might be null?"

**Poor Comments:**
- "This is wrong."
- "Bad code."
- "You should know better."

## GitHub-Specific Guidelines

### Pull Request Best Practices

- Use descriptive titles that explain the change
- Include context and motivation in the description
- Link to related issues or documentation
- Use draft PRs for work in progress
- Keep the scope focused and atomic

### Review Features

- Use GitHub's suggestion feature for specific changes
- Apply labels to categorize the type of change
- Use review templates when available
- Request specific reviewers based on expertise
- Use GitHub's review status appropriately (Comment, Approve, Request Changes)

### Branch Protection

- Require reviews before merging
- Require status checks to pass
- Require up-to-date branches before merging
- Restrict who can dismiss reviews
- Require signed commits when appropriate

## Team Guidelines

### Review Assignments

- Rotate reviewers to share knowledge
- Assign domain experts for complex changes
- Include junior developers in reviews for learning
- Consider pair programming for complex features
- Balance review load across team members

### Knowledge Sharing

- Use reviews as learning opportunities
- Share best practices and patterns
- Discuss architectural decisions
- Document decisions in comments or issues
- Encourage questions and discussions

## Common Review Patterns

### Architecture Reviews

- Focus on design decisions and patterns
- Consider long-term maintainability
- Evaluate integration with existing systems
- Assess scalability and performance implications
- Review API design and contracts

### Security Reviews

- Check for common vulnerabilities (OWASP Top 10)
- Verify input validation and output encoding
- Review authentication and authorization logic
- Check for hardcoded secrets or credentials
- Assess data protection measures

### Performance Reviews

- Look for obvious performance bottlenecks
- Check database query efficiency
- Review memory usage and potential leaks
- Assess network request patterns
- Consider caching strategies

## Review Metrics

- Time to first review
- Review completion time
- Number of review rounds
- Defect discovery rate
- Review coverage (percentage of code reviewed)

## Automation

- Use automated tools for style and lint checking
- Implement security scanning in CI/CD
- Use automated testing to catch regressions
- Set up performance regression detection
- Use dependency scanning for security updates