import '@testing-library/jest-dom';
import './mocks/googleGenAIAdapter';
import { vi, beforeEach } from 'vitest';

// Mock window.speechSynthesis
const mockSpeechSynthesis = {
  speak: vi.fn(),
  getVoices: vi.fn().mockImplementation(() => [
    { name: 'Charon', lang: 'en-US' },
    { name: 'Other Voice', lang: 'en-US' }
  ]),
  onvoiceschanged: null as any
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
