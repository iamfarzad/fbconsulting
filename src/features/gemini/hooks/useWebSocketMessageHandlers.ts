
import { useCallback } from 'react';
import { parseBinaryMessage, parseJsonMessage } from '../utils/webSocketUtils';

interface MessageHandlers {
  onTextMessage?: (text: string) => void;
  onError?: (error: string) => void;
  onAudioChunk?: (chunk: ArrayBuffer) => void;
  onAudioChunkInfo?: (info: { size: number, format: string }) => void;
  onServerPing?: () => void;
  onComplete?: () => void;
  onPong?: () => void;
}

/**
 * Hook for handling WebSocket messages
 */
export function useWebSocketMessageHandlers(handlers: MessageHandlers = {}) {
  /**
   * Process a WebSocket message
   */
  const handleMessage = useCallback(async (
    event: MessageEvent,
    ws: WebSocket | null,
    clearPingTimeout: () => void
  ) => {
    try {
      // Handle binary messages (audio data)
      if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
        if (handlers.onAudioChunk) {
          try {
            const arrayBuffer = await parseBinaryMessage(event.data);
            handlers.onAudioChunk(arrayBuffer);
          } catch (error) {
            console.error('Error processing binary message:', error);
          }
        }
        return;
      }
      
      // Handle JSON messages
      const data = parseJsonMessage(event.data);
      
      // Handle pong message
      if (data.type === 'pong') {
        clearPingTimeout();
        if (handlers.onPong) handlers.onPong();
        return;
      }
      
      // Handle server ping
      if (data.type === 'server_ping') {
        ws?.send(JSON.stringify({ type: 'server_pong' }));
        if (handlers.onServerPing) handlers.onServerPing();
        return;
      }
      
      // Handle audio chunk info
      if (data.type === 'audio_chunk_info') {
        if (handlers.onAudioChunkInfo) {
          handlers.onAudioChunkInfo({
            size: data.size,
            format: data.format
          });
        }
        return;
      }
      
      // Handle complete message
      if (data.type === 'complete') {
        if (handlers.onComplete) handlers.onComplete();
        return;
      }
      
      // Handle errors
      if (data.type === 'error') {
        const errorMessage = data.error || 'Unknown error from server';
        if (handlers.onError) handlers.onError(errorMessage);
        return;
      }
      
      // Handle text messages
      if (data.type === 'text' && data.content && handlers.onTextMessage) {
        handlers.onTextMessage(data.content);
        return;
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `Error processing message: ${err.message}` 
        : 'Error processing message';
      
      if (handlers.onError) handlers.onError(errorMessage);
    }
  }, [handlers]);
  
  return { handleMessage };
}

export default useWebSocketMessageHandlers;
