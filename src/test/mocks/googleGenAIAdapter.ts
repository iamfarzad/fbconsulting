import { vi } from 'vitest';

export const mockGoogleGenAIAdapter = {
  initialize: vi.fn().mockResolvedValue(undefined),
  sendMessage: vi.fn().mockResolvedValue({
    text: 'Mock response',
    role: 'assistant'
  }),
  getConfig: vi.fn().mockReturnValue({
    apiKey: 'mock-api-key',
    model: 'gemini-2.0-flash-exp',
    temperature: 0.7
  })
};

vi.mock('@/services/copilot/googleGenAIAdapter', () => ({
  default: mockGoogleGenAIAdapter
}));
