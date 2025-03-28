
import { useState, useRef, useCallback, useEffect } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { useGeminiWebSocket } from '@/features/gemini/hooks/useGeminiWebSocket';
import { useToast } from '@/hooks/use-toast';
import { useGeminiInitialization } from '@/hooks/gemini/useGeminiInitialization';

interface UseUnifiedChatProps {
  apiKey?: string;
  modelName?: string;
  autoConnect?: boolean;
  enableTTS?: boolean;
}

export function useUnifiedChat({
  apiKey,
  modelName,
  autoConnect = true,
  enableTTS = true
}: UseUnifiedChatProps = {}) {
  // State
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mediaItems, setMediaItems] = useState<Array<{type: string, data: string, name: string, mimeType?: string}>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { hasApiKey, getApiKey } = useGeminiInitialization();
  
  // Extract messages with role != 'system'
  const visibleMessages = messages.filter(msg => msg.role !== 'system');
  
  // WebSocket connection for real-time communication
  const {
    isConnected,
    isConnecting,
    error: wsError,
    connect,
    disconnect,
    sendMessage: sendWsMessage
  } = useGeminiWebSocket({
    onTextMessage: (text) => {
      addMessage('assistant', text);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    },
    onComplete: () => {
      setIsLoading(false);
    }
  });
  
  // Add a message to the chat
  const addMessage = useCallback((role: 'user' | 'assistant' | 'system' | 'error', content: string) => {
    const newMessage: AIMessage = {
      role,
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);
  
  // Handle sending a message
  const sendMessage = useCallback((text: string, files: any[] = []) => {
    if (!text.trim() && (!files || files.length === 0)) return;
    
    setIsLoading(true);
    
    // Add user message to chat
    addMessage('user', text);
    
    // Clear input
    setInputValue('');
    
    // Reset media items
    setMediaItems([]);
    
    // Send to WebSocket if connected
    if (isConnected) {
      sendWsMessage(text, enableTTS);
    } else {
      // Fallback to mock response if not connected
      setTimeout(() => {
        addMessage('assistant', 'I\'m sorry, I\'m currently offline. Please try again later.');
        setIsLoading(false);
      }, 1000);
    }
    
    // Show messages after sending
    setShowMessages(true);
  }, [addMessage, isConnected, sendWsMessage, enableTTS]);
  
  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setShowMessages(false);
  }, []);
  
  // Toggle fullscreen mode
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);
  
  // File upload handlers
  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      
      const fileLoadPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(file);
      const data = await fileLoadPromise;
      
      setMediaItems(prev => [...prev, {
        type: file.type.startsWith('image/') ? 'image' : 'document',
        data,
        name: file.name,
        mimeType: file.type
      }]);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been added to your message.`
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast]);
  
  const removeFile = useCallback((index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  // Auto-connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect && hasApiKey()) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect, hasApiKey]);
  
  return {
    // State
    messages: visibleMessages,
    inputValue,
    isLoading,
    showMessages,
    isConnected,
    isConnecting,
    error: wsError,
    isFullScreen,
    suggestedResponse,
    containerRef,
    files: mediaItems,
    isUploading,
    
    // Actions
    setInputValue,
    sendMessage,
    clearMessages,
    toggleFullScreen,
    setIsFullScreen,
    setShowMessages,
    connect,
    disconnect,
    uploadFile,
    removeFile
  };
}

export default useUnifiedChat;
