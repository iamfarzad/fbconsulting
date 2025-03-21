
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

  // Process and send a text-only message (fallback for when Gemini is not available)
  const processTextMessage = async (
    message: string, 
    leadInfo: LeadInfo
  ): Promise<string> => {
    try {
      // Generate a response based on the message and lead info using mock generator
      return generateResponse(message, leadInfo);
    } catch (error) {
      console.error("Error processing text message:", error);
      throw error;
    }
  };

  // Process and send a multimodal message (text + optional images)
  const processMultimodalMessage = async (
    message: string,
    images: { mimeType: string, data: string, preview?: string }[] = [],
    apiKey: string
  ): Promise<string> => {
    try {
      // Format images for the API if we have any
      let imageData: {mimeType: string, data: string}[] = [];
      
      if (images && images.length > 0) {
        imageData = images.map(img => ({
          mimeType: img.mimeType,
          data: img.data
        }));
      }
      
      // Send the request - Gemini works with or without images
      return await sendMultimodalRequest(
        message,
        imageData,
        { 
          apiKey, 
          model: images.length > 0 ? 'gemini-2.0-flash' : 'gemini-2.0-flash'
        }
      );
    } catch (error) {
      console.error("Error processing message with Gemini:", error);
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
