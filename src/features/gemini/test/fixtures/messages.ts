export const testMessages = {
  basic: {
    input: "Hello, how are you?",
    expectedResponse: "I'm doing well, thank you for asking!"
  },
  complex: {
    input: "Explain quantum computing",
    expectedResponse: "Quantum computing is a type of computing that uses quantum phenomena..."
  },
  error: {
    input: "trigger_error",
    errorMessage: "Test error message"
  }
};

export const testConversation = [
  { role: 'user', content: 'Hello', timestamp: '2025-03-25T12:00:00Z' },
  { role: 'assistant', content: 'Hi there!', timestamp: '2025-03-25T12:00:01Z' },
  { role: 'user', content: 'How are you?', timestamp: '2025-03-25T12:00:02Z' },
  { role: 'assistant', content: "I'm doing great!", timestamp: '2025-03-25T12:00:03Z' }
];

export const testConfigs = {
  apiKey: 'test-api-key',
  model: 'gemini-pro',
  temperature: 0.7,
  maxTokens: 1000
};
