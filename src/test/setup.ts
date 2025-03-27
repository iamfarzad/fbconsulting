import '@testing-library/jest-dom';
import './mocks/googleGenAIAdapter';
import { vi, beforeEach } from 'vitest';

// Configure Puppeteer for CI environment
const puppeteerConfig = {
  launch: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new'
  }
};

// Export for use in tests
global.__PUPPETEER_CONFIG__ = puppeteerConfig;

// Mock window.speechSynthesis
const mockSpeechSynthesis = {
  speak: vi.fn(),
  getVoices: vi.fn().mockImplementation(() => [
    { name: 'Charon', lang: 'en-US' },
    { name: 'Other Voice', lang: 'en-US' }
  ]),
  onvoiceschanged: null as (() => void) | null
};

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
