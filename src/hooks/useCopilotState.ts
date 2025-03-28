import { useState, useEffect } from 'react';
import { AIMessage } from '@/services/copilotService';
import { chatService } from '@/services/chatService';

export const useCopilotState = (initialMessages: AIMessage[], chatService: typeof chatService) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onClear = () => {
    setInputValue('');
    setFiles([]);
  };

  const uploadFile = (file: UploadedFile) => {
    setIsUploading(true);
    chatService.uploadFile(file)
      .then((uploadedFile) => {
        setFiles((prevFiles) => [...prevFiles, uploadedFile]);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const removeFile = (file: UploadedFile) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const onSendMessage = async () => {
    if (!inputValue.trim() && files.length === 0) return;

    setIsLoading(true);
    try {
      const response = await chatService.sendMessage(inputValue, files);
      setSuggestedResponse(response.suggestedResponse);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      onClear();
    }
  };

  useEffect(() => {
    if (initialMessages.length > 0) {
      setSuggestedResponse(initialMessages[0].content);
    }
  }, [initialMessages]);

  return {
    inputValue,
    setInputValue,
    isLoading,
    suggestedResponse,
    onClear,
    files,
    uploadFile,
    removeFile,
    isUploading,
    onSendMessage,
  };
};
