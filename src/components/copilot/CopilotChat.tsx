import React from 'react';
import { GeminiChat } from './GeminiChat';
import type { GeminiChatProps } from './GeminiChat'; // Import the prop types from GeminiChat

/**
 * CopilotChat Component
 * 
 * This component serves as a wrapper around the GeminiChat component to maintain
 * a consistent naming convention throughout the application. It passes all props
 * directly to GeminiChat without modification.
 * 
 * @param props - All properties supported by GeminiChat
 * @returns A GeminiChat component with the provided props
 */
export const CopilotChat: React.FC<GeminiChatProps> = (props) => {
  return <GeminiChat {...props} />;
};
