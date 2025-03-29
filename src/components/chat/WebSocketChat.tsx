
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGemini } from '@/components/copilot/providers/GeminiProvider'; // Use the central context
// Correct the import name using an alias
import { ChatInputBox as ChatInput } from '@/components/ui/ai-chat/input/ChatInputBox'; 
import { ChatMessages } from '@/components/ui/ai-chat/ChatMessageList';
import { FilePreview } from '@/components/ui/ai-chat/input/MediaPreview';
import { ConnectionStatusIndicator } from '@/components/ui/ai-chat/ConnectionStatusIndicator'; 
import { TypingIndicator } from '@/components/ui/ai-chat/TypingIndicator';
import { useToast } from '@/hooks/use-toast'; // Import toast

// Define file state interface locally (or import from types if centralized)
interface FileState {
  data: string; 
  mimeType: string;
  name: string;
  type: 'image' | 'document';
  preview?: string;
}

export function WebSocketChat() {
  // Get state and handlers from the central Gemini context
  const {
    messages: contextMessages, 
    sendMessage: contextSendMessage, 
    isConnected, 
    isConnecting, 
    isProcessing: contextIsProcessing, 
    error: contextError,
    reconnect: contextReconnect,
    clearMessages: contextClearMessages
  } = useGemini();

  // Local state needed for input controls
  const [localInput, setLocalInput] = React.useState('');
  const [localFiles, setLocalFiles] = React.useState<FileState[]>([]); 
  const localMessageEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null); // Ref for ChatInputBox
  const { toast } = useToast();

  // Recreate handlers using context sendMessage
  const handleSendMessage = useCallback(async () => {
    const textToSend = localInput.trim();
    const filesToSend = [...localFiles];
    
    if ((!textToSend && filesToSend.length === 0) || contextIsProcessing) return;
    
    if (!isConnected) {
      toast({ title: "Not Connected", description: "Attempting to reconnect...", variant: "destructive" });
      contextReconnect(); 
      return;
    }

    // Clear local input state immediately
    setLocalInput(''); 
    setLocalFiles([]); 

    try {
      let messagePayload: any;
      if (filesToSend.length > 0) {
        const fileData = filesToSend.map(file => {
          const base64Data = file.data.split(',')[1]; 
          if (!base64Data) throw new Error(`Invalid data URL for file ${file.name}`);
          return { mime_type: file.mimeType, data: base64Data, filename: file.name };
        });
        messagePayload = { type: 'multimodal_message', text: textToSend || null, files: fileData };
      } else {
        messagePayload = { type: 'text_message', text: textToSend };
      }
      
      console.log('[WebSocketChat] Sending via context:', messagePayload);
      await contextSendMessage(messagePayload); // Send the structured message

    } catch (error: any) {
      console.error('[WebSocketChat] Send Error:', error);
      toast({ title: "Send Error", description: error?.message || "Failed to send.", variant: "destructive" });
    }
  }, [localInput, localFiles, contextIsProcessing, isConnected, contextSendMessage, contextReconnect, toast]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent newline
        handleSendMessage();
      }
    }, [handleSendMessage]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';
      setLocalFiles([{ data: result, mimeType: file.type, name: file.name, type: fileType, preview: fileType === 'image' ? result : undefined }]);
    };
    reader.onerror = (error) => { console.error("FileReader error:", error); toast({title: "File Error", description: "Could not read file.", variant: "destructive"}); };
    reader.readAsDataURL(file);
    if (event.target) event.target.value = ''; 
  }, [toast]);

  const removeFile = useCallback((index: number) => {
    setLocalFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Map context status for the indicator
  const connectionStatus = isConnecting ? 'connecting' : 
                           isConnected ? 'connected' : 
                           contextError ? 'error' : 'disconnected';

  // Auto-scroll based on context messages
  useEffect(() => {
    localMessageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contextMessages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [localInput]);

  return (
    <div className="flex flex-col h-full bg-background text-foreground border border-border rounded-lg shadow-md">
      {/* Header with connection status */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Assistant Chat</h2>
        <ConnectionStatusIndicator 
          status={connectionStatus} 
          error={contextError}
          onRetry={contextReconnect} 
        />
      </div>

      {/* Message List Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <ChatMessages messages={contextMessages.map(msg => ({...msg, isUser: msg.role === 'user'}))} /> 
        {contextIsProcessing && <TypingIndicator />} 
        <div ref={localMessageEndRef} />
      </div>

      {/* Input Area */} 
      <div className="p-4 border-t border-border bg-muted/50">
         {localFiles.length > 0 && (
           <div className="mb-2 flex flex-wrap gap-2">
             {localFiles.map((file, index) => (
               <FilePreview key={index} file={file} onRemove={() => removeFile(index)} />
             ))}
           </div>
         )}
        <ChatInput // Use the alias ChatInput which points to ChatInputBox
          textareaRef={textareaRef}
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          onKeyDown={handleKeyDown} // Use Enter key handler
          placeholder="Ask anything or drop a file..."
          disabled={!isConnected || contextIsProcessing}
          // Need to add props for file input button and send button interaction
          // onSend={handleSendMessage} - This might be triggered by button in actual ChatInput component
          // onFileChange={handleFileUpload} - This might be triggered by button
        />
        {/* Need to add the action buttons (send, file upload) here or as part of ChatInput */}
      </div>
    </div>
  );
}

// Ensure FilePreview props match usage
interface FilePreviewProps {
  file: FileState; // Use the local FileState interface
  onRemove: () => void;
}

