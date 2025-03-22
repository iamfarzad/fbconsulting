import { Message as BaseCopilotMessage } from '@copilotkit/react-core';

export interface CopilotMessage extends BaseCopilotMessage {
  text: string;
}

export interface CopilotMessageWithRole {
  role: 'user' | 'assistant' | 'system';
  text: string;
}
