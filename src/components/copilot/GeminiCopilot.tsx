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
<<<<<<< HEAD
            <Box mb={4}>Start a conversation with Gemini</Box>
          </Flex>
        ) : (
          <ChatMessages messages={messages} />
        )}
        {isLoading && <Spinner size="sm" ml={2} />}
      </Box>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading || !connected} />
    </Box>
=======
            Get Started
          </button>
        </div>
      )}

      {step === 'chooseAction' && <ChooseAction />}

      {step === 'form' && (
        <div className="space-y-4 p-4">
          <h3 className="text-xl font-semibold">Your Information</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded"
              onChange={(e) => setUserInfo({ ...userInfo || { email: '' }, name: e.target.value })}
              value={userInfo?.name || ''}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              onChange={(e) => setUserInfo({ ...userInfo || { name: '' }, email: e.target.value })}
              value={userInfo?.email || ''}
            />
            <button
              onClick={() => {
                if (userInfo?.name && userInfo?.email) {
                  setStep('chat');
                }
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded"
              disabled={!userInfo?.name || !userInfo?.email}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 'chat' && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {Array.isArray(messages) ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg max-w-[80%]",
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              ))
            ) : (
              <div className="text-center text-red-500">
                Invalid messages format. Please try again.
              </div>
            )}
          </div>

          {/* Voice Controls */}
          <div className="flex items-center gap-4">
            {transcript && (
              <div className="flex-1 p-2 bg-muted rounded">
                {transcript}
              </div>
            )}
            <UnifiedVoiceUI
              isListening={isListening}
              toggleListening={toggleListening}
              isPlaying={isPlaying}
              progress={progress}
              stopAudio={stopAudio}
              onVoiceInput={sendMessage}
              onGenerateAudio={async (text) => {
                await generateAndPlayAudio(text);
                // Return a dummy Blob since we handle audio playback internally
                return new Blob([''], { type: 'audio/mpeg' });
              }}
            />
          </div>

          {/* Error Display */}
          {voiceError && (
            <div className="text-sm text-red-500">
              {voiceError}
            </div>
          )}
        </>
      )}

      {step === 'proposal' && proposal && (
        <ProposalPreview
          userInfo={userInfo!}
          messages={messages}
          onSend={handleSendProposal}
          onStartOver={handleStartOver}
        />
      )}
    </div>
>>>>>>> origin/fix-map-bug
  );
};

export default GeminiCopilot;
