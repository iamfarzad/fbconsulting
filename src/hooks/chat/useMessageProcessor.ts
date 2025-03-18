
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { generateResponse } from '@/services/chat/responseGenerator';
import { sendMultimodalRequest } from '@/services/gemini';

/**
 * Hook to process and send chat messages
 */
export function useMessageProcessor() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Process and send a text-only message
  const processTextMessage = async (
    message: string,
    leadInfo: LeadInfo
  ): Promise<string> => {
    try {
      // Generate a response based on the message and lead info
      return generateResponse(message, leadInfo);
    } catch (error) {
      console.error("Error processing text message:", error);
      throw error;
    }
  };

  // Process and send a multimodal message (text + images)
  const processMultimodalMessage = async (
    message: string,
    images: { mimeType: string, data: string, preview: string }[],
    apiKey: string
  ): Promise<string> => {
    try {
      // Format images for the API
      const imageData = images.map(img => ({
        mimeType: img.mimeType,
        data: img.data
      }));
      
      // Send the multimodal request
      return await sendMultimodalRequest(
        message,
        imageData,
        { 
          apiKey, 
          model: 'gemini-2.0-vision'
        }
      );
    } catch (error) {
      console.error("Error processing multimodal message:", error);
      throw error;
    }
  };

  return {
    isLoading,
    setIsLoading,
    processTextMessage,
    processMultimodalMessage
  };
}
