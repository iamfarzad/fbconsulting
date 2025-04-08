
/**
 * Generates a unique ID for messages using a timestamp and random string
 */
export const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Creates a user message object with the required fields
 */
export const createUserMessage = (content: string): any => {
  return {
    id: generateMessageId(),
    role: 'user',
    content,
    timestamp: Date.now()
  };
};

/**
 * Creates an assistant message object with the required fields
 */
export const createAssistantMessage = (content: string): any => {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content,
    timestamp: Date.now()
  };
};

/**
 * Creates a system message object with the required fields
 */
export const createSystemMessage = (content: string): any => {
  return {
    id: generateMessageId(),
    role: 'system',
    content,
    timestamp: Date.now()
  };
};

/**
 * Creates an error message object with the required fields
 */
export const createErrorMessage = (content: string): any => {
  return {
    id: generateMessageId(),
    role: 'error',
    content,
    timestamp: Date.now()
  };
};
