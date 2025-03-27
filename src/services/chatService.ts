import { AIMessage, UploadedFile } from '@/services/copilotService';

export const chatService = {
  sendMessage: async (message: string, files: UploadedFile[]): Promise<{ suggestedResponse: string }> => {
    // Simulate an API call to send a message and files
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ suggestedResponse: 'This is a suggested response from the chat service.' });
      }, 1000);
    });
  },

  uploadFile: async (file: UploadedFile): Promise<UploadedFile> => {
    // Simulate an API call to upload a file
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(file);
      }, 1000);
    });
  }
};
