import { describe, it, expect } from 'vitest';

describe('Test Environment', () => {
  it('should have working test environment', () => {
    expect(true).toBe(true);
  });

  it('should have access to DOM', () => {
    const div = document.createElement('div');
    expect(div).toBeDefined();
    expect(div instanceof HTMLDivElement).toBe(true);
  });

  it('should have access to test setup globals', () => {
    expect(global.__PUPPETEER_CONFIG__).toBeDefined();
    expect(window.speechSynthesis).toBeDefined();
  });
});
