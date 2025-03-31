import { useCallback } from 'react';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import { useToast } from '@/hooks/use-toast';

interface UseGeminiServiceProps {
  onError?: (error: string) => void;
  onMessageStart?: () => void;
  onMessageComplete?: () => void;
}

export function useGeminiService({
  onError,
  onMessageStart,
  onMessageComplete
}: UseGeminiServiceProps = {}) {
  const {
    sendMessage: geminiSendMessage,
    messages,
    isProcessing,
    error: geminiError,
    clearMessages
  } = useGemini();

  const { toast } = useToast();

  const handleError = useCallback((errorMsg: string) => {
    if (onError) onError(errorMsg);
    toast({
      title: "Error",
      description: errorMsg,
      variant: "destructive"
    });
  }, [onError, toast]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    try {
      if (onMessageStart) onMessageStart();

      await geminiSendMessage({
        type: 'text_message',
        text: content,
        enableTTS: true
      });

      if (onMessageComplete) onMessageComplete();
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Failed to send message');
    }
  }, [geminiSendMessage, handleError, onMessageStart, onMessageComplete]);

  return {
    messages,
    isProcessing,
    error: geminiError,
    sendMessage,
    clearMessages
  };
}

export default useGeminiService;
