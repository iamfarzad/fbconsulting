# Gemini Feature

This feature contains all Gemini AI integration code, consolidated from various parts of the application.

## Directory Structure

```
src/features/gemini/
├── config/           # Gemini configuration components
├── hooks/            # Custom hooks for Gemini functionality
├── services/         # Core Gemini service implementations
├── types/           # TypeScript types and interfaces
└── index.ts         # Public API exports
```

## Migration Guide

If you were using the old imports, update them to use the new consolidated paths:

```typescript
// Old imports
import { useGeminiService } from "src/hooks/gemini/useGeminiService";
import { GoogleGenAIAdapter } from "src/services/copilot/googleGenAIAdapter";

// New imports
import { useGeminiService, GeminiAdapter } from "@/features/gemini";
```

## Key Components

- `GeminiConfig`: Central configuration for Gemini AI
- `GeminiAdapter`: Core service adapter for Gemini AI API
- `useGeminiService`: Primary hook for Gemini functionality
- `useGeminiAudio`: Audio processing capabilities

