import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Mic, X, Image as ImageIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';
import { useFileUpload, UploadedFile } from '@/hooks/useFileUpload';
import { MediaPreview } from '@/components/ui/ai-chat/input/MediaPreview';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
};

export function WebSocketChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isProcessing, setIsProcessing] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    files, 
    isUploading, 
    uploadFile, 
    removeFile, 
    clearFiles 
  } = useFileUpload();

  // Generate a client ID that persists for the session
  const clientIdRef = useRef<string>(`web-client-${Math.random().toString(36).substring(2, 9)}`);

  // Set up WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      setStatus('connecting');
      
      try {
        const wsUrl = `${API_CONFIG.WS_BASE_URL}/ws/${clientIdRef.current}`;
        const socket = new WebSocket(wsUrl);
        
        socket.onopen = () => {
          console.log('WebSocket connected');
          setStatus('connected');
          // Start regular pings to keep the connection alive
          const pingInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: 'ping' }));
            }
          }, 30000); // 30 second ping

          // Store the interval ID in the ref so we can clear it on disconnect
          socketRef.current = socket;
          
          // Clean up the interval when the socket closes
          socket.onclose = () => {
            clearInterval(pingInterval);
            setStatus('disconnected');
            socketRef.current = null;
          };
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setStatus('error');
          toast({
            title: "Connection Error",
            description: "Failed to connect to chat service. Please try again later.",
            variant: "destructive",
          });
        };
        
        socket.onmessage = (event) => {
          try {
            // Handle binary data (audio chunks)
            if (event.data instanceof Blob) {
              handleAudioChunk(event.data);
              return;
            }
            
            // Handle JSON data
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            
            switch (data.type) {
              case 'text':
                setMessages(prev => {
                  // Find the last assistant message or create a new one
                  const lastAssistantIndex = [...prev].reverse().findIndex(m => m.role === 'assistant');
                  
                  if (lastAssistantIndex >= 0) {
                    const newMessages = [...prev];
                    const actualIndex = prev.length - 1 - lastAssistantIndex;
                    newMessages[actualIndex] = {
                      ...newMessages[actualIndex],
                      content: data.content,
                    };
                    return newMessages;
                  } else {
                    // If no existing assistant message, create a new one
                    return [...prev, {
                      role: 'assistant',
                      content: data.content,
                      timestamp: Date.now(),
                      id: `ai-${Date.now()}`,
                    }];
                  }
                });
                break;
                
              case 'complete':
                setIsProcessing(false);
                break;
                
              case 'error':
                console.error('Server error:', data.error);
                toast({
                  title: "Error",
                  description: data.error || "An error occurred while processing your request.",
                  variant: "destructive",
                });
                setIsProcessing(false);
                break;
                
              case 'pong':
                // Ping response received, connection is alive
                console.log('Ping acknowledged');
                break;
                
              case 'server_ping':
                // Server is checking if we're still connected, respond with any message
                socket.send(JSON.stringify({ type: 'client_pong' }));
                break;
                
              default:
                console.log('Unhandled message type:', data.type);
            }
          } catch (err) {
            console.error('Error parsing message:', err, event.data);
          }
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        setStatus('error');
        toast({
          title: "Connection Error",
          description: "Failed to initialize chat connection.",
          variant: "destructive",
        });
      }
    };
    
    if (!socketRef.current) {
      connectWebSocket();
    }
    
    // Clean up WebSocket on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [toast]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if ((!input.trim() && files.length === 0) || isProcessing || status !== 'connected') {
      return;
    }
    
    try {
      // Add user message to the UI
      const userMessage = {
        role: 'user' as const,
        content: input,
        timestamp: Date.now(),
        id: `user-${Date.now()}`,
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsProcessing(true);
      
      // Prepare message for WebSocket
      if (files.length > 0) {
        // Send as multimodal message
        const fileData = files.map(file => ({
          mime_type: file.mimeType,
          data: file.data,
          filename: file.name
        }));
        
        const message = {
          type: 'multimodal_message',
          text: input,
          files: fileData,
          role: 'user',
          enableTTS: true
        };
        
        socketRef.current?.send(JSON.stringify(message));
      } else {
        // Send as text-only message
        const message = {
          type: 'text_message',
          text: input,
          role: 'user',
          enableTTS: true
        };
        
        socketRef.current?.send(JSON.stringify(message));
      }
      
      // Clear input and files after sending
      setInput('');
      clearFiles();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Handle audio data from the server
  const handleAudioChunk = (audioBlob: Blob) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      
      // Clean up the audio URL when done
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  // Handle file upload button click
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    // Reset the input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="p-3 border-b flex items-center justify-between bg-card">
        <div>
          <h3 className="font-semibold">Gemini Chat</h3>
          <div className="text-xs flex items-center gap-1.5">
            <div 
              className={`w-2 h-2 rounded-full ${
                status === 'connected' ? 'bg-green-500' : 
                status === 'connecting' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
            />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setMessages([])}
          disabled={messages.length === 0 || isProcessing}
        >
          Clear Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Send a message to start chatting with Gemini AI
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))
        )}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-2 rounded-lg bg-muted">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>
      
      {/* File preview area */}
      {files.length > 0 && (
        <MediaPreview 
          mediaItems={files.map(file => ({
            type: file.type,
            data: file.preview || file.data,
            name: file.name,
            mimeType: file.mimeType
          }))} 
          onRemove={removeFile}
        />
      )}
      
      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={status !== 'connected' || isProcessing}
            className="flex-1"
          />
          
          <Button
            size="icon"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={status !== 'connected' || isProcessing}
            title="Upload image"
          >
            <ImageIcon className="h-4 w-4" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileUpload}
            />
          </Button>
          
          <Button
            size="icon"
            variant="default"
            onClick={handleSendMessage}
            disabled={(!input.trim() && files.length === 0) || status !== 'connected' || isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 text-center">
          {status === 'connected'
            ? 'Connected to Gemini AI'
            : status === 'connecting'
            ? 'Connecting to Gemini AI...'
            : 'Not connected. Please reload the page to try again.'}
        </div>
      </div>
    </div>
  );
}
