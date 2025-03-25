import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

describe('Test Environment Setup', () => {
  beforeEach(() => {
    // Reset any mocks before each test
  });

  afterEach(() => {
    cleanup();
  });

  it('should have jsdom environment', () => {
    const element = document.createElement('div');
    expect(element).toBeDefined();
    expect(element instanceof HTMLElement).toBe(true);
  });

  it('should have testing-library utilities', () => {
    const element = document.createElement('div');
    element.textContent = 'Test';
    document.body.appendChild(element);
    expect(element).toBeInTheDocument();
  });

  it('should have window mocks', () => {
    expect(window.speechSynthesis).toBeDefined();
    expect(typeof window.speechSynthesis.speak).toBe('function');
  });

  it('should have localStorage mock', () => {
    expect(window.localStorage).toBeDefined();
    expect(typeof window.localStorage.getItem).toBe('function');
    expect(typeof window.localStorage.setItem).toBe('function');
  });
});

describe('DOM Testing Capabilities', () => {
  it('should handle basic DOM operations', () => {
    // Create an element
    const div = document.createElement('div');
    div.className = 'test-class';
    div.textContent = 'Hello Test';
    
    // Add to document
    document.body.appendChild(div);
    
    // Verify
    expect(document.querySelector('.test-class')).toBeDefined();
    expect(div.textContent).toBe('Hello Test');
  });

  it('should handle events', () => {
    const button = document.createElement('button');
    let clicked = false;
    
    button.addEventListener('click', () => {
      clicked = true;
    });
    
    button.click();
    expect(clicked).toBe(true);
  });
});

describe('Testing Environment Features', () => {
  it('should support async/await', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });

  it('should handle timeouts', (done) => {
    setTimeout(() => {
      expect(true).toBe(true);
      done();
    }, 0);
  });
});
