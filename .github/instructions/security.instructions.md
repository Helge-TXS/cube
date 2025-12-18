---
description: 'Security best practices and guidelines'
applyTo: '**/*'
---

# Security Guidelines

Comprehensive security standards to protect against common vulnerabilities and ensure secure development practices.

## General Security Principles

- Follow the principle of least privilege
- Implement defense in depth
- Validate all inputs and sanitize outputs
- Never trust user input or external data
- Keep security considerations in mind throughout development
- Regularly update dependencies and monitor for vulnerabilities

## Input Validation and Sanitization

- Validate all input data at application boundaries
- Use schema validation libraries for complex data structures
- Sanitize output data to prevent injection attacks
- Implement proper encoding for different contexts (HTML, URL, SQL)
- Use parameterized queries to prevent SQL injection
- Validate file uploads and restrict file types

## Authentication and Authorization

- Implement strong password policies
- Use secure session management
- Implement proper logout functionality
- Use multi-factor authentication where appropriate
- Implement role-based access control (RBAC)
- Secure API endpoints with proper authentication

## Data Protection

- Encrypt sensitive data at rest and in transit
- Use HTTPS for all communications
- Implement proper key management
- Avoid storing sensitive data in logs
- Use secure random number generation
- Implement data retention and deletion policies

## Dependency Management

- Regularly update dependencies to latest secure versions
- Use dependency scanning tools to identify vulnerabilities
- Remove unused dependencies
- Pin dependency versions in production
- Use package lock files to ensure consistent builds
- Monitor security advisories for used packages

## Error Handling and Logging

- Implement proper error handling without exposing sensitive information
- Log security-related events
- Avoid logging sensitive data
- Implement proper log rotation and retention
- Monitor logs for suspicious activities
- Use structured logging for better analysis

## API Security

- Implement rate limiting to prevent abuse
- Use proper HTTP status codes
- Validate content types and request sizes
- Implement CORS policies appropriately
- Use API keys or tokens for authentication
- Document security requirements for API consumers

## Frontend Security

- Implement Content Security Policy (CSP) headers
- Sanitize user input in client-side code
- Use secure communication with backend APIs
- Avoid storing sensitive data in client storage
- Implement proper session timeout
- Protect against clickjacking with X-Frame-Options

## Environment and Configuration

- Use environment variables for sensitive configuration
- Never commit secrets or credentials to version control
- Use secure secret management systems
- Implement proper environment separation
- Secure configuration files and restrict access
- Use least privilege principles for service accounts

## Code Security

- Avoid eval() and other dynamic code execution
- Use static analysis tools to identify security issues
- Implement proper memory management in lower-level languages
- Avoid hardcoded secrets or credentials
- Use secure coding practices for each language
- Regular security code reviews

## Infrastructure Security

- Keep servers and operating systems updated
- Use firewalls and network segmentation
- Implement proper backup and disaster recovery
- Monitor system resources and unusual activities
- Use secure deployment practices
- Implement infrastructure as code where possible

## Third-Party Integrations

- Verify the security of third-party services
- Use secure communication protocols
- Implement proper error handling for external failures
- Monitor third-party service security advisories
- Use secure API keys and tokens
- Implement proper timeout and retry logic

## Security Testing

- Include security testing in CI/CD pipelines
- Perform regular penetration testing
- Use automated security scanning tools
- Test for common vulnerabilities (OWASP Top 10)
- Implement security regression testing
- Document and track security findings

## Incident Response

- Implement security incident response procedures
- Monitor for security breaches and unusual activities
- Have a plan for security incident notification
- Implement proper evidence preservation
- Regular security incident response training
- Post-incident analysis and improvement

## Privacy and Compliance

- Implement privacy by design principles
- Understand and comply with relevant regulations (GDPR, CCPA, etc.)
- Implement proper consent management
- Provide data portability and deletion capabilities
- Document data processing activities
- Regular privacy impact assessments