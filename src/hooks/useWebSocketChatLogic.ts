import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
// Use the default export which contains the processed config
import API_CONFIG from '@/config/apiConfig'; 

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Define a more specific FileState if needed, matching the backend expectation eventually
interface FileState {
  data: string; // Data URL for preview, Base64 extracted on send
  mimeType: string;
  name: string;
  type: 'image' | 'document';
  preview?: string;
}

// Define a clearer Message interface
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  // Add optional fields if needed, e.g., for file attachments in UI
  files?: Pick<FileState, 'name' | 'type'>[]; 
}

export function useWebSocketChatLogic() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isProcessing, setIsProcessing] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const { toast } = useToast();
  
  // Generate a client ID that persists for the session
  const clientIdRef = useRef<string>(`web-client-${Math.random().toString(36).substring(2, 9)}`);

  // MOVE Files state declaration BEFORE handleSendMessage
  const [files, setFiles] = useState<FileState[]>([]);

  // --- Audio Handling (Define BEFORE handleIncomingMessage) ---
  const handleAudioChunk = useCallback((audioBlob: Blob) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        // Optionally show a toast to the user
        // toast({ title: "Audio Playback Error", description: "Could not play audio response.", variant: "destructive" });
      });
      
      // Clean up the audio URL when done
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = (e) => {
        console.error('Audio element error:', e);
        URL.revokeObjectURL(audioUrl); // Clean up even on error
      };
    } catch (error) {
      console.error('Error processing audio Blob:', error);
    }
  }, []); // Empty dependency array assuming no external dependencies needed


  // --- WebSocket Connection Logic ---
  const connectWebSocket = useCallback(() => {
      if (socketRef.current || status === 'connecting') {
          console.log("Connection attempt already in progress or connected.");
          return; // Avoid multiple connections
      }
      
      setStatus('connecting');
      console.log(`Attempting WebSocket connection (Attempt: ${reconnectAttemptsRef.current + 1})...`);
      
      // Construct URL correctly using WS_BASE_URL and WEBSOCKET.PATH
      const wsUrl = `${API_CONFIG.WS_BASE_URL}${API_CONFIG.WEBSOCKET.PATH}${clientIdRef.current}`;
      
      // **** ADD EXPLICIT LOG HERE ****
      console.log(`>>> Trying to connect WebSocket to: ${wsUrl}`); 
      
      let socket: WebSocket;
      try {
          socket = new WebSocket(wsUrl);
      } catch (error) {
          console.error('WebSocket constructor error:', error);
          setStatus('error');
          handleDisconnect(); // Trigger disconnect handling
          return;
      }

      // Clear any existing retry timeout
      if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
      }

      socket.onopen = () => {
          console.log('WebSocket connected successfully.');
          setStatus('connected');
          reconnectAttemptsRef.current = 0; // Reset attempts on successful connection

          // Start client-side ping
          const pingInterval = setInterval(() => {
              if (socket.readyState === WebSocket.OPEN) {
                  console.debug('Sending client ping');
                  socket.send(JSON.stringify({ type: 'ping' }));
              } else {
                  clearInterval(pingInterval); // Stop pinging if not open
              }
          }, API_CONFIG.DEFAULT_PING_INTERVAL);

          // Assign cleanup for the interval within onclose
          socket.onclose = (event) => handleDisconnect(event, pingInterval);
          socketRef.current = socket; // Assign socket to ref after setup
      };

      socket.onerror = (event) => {
          console.error('WebSocket error:', event);
          setStatus('error');
          // Don't auto-reconnect immediately on error, let onclose handle it
      };

      socket.onmessage = handleIncomingMessage; // Separate message handling logic

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // Re-run only if status changes significantly?

  // --- Disconnect and Reconnect Logic ---
  const handleDisconnect = useCallback((event?: CloseEvent, pingIntervalId?: NodeJS.Timeout) => {
      console.log(`WebSocket disconnected. Code: ${event?.code}, Reason: ${event?.reason}`);
      if (pingIntervalId) clearInterval(pingIntervalId);
      setStatus('disconnected');
      socketRef.current = null;

      // Reconnect logic
      if (reconnectAttemptsRef.current < API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1); // Exponential backoff
          console.log(`Attempting reconnect ${reconnectAttemptsRef.current}/${API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS} in ${delay}ms...`);
          
          // Clear previous timeout if any
          if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
          
          retryTimeoutRef.current = setTimeout(() => {
              connectWebSocket();
          }, delay);
      } else {
          console.error('Max reconnect attempts reached. Giving up.');
          toast({ title: "Connection Lost", description: "Could not reconnect to the server.", variant: "destructive" });
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectWebSocket, toast]); // Need connectWebSocket here

  // --- Incoming Message Handler ---
  const handleIncomingMessage = useCallback((event: MessageEvent) => {
      try {
          if (event.data instanceof Blob) {
              // Use the handleAudioChunk defined above
              handleAudioChunk(new Blob([event.data], { type: 'audio/mp3' })); // Assuming mp3
              return;
          }

          const data = JSON.parse(event.data);
          // console.debug('Received WebSocket data:', data);

          switch (data.type) {
              case 'text':
                  setMessages(prev => {
                      const lastMessage = prev[prev.length - 1];
                      if (lastMessage?.role === 'assistant') {
                          // Append to the last assistant message
                          const updatedMessages = [...prev];
                          updatedMessages[prev.length - 1] = { ...lastMessage, content: data.content }; // Replace content
                          return updatedMessages;
                      } else {
                          // Start a new assistant message
                          return [...prev, { role: 'assistant', content: data.content, timestamp: Date.now(), id: `ai-${Date.now()}` }];
                      }
                  });
                  break;
              case 'complete':
                  setIsProcessing(false);
                  console.log("Assistant message complete.");
                  break;
              case 'audio_chunk_info':
                  // console.debug(`Audio chunk info: size=${data.size}, format=${data.format}`);
                  break; // Info only, Blob handler deals with data
              case 'error':
                  console.error('Server processing error:', data.error);
                  toast({ title: "Server Error", description: data.error || "An error occurred.", variant: "destructive" });
                  setIsProcessing(false);
                  break;
              case 'pong':
                  console.debug('Client Pong Received'); // Response to our ping
                  break;
              case 'server_ping':
                  console.debug('Server Ping Received, sending pong');
                  if (socketRef.current?.readyState === WebSocket.OPEN) {
                      socketRef.current.send(JSON.stringify({ type: 'client_pong' }));
                  }
                  break;
              default:
                  console.warn('Unhandled message type:', data.type, data);
          }
      } catch (err) {
          console.error('Error handling incoming message:', err, event.data);
      }
  // Pass handleAudioChunk in dependency array
  }, [handleAudioChunk, toast]); 

  // --- Effect to Initiate Connection --- 
  useEffect(() => {
      // Only connect if disconnected and not already trying
      if (status === 'disconnected' && !socketRef.current && !retryTimeoutRef.current) {
          reconnectAttemptsRef.current = 0; // Reset attempts when manually initiating
          connectWebSocket();
      }

      // Cleanup function
      return () => {
          if (retryTimeoutRef.current) {
              clearTimeout(retryTimeoutRef.current);
              retryTimeoutRef.current = null;
          }
          if (socketRef.current) {
              console.log('Closing WebSocket connection via cleanup effect.');
              socketRef.current.onclose = null; // Avoid triggering reconnect on manual close
              socketRef.current.close();
              socketRef.current = null;
          }
      };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // Re-run connection logic if status changes to disconnected?

  // --- Auto-scroll Effect ---
  useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Send Message Logic ---
  const handleSendMessage = useCallback(() => {
    if ((!input.trim() && files.length === 0) || isProcessing) { // Removed status check, let send attempt handle it
      console.warn('Send message blocked:', { inputEmpty: !input.trim(), filesEmpty: files.length === 0, isProcessing });
      return;
    }
    
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('Cannot send: WebSocket not connected.');
      toast({ title: "Connection Error", description: "Not connected. Please wait or refresh.", variant: "destructive" });
      // Attempt reconnect if disconnected?
      if(status === 'disconnected') connectWebSocket();
      return;
    }
    
    try {
      const userMessageContent = input;
      const userFiles = [...files]; // Copy files state
      
      // Optimistically add user message to UI
      const userDisplayMessage: ChatMessage = {
        role: 'user',
        content: userMessageContent,
        files: userFiles.map(f => ({ name: f.name, type: f.type })), // Only add minimal file info for display
        timestamp: Date.now(),
        id: `user-${Date.now()}`,
      };
      setMessages(prev => [...prev, userDisplayMessage]);
      setInput(''); 
      setFiles([]); 
      setIsProcessing(true);
      
      // Prepare message payload
      let messageToSend: any;
      if (userFiles.length > 0) {
        // Extract base64 data from data URLs
        const fileDataToSend = userFiles.map(file => {
          const base64Data = file.data.split(',')[1]; 
          if (!base64Data) throw new Error(`Invalid data URL for file ${file.name}`);
          return { mime_type: file.mimeType, data: base64Data, filename: file.name };
        });
        
        messageToSend = {
          type: 'multimodal_message',
          text: userMessageContent || null, // Send null if text is empty
          files: fileDataToSend,
          role: 'user',
          // TODO: Get TTS preference from UI state
          enableTTS: true 
        };
        console.log(`Sending multimodal message with ${fileDataToSend.length} files.`);

      } else {
        messageToSend = {
          type: 'text_message',
          text: userMessageContent,
          role: 'user',
          enableTTS: true 
        };
        console.log(`Sending text message.`);
      }
      
      socketRef.current.send(JSON.stringify(messageToSend));
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({ title: "Send Error", description: error?.message || "Failed to send.", variant: "destructive" });
      setIsProcessing(false); // Reset processing on error
    }
  }, [input, files, isProcessing, status, toast, connectWebSocket]); // Add connectWebSocket to deps

  // --- File Handling Callbacks ---
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string; // Data URL
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';
      setFiles(prev => [...prev, {
        data: result, mimeType: file.type, name: file.name, type: fileType,
        preview: fileType === 'image' ? result : undefined
      }]);
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      toast({title: "File Error", description: "Could not read the file.", variant: "destructive"});
    };
    reader.readAsDataURL(file);
    if (event.target) event.target.value = ''; // Reset input
  }, [toast]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    // Optionally send a reset signal to backend if needed
  }, []);

  // --- Return Hook Values ---
  return {
    messages,
    input,
    setInput,
    status,
    isProcessing,
    messageEndRef,
    files,
    setFiles, // Expose setter
    handleSendMessage,
    handleFileUpload,
    removeFile,
    clearMessages
  };
}
