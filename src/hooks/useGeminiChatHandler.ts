import { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useGemini } from '@/components/copilot/GeminiProvider';
import { AIMessage } from '@/services/chat/messageTypes';
import { GeminiMultimodalChat } from '@/services/gemini/multimodal';
import { useImageUpload } from './useImageUpload';

export function useGeminiChatHandler() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isInitialized, isLoading: isProviderLoading, error: providerError, personaData, model } = useGemini();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const multimodalChatRef = useRef<GeminiMultimodalChat | null>(null);
  
  // Image handling
  const {
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  } = useImageUpload();
  
  // Voice recognition
  const {
    isListening,
    transcript,
    toggleListening,
    startListening,
    stopListening,
    resetTranscript,
    voiceError,
    isVoiceSupported
  } = useSpeechRecognition();
  
  // Initialize multimodal chat session
  useEffect(() => {
    if (isInitialized && !multimodalChatRef.current) {
      try {
        const config = localStorage.getItem('GEMINI_CONFIG');
        if (config) {
          const { apiKey } = JSON.parse(config);
          if (apiKey) {
            multimodalChatRef.current = new GeminiMultimodalChat({
              apiKey,
              model: 'gemini-2.0-vision'
            });
          }
        }
      } catch (error) {
        console.error('Error initializing multimodal chat:', error);
      }
    }
  }, [isInitialized]);

  // Get current persona from context
  const currentPersonaName = personaData?.personaDefinitions?.[personaData?.currentPersona]?.name || 'AI Assistant';
  
  // Handle messages container scrolling
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Handle voice transcription
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Add welcome message based on persona
  useEffect(() => {
    if (isInitialized && personaData && messages.length === 0) {
      const persona = personaData.personaDefinitions[personaData.currentPersona];
      if (persona?.welcomeMessage) {
        setMessages([
          {
            role: 'assistant',
            content: persona.welcomeMessage,
            timestamp: Date.now()
          }
        ]);
      }
    }
  }, [isInitialized, personaData, messages.length]);

  const addMessage = (role: 'user' | 'assistant' | 'error', content: string) => {
    const newMessage: AIMessage = {
      role,
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    // Don't send empty messages or while already loading
    if ((!inputValue.trim() && images.length === 0) || isLoading || isUploading) return;
    
    // Stop listening if active
    if (isListening) {
      stopListening();
    }
    
    // Add user message to chat
    addMessage('user', inputValue);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get system instructions from persona if available
      const systemInstructions = personaData?.personaDefinitions?.[personaData?.currentPersona]?.systemInstructions;
      
      let response = '';
      
      // Handle multimodal request if images are present
      if (images.length > 0) {
        if (multimodalChatRef.current) {
          // Use the multimodal chat for ongoing conversation
          const imageData = images.map(img => ({
            mimeType: img.mimeType,
            data: img.data
          }));
          
          response = await multimodalChatRef.current.sendMessage(inputValue, imageData);
        } else {
          // Fallback to one-off request
          const config = localStorage.getItem('GEMINI_CONFIG');
          if (config) {
            const { apiKey } = JSON.parse(config);
            
            if (!apiKey) {
              throw new Error('API key not found');
            }
            
            // Create a new multimodal chat instance
            multimodalChatRef.current = new GeminiMultimodalChat({
              apiKey,
              model: 'gemini-2.0-vision'
            });
            
            // Send the message
            const imageData = images.map(img => ({
              mimeType: img.mimeType,
              data: img.data
            }));
            
            response = await multimodalChatRef.current.sendMessage(inputValue, imageData);
          } else {
            throw new Error('Gemini configuration not found');
          }
        }
      } else if (model) {
        // For text-only conversation
        // Start a chat with the current model
        const chat = model.startChat({
          history: messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          })),
          systemInstruction: systemInstructions
        });
        
        // Send the message
        const result = await chat.sendMessage(inputValue);
        response = result.response.text();
      } else {
        throw new Error('Model not initialized');
      }
      
      // Add assistant response
      addMessage('assistant', response);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Add error message
      addMessage('error', `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsLoading(false);
      setInputValue('');
      clearImages();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
    
    // Clear multimodal chat history
    if (multimodalChatRef.current) {
      multimodalChatRef.current.clearHistory();
    }
  };

  return {
    inputValue,
    setInputValue,
    messages,
    isLoading,
    isProviderLoading,
    isInitialized,
    isListening,
    transcript,
    handleSendMessage,
    handleKeyDown,
    toggleListening,
    clearMessages,
    messagesEndRef,
    currentPersonaName,
    error,
    providerError,
    voiceError,
    isVoiceSupported,
    // Image handling
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  };
}
