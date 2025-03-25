import React, { useEffect, useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { ChatMessage } from '../../types/chat';
import MessageItem from './MessageItem';

interface UnifiedChatMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const UnifiedChatMessageList: React.FC<UnifiedChatMessageListProps> = ({ 
  messages, 
  isLoading = false 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Safely handle messages array that might be undefined or null
  const safeMessages = Array.isArray(messages) ? messages : [];

<<<<<<< HEAD
=======
  // Check if messages is an array
  if (!Array.isArray(messages)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          Invalid messages format. Please try again.
        </p>
      </div>
    );
  }
  
>>>>>>> origin/fix-map-bug
  return (
    <Box 
      overflowY="auto" 
      maxHeight="60vh" 
      height="100%" 
      p={2}
    >
      {safeMessages.map((message, index) => (
        <MessageItem 
          key={index}
          message={message} 
        />
      ))}
      {isLoading && (
        <Text fontStyle="italic" color="gray.500">
          Thinking...
        </Text>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default UnifiedChatMessageList;
