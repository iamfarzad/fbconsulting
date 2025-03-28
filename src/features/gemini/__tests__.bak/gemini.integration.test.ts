import { setupGeminiMock, mockGeminiResponse } from './testHelpers';
import { GeminiAdapter } from '../services/geminiAdapter';
import { renderHook } from '@testing-library/react';
import { useGeminiMessageSubmission } from '../hooks/useGeminiMessageSubmission';

describe('Gemini Integration Tests', () => {
  beforeEach(() => {
    setupGeminiMock();
  });

  it('should handle message submission through adapter', async () => {
    const adapter = new GeminiAdapter();
    const response = await adapter.generateResponse("Test message");
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
  });

  it('should handle message submission through hook', async () => {
    const { result } = renderHook(() => useGeminiMessageSubmission());
    const response = await result.current.submitMessage("Test message");
    expect(response).toBeDefined();
    expect(response).toEqual(expect.stringContaining("Mock response"));
  });
});
