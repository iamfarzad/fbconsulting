
import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="text-sm text-muted-foreground">AI is typing</div>
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <div 
            key={index}
            className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" 
            style={{ 
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
};
