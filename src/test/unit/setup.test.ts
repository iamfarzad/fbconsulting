import { describe, it, expect } from 'vitest';
import { mockGeminiResponse } from '../mocks/googleGenAIAdapter';

describe('Test Environment Setup', () => {
  it('should have access to environment variables', () => {
    expect(import.meta.env.VITE_GEMINI_API_KEY).toBeDefined();
  });

  it('should load test utilities correctly', () => {
    expect(mockGeminiResponse.text).toBeDefined();
    expect(typeof mockGeminiResponse.text).toBe('function');
  });

  it('should have access to DOM testing utilities', () => {
    const element = document.createElement('div');
    element.innerHTML = 'Test content';
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Test content');
  });

  it('should have mocked window APIs', () => {
    expect(window.speechSynthesis).toBeDefined();
    expect(window.localStorage).toBeDefined();
    expect(window.IntersectionObserver).toBeDefined();
  });
});

describe('Test Configuration', () => {
  it('should run in jsdom environment', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });

  it('should have testing utilities available', () => {
    const testDiv = document.createElement('div');
    document.body.appendChild(testDiv);
    expect(document.body).toContainElement(testDiv);
  });
});
