# Codebase Cleanup Plan

## Phase 1: Preparation & Initial Cleanup

1. **Backup**
   - Create backup branch: `git checkout -b backup/pre-cleanup`
   - Push to remote: `git push origin backup/pre-cleanup`
   - Return to working branch: `git checkout consolidation/phase-2`
   - If needed: `git merge main` to ensure we have latest changes

2. **Remove Deprecated Code**
   - Delete `deprecated_backup` directory
   - Remove unused test/demo pages (`AIDemo.tsx`, etc.)
   - Delete duplicate files (like `src/services/email/emailService.ts`)
   - Run the cleanup script: `bash scripts/cleanup.sh`

3. **Centralize Types**
   - Run the type centralization script: `node scripts/type-centralization.js`
   - Review the generated report
   - Create or update type files in `src/types/` directory:
     - `src/types/chat.ts`: Message types, feedback, chat states
     - `src/types/gemini.ts`: Gemini API configuration and responses
     - `src/types/voice.ts`: Voice recognition and speech synthesis types
     - `src/types/persona.ts`: Persona data models
     - `src/types/lead.ts`: Lead information types
   - Update imports across the project to use these centralized types

## Phase 2: Consolidate Chat UI Components

1. **Unify Message Display**
   - Review existing message components:
     - `src/components/ui/ai-chat/EnhancedChatMessage.tsx`
     - `src/components/ui/ai-chat/ChatMessage.tsx`
     - Any other similar components
   - Ensure `EnhancedChatMessage` supports all required features:
     - Different message roles (user, assistant, system, error)
     - Media attachments
     - Loading states
     - Feedback mechanisms
     - Styling variations
   - Update `UnifiedChatMessageList` to use only `EnhancedChatMessage`
   - Delete redundant message components after migrating their unique features
   - Test all message display scenarios

2. **Unify Chat Input**
   - Review existing input components:
     - `src/components/chat/UnifiedChatInput.tsx`
     - `src/components/ui/ai-chat/ChatInput.tsx`
     - `src/components/hero/HeroInput.tsx` and `src/components/hero/HeroVoiceInput.tsx`
   - Ensure `UnifiedChatInput` supports all required features:
     - Text input with proper styling
     - File upload capabilities
     - Voice input/toggling
     - Send button
     - Loading states
     - Responsive design
   - Refactor other components to use `UnifiedChatInput`
   - Delete redundant input components after migration

## Phase 3: Consolidate Hooks

1. **Unify Voice Hooks**
   - Review existing voice-related hooks:
     - `src/hooks/useSpeechRecognition.ts`
     - `src/hooks/useVoiceInput.ts`
     - `src/hooks/gemini/useGeminiAudioPlayback.ts`
     - `src/hooks/useGeminiAudio.ts`
   - Implement comprehensive `useVoiceService` hook that combines all functionality:
     - Speech recognition (start, stop, toggle)
     - Transcript management
     - Audio playback (speak, pause, resume, stop)
     - Status tracking (isListening, isSpeaking)
     - Error handling
   - Create supporting service class:
     - `src/services/voice/voiceService.ts` to handle browser APIs
   - Update all components to use the unified hook
   - Delete redundant hooks after migration

2. **Centralize Chat State**
   - Review existing chat state management:
     - `src/contexts/ChatContext.tsx`
     - `src/hooks/useUnifiedChat.ts`
     - Other related hooks (`useMessages`, `useChatState`, etc.)
   - Enhance `ChatContext` to be the single source of truth:
     - Move all state definitions to `src/contexts/chat/types.ts`
     - Implement comprehensive reducer in `src/contexts/chat/chatReducer.ts`
     - Create wrapper provider component in `src/contexts/chat/ChatContext.tsx`
     - Implement helper functions like `sendMessage`, `clearChat`, etc.
   - Adapt `useUnifiedChat.ts` to use `ChatContext` internally
   - Update all components to use the `useChat()` hook
   - Delete redundant state management after migration

## Phase 4: Service Layer Refinement

1. **Organize Service Responsibilities**
   - Create a clear service structure:
     ```
     src/services/
       ├── gemini/
       │   ├── api.ts        // Direct API calls
       │   ├── service.ts    // Business logic
       │   └── types.ts      // Service-specific types
       ├── voice/
       │   ├── voiceService.ts  // Voice API handling
       │   └── types.ts      // Voice service types
       └── email/
           └── emailService.ts  // Email sending, etc.
     ```
   - Move all direct API calls to appropriate service files
   - Ensure clear separation of concerns:
     - API modules: Make HTTP calls, parse responses
     - Service modules: Business logic, data transformation
     - Hook modules: React state management, component integration

2. **Remove Mock Services**
   - Identify mock implementations in `src/services/chat/ChatFactory.ts`
   - Create proper test mocks using `vi.mock` in test files
   - Delete mock service files after migration

## Phase 5: Testing

1. **Unit Tests**
   - Create test files for core functionality:
     - `src/contexts/chat/__tests__/chatReducer.test.ts`
     - `src/hooks/__tests__/useVoiceService.test.ts`
     - `src/services/gemini/__tests__/api.test.ts`
   - Use proper mocking for external dependencies
   - Focus on testing business logic and state transformations

2. **Integration Tests**
   - Create integration tests for main components:
     - `src/components/chat/__tests__/UnifiedChat.test.tsx`
     - `src/components/ui/ai-chat/__tests__/EnhancedChatMessage.test.tsx`
   - Test end-to-end flows with proper context providers
   - Mock external API calls but test internal state changes

3. **Coverage Analysis**
   - Run coverage report: `npm run test:coverage`
   - Identify and address areas with low coverage
   - Focus on critical paths like message sending, voice recognition, error handling

## Phase 6: Final Cleanup

1. **Dead Code Elimination**
   - Use IDE tools to find unused files and functions
   - Check import statements to find unused components
   - Look for TODO comments and address or remove them
   - Validate that duplicates are fully removed

2. **Code Review**
   - Self-review the changes for consistency and completeness
   - Have another team member review the changes
   - Test the application thoroughly in various scenarios
   - Update documentation to reflect the new architecture

3. **Merge**
   - Create a PR for the `consolidation/phase-2` branch
   - Address any feedback from the code review
   - Run final tests to ensure nothing was broken
   - Merge into the main development branch
   - Tag the release appropriately
