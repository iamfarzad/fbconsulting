import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGemini } from '@/components/copilot/providers/GeminiProvider'; // Import the context hook
// import API_CONFIG from '@/config/apiConfig'; // No longer needed for direct connection

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Define file state interface (as before)
interface FileState {
  data: string; 
  mimeType: string;
  name: string;
  type: 'image' | 'document';
  preview?: string;
}

// Define chat message interface (as before)
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  files?: Pick<FileState, 'name' | 'type'>[]; 
}

// This hook now focuses on managing UI state and interacting with the GeminiProvider context
export function useWebSocketChatLogic() {
  // --- Local UI State --- 
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Manages the visual message list
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // Tracks if waiting for response
  const [files, setFiles] = useState<FileState[]>([]); // Manages attached files for input
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // --- Get Connection State & Methods from Context --- 
  const {
    sendMessage: contextSendMessage, // Renamed for clarity
    isConnected,
    isConnecting,
    error: connectionError,
    resetError: resetConnectionError,
    reconnect,
    // Need message receiving mechanism from provider!
    // TODO: Modify GeminiProvider to allow subscribing to messages
    // For now, this hook cannot receive messages directly from the WebSocket via context.
  } = useGemini();

  // Map context status for UI
  const status: ConnectionStatus = isConnecting ? 'connecting' : 
                                   isConnected ? 'connected' : 
                                   connectionError ? 'error' : 'disconnected';

  // TODO: Implement logic to receive messages from GeminiProvider
  // This likely involves GeminiProvider exposing messages via context value
  // or allowing registration of a message handler callback.
  useEffect(() => {
    // Placeholder: This effect should ideally react to new messages from the context
    // and update the local `messages` state.
    // Example (conceptual - requires GeminiProvider changes):
    // const unsubscribe = GeminiProvider.subscribeToMessages((newMessage) => {
    //   if (newMessage.type === 'text') { ... handle text ... }
    //   if (newMessage.type === 'complete') { setIsProcessing(false); }
    //   if (newMessage.type === 'error') { setIsProcessing(false); }
    // });
    // return () => unsubscribe(); 

    // Temporary workaround: Log status changes
    console.log(`[useWebSocketChatLogic] Context status: ${status}, Error: ${connectionError}`);
    if (status === 'connected') {
        setIsProcessing(false); // Assume connection means not processing initially
    }
    if (connectionError) {
        toast({ title: "Connection Error", description: connectionError, variant: "destructive" });
    }

  }, [status, connectionError, toast]);


  // --- Auto-scroll Effect --- 
  useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Send Message Logic (Uses contextSendMessage) ---
  const handleSendMessage = useCallback(async () => { // Make async to await context send
    if ((!input.trim() && files.length === 0) || isProcessing) return;
    
    if (!isConnected) {
      console.error('[useWebSocketChatLogic] Cannot send: Not connected.');
      toast({ title: "Connection Error", description: "Not connected.", variant: "destructive" });
      reconnect(); // Attempt reconnect via context
      return;
    }
    
    const userMessageContent = input;
    const userFiles = [...files];
    
    const userDisplayMessage: ChatMessage = {
      role: 'user',
      content: userMessageContent,
      files: userFiles.map(f => ({ name: f.name, type: f.type })), 
      timestamp: Date.now(),
      id: `user-${Date.now()}`,
    };
    setMessages(prev => [...prev, userDisplayMessage]);
    setInput(''); setFiles([]); setIsProcessing(true);

    try {
      let messageToSend: any;
      let messageContentForContext: string; // What GeminiProvider.sendMessage expects

      if (userFiles.length > 0) {
        const fileDataToSend = userFiles.map(file => {
          const base64Data = file.data.split(',')[1]; 
          if (!base64Data) throw new Error(`Invalid data URL for file ${file.name}`);
          return { mime_type: file.mimeType, data: base64Data, filename: file.name };
        });
        // TODO: GeminiProvider needs enhancement for multimodal
        // Sending only text for now, log warning
        console.warn("[useWebSocketChatLogic] Multimodal message prepared, but GeminiProvider currently only sends text. Sending only text content.");
        messageToSend = { type: 'multimodal_message', text: userMessageContent || null, files: fileDataToSend, role: 'user', enableTTS: true };
        messageContentForContext = userMessageContent || ""; // Send empty string if no text

      } else {
        messageToSend = { type: 'text_message', text: userMessageContent, role: 'user', enableTTS: true };
        messageContentForContext = userMessageContent;
      }
      
      console.log('[useWebSocketChatLogic] Sending message via context:', messageToSend);
      // Use the sendMessage function from GeminiContext, passing only the text content for now
      await contextSendMessage(messageContentForContext); 

      // PROBLEM: Need a way to know when response is complete to set isProcessing false.

    } catch (error: any) {
      console.error('[useWebSocketChatLogic] Send Error:', error);
      toast({ title: "Send Error", description: error?.message || "Failed to send.", variant: "destructive" });
      setIsProcessing(false); 
      setMessages(prev => prev.filter(msg => msg.id !== userDisplayMessage.id)); // Revert optimistic UI
    }
  // Dependencies include context methods/state
  }, [input, files, isProcessing, isConnected, toast, contextSendMessage, reconnect]);

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
  const clearMessages = useCallback(() => { setMessages([]); }, []);

  // --- Return Hook Values ---
  return {
    messages,       // Local messages (needs update from context)
    setMessages,    // Allow parent to push updates
    input,
    setInput,
    status,         // Derived from context
    connectionError, // From context
    isProcessing,   // Local processing state (needs improvement)
    messageEndRef,
    files,
    setFiles, 
    handleSendMessage, // Now uses context
    handleFileUpload,
    removeFile,
    clearMessages,
    reconnect       // From context
  };
}
