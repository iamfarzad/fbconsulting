import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeminiMessageSubmission } from '../../hooks/useGeminiMessageSubmission';
import { mockGeminiResponse } from '../mocks';

describe('Chat Flow Integration', () => {
  it('should handle complete chat flow', async () => {
    const { result } = renderHook(() => useGeminiMessageSubmission());

    await act(async () => {
      const response = await result.current.submitMessage('Hello');
      expect(response).toBeDefined();
    });
  });

  it('should maintain chat history', async () => {
    const { result } = renderHook(() => useGeminiMessageSubmission());
    
    await act(async () => {
      await result.current.submitMessage('Message 1');
      await result.current.submitMessage('Message 2');
      
      expect(result.current.history.length).toBe(4); // 2 user messages + 2 responses
    });
  });

  it('should handle errors gracefully', async () => {
    const { result } = renderHook(() => useGeminiMessageSubmission());
    
    vi.mocked(mockGeminiResponse.text).mockRejectedValueOnce(new Error('Test Error'));
    
    await act(async () => {
      await expect(result.current.submitMessage('Error test')).rejects.toThrow();
      expect(result.current.error).toBeDefined();
    });
  });
});
