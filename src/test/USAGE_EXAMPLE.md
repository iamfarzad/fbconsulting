# Test Infrastructure Usage Examples

## 1. Basic Component Test

```tsx
import { describe, it, expect } from 'vitest';
import { setupComponentTest } from './utils/component-utils';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByRole } = setupComponentTest(
      <Button>Click me</Button>
    );
    
    expect(getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    const { getByRole } = setupComponentTest(
      <Button onClick={onClick}>Click me</Button>
    );
    
    await getByRole('button').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

## 2. API Integration Test

```tsx
import { describe, it, expect } from 'vitest';
import { ApiMockFactory } from './utils/api-mocks';
import { fetchUserData } from '@/services/api';

describe('User API', () => {
  it('handles successful response', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockApi = ApiMockFactory.success(mockUser);
    global.fetch = ApiMockFactory.mockFetch(mockApi);

    const result = await fetchUserData(1);
    expect(result).toEqual(mockUser);
  });

  it('handles error response', async () => {
    const mockApi = ApiMockFactory.error('User not found', 404);
    global.fetch = ApiMockFactory.mockFetch(mockApi);

    await expect(fetchUserData(999)).rejects.toThrow('User not found');
  });
});
```

## 3. Complex Component with Async Operations

```tsx
import { describe, it, expect } from 'vitest';
import { setupComponentTest, mockAsyncFn, waitForNextTick } from './utils/component-utils';
import { UserProfile } from '@/components/UserProfile';

describe('UserProfile', () => {
  it('loads and displays user data', async () => {
    const mockUser = { name: 'Test User', email: 'test@example.com' };
    const fetchUser = mockAsyncFn(mockUser);
    
    const { getByTestId } = setupComponentTest(
      <UserProfile userId={1} fetchUser={fetchUser} />
    );
    
    await waitForNextTick();
    
    expect(getByTestId('user-name')).toHaveTextContent(mockUser.name);
    expect(getByTestId('user-email')).toHaveTextContent(mockUser.email);
  });
});
```

## Best Practices

1. Use typed mock data
2. Clean up after each test
3. Use the provided utility functions
4. Keep tests focused and isolated
5. Use meaningful test descriptions

## Common Patterns

1. Setup/Teardown:
```tsx
describe('Component', () => {
  beforeEach(() => {
    // Setup using utility functions
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
```

2. Error Handling:
```tsx
it('handles errors gracefully', async () => {
  const error = new Error('Test error');
  const mockFn = mockAsyncFn(undefined);
  mockFn.mockRejectedValueOnce(error);
  
  // Test error state
});
```

3. Loading States:
```tsx
it('shows loading state', () => {
  const { getByTestId } = setupComponentTest(
    <Component isLoading={true} />
  );
  
  expect(getByTestId('loading-spinner')).toBeInTheDocument();
});
