---
description: 'Performance optimization guidelines'
applyTo: '**/*'
---

# Performance Optimization Guidelines

Best practices for writing performant code and optimizing application performance.

## General Performance Principles

- Profile before optimizing to identify actual bottlenecks
- Measure performance improvements with concrete metrics
- Focus on the critical path and user-facing performance
- Balance performance with code maintainability and readability
- Consider the total cost of ownership, not just execution speed
- Optimize for the common case, not edge cases

## Frontend Performance

### Bundle Optimization

- Use code splitting to reduce initial bundle size
- Implement lazy loading for non-critical components
- Use tree shaking to eliminate dead code
- Optimize images and use appropriate formats (WebP, AVIF)
- Minimize and compress CSS and JavaScript files
- Use CDN for static assets

### React Performance

- Use React.memo for expensive component renders
- Implement proper dependency arrays in useEffect
- Use useMemo and useCallback judiciously
- Avoid creating objects and functions in render methods
- Use React DevTools Profiler to identify performance issues
- Implement virtual scrolling for large lists

### Loading Performance

- Implement progressive loading strategies
- Use service workers for caching
- Optimize critical rendering path
- Implement proper preloading for critical resources
- Use resource hints (prefetch, preload, preconnect)
- Monitor and optimize Core Web Vitals

## Backend Performance

### Database Optimization

- Use appropriate database indexes
- Optimize SQL queries and avoid N+1 problems
- Implement connection pooling
- Use caching strategies (Redis, in-memory caching)
- Optimize database schema design
- Use read replicas for read-heavy workloads

### API Performance

- Implement proper caching headers
- Use compression for API responses
- Implement pagination for large datasets
- Optimize serialization and deserialization
- Use efficient data formats (binary, MessagePack)
- Implement rate limiting and request deduplication

### Node.js Performance

- Use streaming for large data processing
- Implement proper error handling to prevent crashes
- Use clustering for CPU-intensive tasks
- Monitor event loop lag
- Use appropriate data structures for the task
- Implement proper memory management

## Memory Management

### JavaScript/TypeScript

- Avoid memory leaks from event listeners and timers
- Use WeakMap and WeakSet when appropriate
- Clean up resources in component unmount/cleanup
- Avoid creating unnecessary object references
- Use object pooling for frequently created objects
- Monitor memory usage in development

### Rust Performance

- Use appropriate data structures for the use case
- Leverage zero-cost abstractions
- Use iterators instead of collecting unnecessarily
- Implement proper memory allocation strategies
- Use references instead of cloning when possible
- Profile with cargo flamegraph or similar tools

## Caching Strategies

### Client-Side Caching

- Implement proper HTTP caching headers
- Use service worker caching strategies
- Cache API responses appropriately
- Implement stale-while-revalidate patterns
- Use localStorage/sessionStorage judiciously
- Cache computed values with useMemo

### Server-Side Caching

- Implement Redis or similar caching solutions
- Use CDN caching for static content
- Cache database query results
- Implement cache invalidation strategies
- Use HTTP cache headers appropriately
- Monitor cache hit rates

## Network Optimization

- Minimize HTTP requests
- Use HTTP/2 features (multiplexing, server push)
- Implement request batching where appropriate
- Use efficient serialization formats
- Implement proper timeout and retry logic
- Monitor network latency and bandwidth usage

## Monitoring and Metrics

### Performance Monitoring

- Implement application performance monitoring (APM)
- Monitor Core Web Vitals for frontend applications
- Track database query performance
- Monitor API response times
- Set up alerts for performance degradation
- Use synthetic monitoring for critical paths

### Key Metrics

- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

## Build and Deployment Optimization

- Use build tools optimization features
- Implement proper minification
- Use asset optimization and compression
- Optimize Docker images for size and startup time
- Use multi-stage builds for reduced image size
- Implement proper CI/CD caching strategies

## Development Performance

- Use development tools efficiently
- Implement proper hot reloading
- Optimize development build times
- Use incremental compilation where available
- Implement proper linting and type checking
- Use parallel processing in build scripts

## Testing Performance

- Write performance regression tests
- Use performance budgets in CI/CD
- Test performance under load
- Monitor performance in different environments
- Use automated performance testing tools
- Document performance requirements

## Best Practices

- Avoid premature optimization
- Profile in production-like environments
- Consider mobile and slow network performance
- Optimize for perceived performance
- Use performance budgets and monitoring
- Regular performance audits and reviews
- Document performance decisions and trade-offs