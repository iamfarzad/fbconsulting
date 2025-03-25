import React, { useEffect, useRef } from 'react';
import { Box, Text, Avatar, Flex } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../../../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

<<<<<<< HEAD
  // Ensure messages is always treated as an array
  const safeMessages = Array.isArray(messages) ? messages : [];
=======
  // Show loading state when not connected to backend
  if (!isConnected || isProviderLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center">
            Connecting to AI Assistant...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (isInitialized && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          No messages yet. Start a conversation!
        </p>
      </div>
    );
  }

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
    <Box>
      {safeMessages.map((message, index) => {
        const isUser = message.role === 'user';
        const timestamp = message.timestamp 
          ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
          : '';
        
        return (
          <Box 
            key={index}
            mb={4}
            ml={isUser ? 'auto' : 0}
            mr={!isUser ? 'auto' : 0}
            maxW="80%"
          >
            <Flex 
              direction={isUser ? 'row-reverse' : 'row'}
              alignItems="flex-start"
            >
              <Avatar 
                size="sm" 
                name={isUser ? 'User' : 'AI'} 
                bg={isUser ? 'blue.500' : 'green.500'} 
                color="white"
                mr={isUser ? 0 : 2}
                ml={isUser ? 2 : 0}
              />
              <Box>
                <Box
                  bg={isUser ? 'blue.50' : 'gray.50'}
                  p={3}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  {isUser ? (
                    <Text>{message.content}</Text>
                  ) : (
                    <Box className="markdown-content">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </Box>
                  )}
                </Box>
                <Text 
                  fontSize="xs" 
                  color="gray.500" 
                  textAlign={isUser ? 'right' : 'left'}
                  mt={1}
                >
                  {timestamp}
                </Text>
              </Box>
            </Flex>
          </Box>
        );
      })}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatMessages;
