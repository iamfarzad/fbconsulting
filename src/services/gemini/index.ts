import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeminiService, GeminiWebSocket, UnifiedChat, Copilot } from '@/services/gemini';

export const useGemini = () => {
  const [state, setState] = useState({
    isConnected: false,
    messages: [],
    error: null,
  });

  const serviceRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleStateChange = (newState) => {
      setState(newState);

      if (newState.error) {
        toast({
          title: "Gemini Error",
          description: newState.error,
          variant: "destructive",
        });
      }
    };

    serviceRef.current = new GeminiService(handleStateChange);

    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect();
      }
    };
  }, [toast]);

  const connect = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.disconnect();
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (serviceRef.current) {
      serviceRef.current.sendMessage(message);
    }
  }, []);

  return {
    state,
    connect,
    disconnect,
    sendMessage,
  };
};

export const useGeminiWebSocket = () => {
  const [state, setState] = useState({
    isConnected: false,
    messages: [],
    error: null,
  });

  const socketRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleStateChange = (newState) => {
      setState(newState);

      if (newState.error) {
        toast({
          title: "WebSocket Error",
          description: newState.error,
          variant: "destructive",
        });
      }
    };

    socketRef.current = new GeminiWebSocket(handleStateChange);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [toast]);

  const connect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (socketRef.current) {
      socketRef.current.sendMessage(message);
    }
  }, []);

  return {
    state,
    connect,
    disconnect,
    sendMessage,
  };
};

export const useUnifiedChat = () => {
  const [state, setState] = useState({
    isConnected: false,
    messages: [],
    error: null,
  });

  const chatRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleStateChange = (newState) => {
      setState(newState);

      if (newState.error) {
        toast({
          title: "Unified Chat Error",
          description: newState.error,
          variant: "destructive",
        });
      }
    };

    chatRef.current = new UnifiedChat(handleStateChange);

    return () => {
      if (chatRef.current) {
        chatRef.current.disconnect();
      }
    };
  }, [toast]);

  const connect = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.disconnect();
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (chatRef.current) {
      chatRef.current.sendMessage(message);
    }
  }, []);

  return {
    state,
    connect,
    disconnect,
    sendMessage,
  };
};

export const useCopilot = () => {
  const [state, setState] = useState({
    isConnected: false,
    messages: [],
    error: null,
  });

  const copilotRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleStateChange = (newState) => {
      setState(newState);

      if (newState.error) {
        toast({
          title: "Copilot Error",
          description: newState.error,
          variant: "destructive",
        });
      }
    };

    copilotRef.current = new Copilot(handleStateChange);

    return () => {
      if (copilotRef.current) {
        copilotRef.current.disconnect();
      }
    };
  }, [toast]);

  const connect = useCallback(() => {
    if (copilotRef.current) {
      copilotRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (copilotRef.current) {
      copilotRef.current.disconnect();
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (copilotRef.current) {
      copilotRef.current.sendMessage(message);
    }
  }, []);

  return {
    state,
    connect,
    disconnect,
    sendMessage,
  };
};
