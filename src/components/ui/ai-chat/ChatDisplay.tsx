// If this file exists, it's likely where the map error is occurring

import React from 'react';
// ...existing imports...

const ChatDisplay = ({ messages, loading, error }) => {
  // Extra defensive check for messages - ensure it's always an array
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  // Log for debugging
  console.log('Messages data type:', typeof messages, messages);
  
  return (
    <div className="chat-display">
      {/* Display error if any */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Extra safe mapping that won't break even if message structure is unexpected */}
      {safeMessages && safeMessages.length > 0 ? (
        safeMessages.map((message, index) => (
          <div key={index} className={`message ${message?.role || 'unknown'}`}>
            {message?.content || JSON.stringify(message)}
          </div>
        ))
      ) : (
        <div className="no-messages">No messages yet</div>
      )}
      
      {/* Show loading indicator */}
      {loading && <div className="loading-indicator">Loading...</div>}
    </div>
  );
};

export default ChatDisplay;
