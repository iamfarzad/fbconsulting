# Gemini Feature Test Suite

## Overview

This test suite covers the Gemini feature module, including unit tests, integration tests, and fixtures.

## Running Tests

```bash
# Run all Gemini tests
npm run test:gemini

# Run with coverage
npm run test:gemini:coverage

# Run in watch mode during development
npm run test:gemini:watch
```

## Test Structure

```
src/features/gemini/test/
├── fixtures/          # Test data and mock responses
├── unit/             # Unit tests for services and hooks
├── integration/      # End-to-end feature tests
├── setup.ts          # Test configuration and globals
├── mocks.ts          # Common mock implementations
└── README.md         # This documentation
```

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { createMockAdapter } from '../mocks';

describe('YourComponent', () => {
  it('should behave correctly', () => {
    const adapter = createMockAdapter();
    // Test implementation
  });
});
```

### Integration Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { mockGeminiResponse } from '../mocks';

describe('Feature Integration', () => {
  it('should work end-to-end', async () => {
    // Test implementation
  });
});
```

## Mocks and Fixtures

- Use `createMockAdapter()` for service mocks
- Use `mockGeminiResponse` for API responses
- Add new fixtures to `fixtures/` directory
- Extend mocks in `mocks.ts` as needed

## Coverage Requirements

- Maintain minimum 80% coverage
- Run coverage checks before PR
- Update tests for new features

## CI/CD Integration

Tests run automatically:
- On push to main
- On PRs to main
- On push to consolidation/* branches

## Best Practices

1. Mock external dependencies
2. Use descriptive test names
3. Group related tests
4. Clean up after tests
5. Handle async operations properly

## Debugging

```bash
# Run specific test file
npm run test:gemini src/features/gemini/test/unit/your-test.test.ts

# Run with debugger
npm run test:gemini:debug

# Show verbose output
npm run test:gemini --verbose
```

## Contributing

1. Add tests for new features
2. Update existing tests when changing functionality
3. Ensure all tests pass locally before pushing
4. Add test documentation as needed
