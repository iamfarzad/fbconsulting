import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeminiMessageSubmission } from '../../hooks/useGeminiMessageSubmission';
import { useGeminiInitialization } from '../../hooks/useGeminiInitialization';
import { mockGeminiResponse, createMockHookProps } from '../mocks';

describe('Gemini Hooks', () => {
  describe('useGeminiInitialization', () => {
    it('should initialize successfully', async () => {
      const { result } = renderHook(() => useGeminiInitialization());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isReady).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle initialization errors', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Init Error'));

      const { result } = renderHook(() => useGeminiInitialization());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isReady).toBe(false);
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useGeminiMessageSubmission', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should submit message successfully', async () => {
      const { result } = renderHook(() => useGeminiMessageSubmission());

      await act(async () => {
        const response = await result.current.submitMessage('Test message');
        expect(response).toBeDefined();
      });
    });

    it('should handle submission errors', async () => {
      vi.mocked(mockGeminiResponse.text).mockRejectedValueOnce(new Error('Submit Error'));

      const { result } = renderHook(() => useGeminiMessageSubmission());

      await act(async () => {
        await expect(result.current.submitMessage('Test')).rejects.toThrow();
        expect(result.current.error).toBeDefined();
      });
    });

    it('should update loading state correctly', async () => {
      const { result } = renderHook(() => useGeminiMessageSubmission());

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        const promise = result.current.submitMessage('Test');
        expect(result.current.isLoading).toBe(true);
        await promise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});

describe('Hook Integration', () => {
  it('should work together correctly', async () => {
    const initHook = renderHook(() => useGeminiInitialization());
    const messageHook = renderHook(() => useGeminiMessageSubmission());

    await act(async () => {
      await initHook.result.current.initialize();
      expect(initHook.result.current.isReady).toBe(true);

      const response = await messageHook.result.current.submitMessage('Test');
      expect(response).toBeDefined();
    });
  });
});
