import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGemini } from '@/components/copilot/providers/GeminiProvider'; 

// Define file state interface
interface FileState {
  data: string; 
  mimeType: string;
  name: string;
  type: 'image' | 'document';
  preview?: string;
}

// Note: The ChatMessage type might ideally come from a shared types definition
interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'error'; // Match ProviderMessage roles
  content: string;
  timestamp: number;
  id: string;
  files?: Pick<FileState, 'name' | 'type'>[]; 
}

// Hook focuses ONLY on UI state for chat input/display, using GeminiProvider for connection/messages
export function useWebSocketChatLogic() {
  // --- Local UI State (Input & Files) --- 
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileState[]>([]); 
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // --- Get State & Methods from Central Gemini Context --- 
  const {
    sendMessage: contextSendMessage,
    messages: contextMessages, // Get messages from the provider
    isConnected,
    isConnecting,
    isProcessing: contextIsProcessing, // Use processing state from provider
    error: connectionError,
    reconnect,
    clearMessages: contextClearMessages, // Use clear function from provider
  } = useGemini();

  // Map context status for UI
  const status = isConnecting ? 'connecting' : 
                 isConnected ? 'connected' : 
                 connectionError ? 'error' : 'disconnected';

  // --- Auto-scroll Effect --- 
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contextMessages]); // Scroll when messages from context change

  // --- Send Message Logic (Uses contextSendMessage) ---
  const handleSendMessage = useCallback(async () => {
    if ((!input.trim() && files.length === 0) || contextIsProcessing) return;
    
    if (!isConnected) {
      toast({ title: "Not Connected", variant: "destructive" });
      reconnect(); 
      return;
    }
    
    const userMessageContent = input;
    const userFiles = [...files];
    
    // Clear local input state immediately
    setInput(''); 
    setFiles([]); 
    
    // Let the context handle optimistic updates if desired, or adjust here
    // For now, this hook doesn't manage the message list directly

    try {
      let messageToSend: any; // Use the OutgoingWebSocketMessage type ideally
      if (userFiles.length > 0) {
        const fileDataToSend = userFiles.map(file => {
          const base64Data = file.data.split(',')[1]; 
          if (!base64Data) throw new Error(`Invalid data URL for file ${file.name}`);
          return { mime_type: file.mimeType, data: base64Data, filename: file.name };
        });
        messageToSend = { type: 'multimodal_message', text: userMessageContent || null, files: fileDataToSend };
      } else {
        messageToSend = { type: 'text_message', text: userMessageContent };
      }
      
      console.log('[useWebSocketChatLogic] Sending via context:', messageToSend);
      await contextSendMessage(messageToSend); // Send the structured message

    } catch (error: any) {
      console.error('[useWebSocketChatLogic] Send Error:', error);
      toast({ title: "Send Error", description: error?.message || "Failed to send.", variant: "destructive" });
      // UI already cleared, context provider should handle error message display?
    }
  }, [input, files, contextIsProcessing, isConnected, toast, contextSendMessage, reconnect]);

  // --- File Handling Callbacks (Remain the same) ---
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';
      setFiles(prev => [...prev, { data: result, mimeType: file.type, name: file.name, type: fileType, preview: fileType === 'image' ? result : undefined }]);
    };
    reader.onerror = (error) => { console.error("FileReader error:", error); toast({title: "File Error", description: "Could not read file.", variant: "destructive"}); };
    reader.readAsDataURL(file);
    if (event.target) event.target.value = ''; 
  }, [toast]);

  const removeFile = useCallback((index: number) => { setFiles(prev => prev.filter((_, i) => i !== index)); }, []);
  
  // --- Return Hook Values ---
  return {
    messages: contextMessages, // Pass messages from context
    input,
    setInput,
    status,         
    connectionError, 
    isProcessing: contextIsProcessing, // Pass processing state from context
    messageEndRef,
    files,         // Local file state for input
    setFiles, 
    handleSendMessage, 
    handleFileUpload,
    removeFile,
    clearMessages: contextClearMessages, // Use context clear function
    reconnect       
  };
}
