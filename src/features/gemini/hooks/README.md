# Gemini Hooks

Core hooks for Gemini integration:

## useGeminiService
Main hook for interacting with Gemini API through GeminiProvider.

```typescript
const {
  messages,
  isProcessing,
  error,
  sendMessage,
  clearMessages
} = useGeminiService({
  onError: (error) => console.error(error),
  onMessageStart: () => console.log('Message sending...'),
  onMessageComplete: () => console.log('Message sent')
});
```

All audio and WebSocket functionality is now handled by GeminiProvider.
