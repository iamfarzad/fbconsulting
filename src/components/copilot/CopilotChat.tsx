
import React from 'react';

interface CopilotChatProps {
  initialMessages?: any[];
  apiConfig?: {
    apiKey: string;
    endpoint?: string;
    modelName?: string;
  };
  className?: string;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  initialMessages = [],
  apiConfig,
  className
}) => {
  return (
    <div className={`copilot-chat-container ${className || ''}`}>
      <div className="copilot-chat-messages">
        {initialMessages.map((msg, i) => (
          <div key={i} className={`copilot-chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="copilot-chat-input">
        <input type="text" placeholder="Type your message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default CopilotChat;
