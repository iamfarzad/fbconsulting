# Test Infrastructure Documentation

This directory contains the test infrastructure for the project. The setup follows a layered approach to make testing consistent, type-safe, and easy to maintain.

## Quick Start

1. Run tests:
```bash
npm test              # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

2. Create a new component test:
```tsx
import { describe, it, expect } from 'vitest';
import { setupComponentTest } from './utils/component-utils';

describe('YourComponent', () => {
  it('works as expected', () => {
    const { getByTestId } = setupComponentTest(<YourComponent />);
    // Your test here
  });
});
```

## Directory Structure

```
src/test/
├── core/              # Core test setup and configuration
│   └── setup.ts      # Global test setup
├── utils/            # Testing utilities
│   ├── test-utils.tsx    # Basic render utilities
│   ├── component-utils.tsx # Component testing helpers
│   └── api-mocks.ts      # API mocking utilities
├── verify-setup.test.tsx # Infrastructure verification
├── SETUP_SUMMARY.md     # Detailed setup documentation
└── USAGE_EXAMPLE.md     # Example usage patterns
```

## Key Features

1. Type-safe testing utilities
2. Consistent component rendering
3. API mocking helpers
4. Async operation utilities
5. CI/CD integration

## Documentation

- [Setup Summary](./SETUP_SUMMARY.md) - Detailed implementation explanation
- [Usage Examples](./USAGE_EXAMPLE.md) - Common testing patterns

## Best Practices

1. Keep tests focused and isolated
2. Use the provided utilities
3. Follow the examples in USAGE_EXAMPLE.md
4. Clean up after tests
5. Write meaningful test descriptions

## Debugging

If tests are failing:
1. Check the test environment is properly set up
2. Verify mock implementations
3. Use the debug utilities:
```tsx
const { debug } = setupComponentTest(<Component />);
debug(); // Prints the current DOM state
```

## Adding New Tests

1. Create your test file in the appropriate directory
2. Import required utilities
3. Use the setupComponentTest helper
4. Follow the examples in USAGE_EXAMPLE.md

## CI Integration

Tests automatically run in CI:
- On push to main/development
- On pull requests
- With coverage reporting
- With proper error handling

## Contributing

When adding to the test infrastructure:
1. Update documentation
2. Add usage examples
3. Verify with verify-setup.test.tsx
4. Maintain type safety
