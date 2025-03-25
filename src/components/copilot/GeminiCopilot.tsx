import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Spinner, useToast } from '@chakra-ui/react';
import ChatInput from './chat/ChatInput';
import ChatMessages from './chat/ChatMessages';
import { ChatMessage } from '../../types/chat';
import axios from 'axios';
import ConnectionStatusIndicator from '../common/ConnectionStatusIndicator';

const GeminiCopilot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(true);
  const toast = useToast();

  // Check API connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get('/api/health');
        setConnected(true);
      } catch (error) {
        setConnected(false);
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to AI service',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    checkConnection();
    // Set up periodic connection checks
    const intervalId = setInterval(checkConnection, 30000);
    
    return () => clearInterval(intervalId);
  }, [toast]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    // Update messages with user input
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/gemini', {
        messages: updatedMessages,
      });
      
      if (response.data && response.data.response) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages([...updatedMessages, aiMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Gemini Copilot</Heading>
        <ConnectionStatusIndicator isConnected={connected} />
      </Flex>
      
      <Box flex="1" overflowY="auto" mb={4}>
        {messages.length === 0 ? (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            height="100%"
            color="gray.500"
          >
            <Box mb={4}>Start a conversation with Gemini</Box>
          </Flex>
        ) : (
          <ChatMessages messages={messages} />
        )}
        {isLoading && <Spinner size="sm" ml={2} />}
      </Box>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading || !connected} />
    </Box>
  );
};

export default GeminiCopilot;
