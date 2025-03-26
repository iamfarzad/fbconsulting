export const mockGeminiResponse = {
  text: () => "Mock response text",
  candidates: [
    {
      content: {
        parts: [{ text: "Mock response text" }]
      }
    }
  ]
};

export const mockErrorResponse = {
  error: {
    message: "Mock error message",
    code: 400
  }
};

export const mockStreamResponse = {
  text: () => "Mock stream response",
  candidates: [
    {
      content: {
        parts: [{ text: "Mock stream response" }]
      }
    }
  ]
};

// Test utilities
export const createMockResponse = (text: string) => ({
  text: () => text,
  candidates: [
    {
      content: {
        parts: [{ text }]
      }
    }
  ]
});
