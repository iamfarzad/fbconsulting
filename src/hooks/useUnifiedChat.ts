import { useState, useRef, useCallback } from 'react';
import { Message } from '@/types/message';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import { useToast } from '@/hooks/use-toast';

interface UseUnifiedChatProps {
  apiKey?: string;
  modelName?: string;
  enableTTS?: boolean;
}

export function useUnifiedChat({
  apiKey,
  modelName,
  enableTTS = true
}: UseUnifiedChatProps = {}) {
  // State
  const [inputValue, setInputValue] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mediaItems, setMediaItems] = useState<Array<{type: string, data: string, name: string, mimeType?: string}>>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Use Gemini Provider
  const {
    sendMessage: geminiSendMessage,
    messages,
    isProcessing: isLoading,
    error,
    isConnected,
    clearMessages
  } = useGemini();
  
  // Handle sending a message
  const sendMessage = useCallback((text: string, files: any[] = []) => {
    if (!text.trim() && (!files || files.length === 0)) return;
    
    // Send message through Gemini provider
    geminiSendMessage({
      type: 'text_message',
      text,
      enableTTS,
      files: files.map(file => ({
        mime_type: file.mimeType || '',
        data: file.data,
        filename: file.name
      }))
    }).catch(error => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    });
    
    // Clear input and media
    setInputValue('');
    setMediaItems([]);
  }, [geminiSendMessage, enableTTS, toast]);
  
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
  
  return {
    // State
    messages,
    inputValue,
    isLoading,
    isConnected,
    error,
    isFullScreen,
    containerRef,
    files: mediaItems,
    isUploading,
    
    // Actions
    setInputValue,
    sendMessage,
    clearMessages,
    toggleFullScreen,
    setIsFullScreen,
    uploadFile,
    removeFile
  };
}

export default useUnifiedChat;
