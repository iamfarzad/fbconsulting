
# Unified Chat Architecture

This document describes the new unified chat architecture designed to address the inconsistencies and duplication in the previous implementation.

## Core Components

### Context Provider
- `ChatContext`: Provides centralized state management for all chat components
- `useChat`: Custom hook for accessing chat state and functions

### UI Components
- `ChatMessage`: Displays individual messages with consistent styling
- `ChatHeader`: Header with title, connection status, and actions
- `TypingIndicator`: Shows when the AI is "typing"
- `InputControls`: Unified controls for sending messages, voice, etc.
- `SuggestionButton`: Displays suggested responses
- `UnifiedChatInput`: Main input component with consistent styling
- `UnifiedChatMessageList`: Displays messages with proper animations
- `UnifiedChat`: Main chat component that combines all elements
- `UnifiedFullScreenChat`: Full-screen version of the chat

## Hooks
- `useChatButton`: Hook for managing the floating chat button
- `useAutoResizeTextarea`: For textarea that grows with content
- `useVoiceInput`: For voice input functionality

## Key Features
- **Centralized State**: All chat state is managed in one place
- **Consistent Styling**: Unified dark/light theme support
- **Reusable Components**: Components are designed for reuse
- **Clear Separation of Concerns**: UI, state, and logic are separated
- **Extensible Design**: Easy to add new features without duplication

## Usage Examples

### Basic Chat
```tsx
import { UnifiedChat } from '@/components/chat/UnifiedChat';

const MyComponent = () => {
  return (
    <UnifiedChat 
      title="Customer Support"
      placeholderText="How can we help you today?"
    />
  );
};
```

### Full Screen Chat
```tsx
import { UnifiedFullScreenChat } from '@/components/chat/UnifiedFullScreenChat';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Chat</button>
      
      {isOpen && (
        <UnifiedFullScreenChat 
          onMinimize={() => setIsOpen(false)}
          title="AI Assistant"
        />
      )}
    </>
  );
};
```

### Floating Chat Button
```tsx
import { ChatButton } from '@/components/chat/ChatButton';

const App = () => {
  return (
    <div>
      {/* Your app content */}
      <ChatButton />
    </div>
  );
};
```

## Benefits of the New Architecture

1. **Reduced Code Duplication**: Common functionality is extracted into shared components
2. **Consistent User Experience**: Users get the same experience across all chat interfaces
3. **Easier Maintenance**: Changes to chat behavior can be made in one place
4. **Better Performance**: Optimized rendering with proper state management
5. **Improved Development Experience**: Clear, documented components make development faster

## Future Enhancements

- Add file upload capabilities
- Improve lead extraction from conversations
- Add analytics tracking
- Implement conversation history
- Add support for multiple AI models
