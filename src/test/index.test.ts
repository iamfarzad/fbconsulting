import { describe, it, expect } from 'vitest';

describe('Test Environment', () => {
  it('should work with basic assertions', () => {
    expect(true).toBe(true);
  });

  // This test verifies our test setup works with DOM
  it('should have access to DOM APIs', () => {
    expect(window).toBeDefined();
    expect(document).toBeDefined();
    expect(document.createElement('div')).toBeDefined();
  });
});
