import { vi } from 'vitest';

export const mockGeminiResponse = {
  text: () => Promise.resolve("Mock response from Gemini"),
  candidates: [{ content: { parts: [{ text: "Mock response" }] } }]
};

export const mockGeminiError = {
  error: new Error("Gemini API Error"),
  message: "Failed to connect to Gemini API"
};

export const setupGeminiMock = () => {
  const mockGenAI = {
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue(mockGeminiResponse),
      countTokens: vi.fn().mockResolvedValue({ totalTokens: 100 })
    })
  };

  vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: vi.fn().mockImplementation(() => mockGenAI)
  }));

  return mockGenAI;
};
