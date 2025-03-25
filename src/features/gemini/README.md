# Gemini Feature Module

This module provides a centralized implementation of Gemini AI functionality for the application.

## Features

- Message submission and response handling
- Initialization and configuration management
- Multimodal support (text, images, audio)
- Error handling and retry logic
- Type-safe interfaces
- Reusable hooks for common use cases

## Quick Start

```typescript
import { useGeminiMessageSubmission, useGeminiInitialization } from '@/features/gemini';

function MyComponent() {
  const { submitMessage } = useGeminiMessageSubmission();
  const { isReady } = useGeminiInitialization();

  const handleSend = async (message: string) => {
    const response = await submitMessage(message);
    // Handle response...
  };
}
```

## Available Hooks

- `useGeminiMessageSubmission`: For sending messages and receiving responses
- `useGeminiInitialization`: For handling API initialization and status
- `useGeminiAudio`: For audio-related features

## Core Services

- `GeminiAdapter`: Main service for interacting with Gemini API
- Configuration utilities
- Type definitions

## Example Usage

### Basic Chat Implementation

```typescript
import { useGeminiMessageSubmission } from '@/features/gemini';

function ChatComponent() {
  const { submitMessage } = useGeminiMessageSubmission();

  const sendMessage = async (content: string) => {
    try {
      const response = await submitMessage(content);
      // Handle success...
    } catch (error) {
      // Handle error...
    }
  };
}
```

### With Initialization Check

```typescript
import { useGeminiInitialization } from '@/features/gemini';

function App() {
  const { isReady, error } = useGeminiInitialization();

  if (!isReady) {
    return <div>Loading Gemini...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <YourComponent />;
}
```

## Best Practices

1. Always check initialization status before making requests
2. Handle errors appropriately
3. Use provided types for type safety
4. Utilize hooks for common use cases instead of direct API calls
