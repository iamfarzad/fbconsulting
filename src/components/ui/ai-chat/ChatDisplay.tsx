// If this file exists, it's likely where the map error is occurring

import React from 'react';
// ...existing imports...

const ChatDisplay = ({ messages, loading, error }) => {
  // Safety check for messages
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  return (
    <div className="chat-display">
      {/* Display error if any */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Map through messages safely */}
      {safeMessages.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          {message.content}
        </div>
      ))}
      
      {/* Show loading indicator */}
      {loading && <div className="loading-indicator">...</div>}
    </div>
  );
};

export default ChatDisplay;
