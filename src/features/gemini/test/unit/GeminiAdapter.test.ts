import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiAdapter } from '../../services/GeminiAdapter';
import { mockGeminiResponse, mockErrorResponse } from '../mocks';

describe('GeminiAdapter', () => {
  let adapter: GeminiAdapter;

  beforeEach(() => {
    adapter = new GeminiAdapter();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const result = await adapter.initialize();
      expect(result).toBe(true);
      expect(adapter.isInitialized()).toBe(true);
    });

    it('should handle initialization errors', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));
      
      await expect(adapter.initialize()).rejects.toThrow('API Error');
      expect(adapter.isInitialized()).toBe(false);
    });
  });

  describe('message generation', () => {
    beforeEach(async () => {
      await adapter.initialize();
    });

    it('should generate response successfully', async () => {
      vi.mocked(adapter['model'].generateContent).mockResolvedValueOnce(mockGeminiResponse);
      
      const response = await adapter.generateResponse('Test message');
      expect(response).toBeDefined();
      expect(response).toContain('Test response');
    });

    it('should handle generation errors', async () => {
      vi.mocked(adapter['model'].generateContent).mockRejectedValueOnce(mockErrorResponse);
      
      await expect(adapter.generateResponse('Test message')).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network Error'));
      
      await expect(adapter.generateResponse('Test')).rejects.toThrow('Network Error');
    });

    it('should handle invalid responses', async () => {
      vi.mocked(adapter['model'].generateContent).mockResolvedValueOnce({} as any);
      
      await expect(adapter.generateResponse('Test')).rejects.toThrow();
    });
  });
});
