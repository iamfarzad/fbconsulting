
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LeadInfo, 
  AIMessage, 
  extractLeadInfo, 
  generateSuggestedResponse, 
  determinePersona,
  saveConversationHistory,
  loadConversationHistory,
  saveLeadInfo,
  loadLeadInfo
} from '@/services/copilotService';
import { trackEvent } from '@/services/analyticsService';
import { useToast } from './use-toast';

interface UseCopilotOptions {
  copilotApiKey?: string;
  initialMessages?: AIMessage[];
  initialLeadInfo?: LeadInfo;
}

interface UseCopilotReturn {
  messages: AIMessage[];
  leadInfo: LeadInfo;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
  suggestedResponse: string | null;
  currentPersona: 'strategist' | 'technical' | 'consultant' | 'general';
}

export const useCopilot = (options: UseCopilotOptions = {}): UseCopilotReturn => {
  const { toast } = useToast();
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1] || 'home';
  
  // Get API key from options or default to environment variable
  const apiKey = options.copilotApiKey || 'dummy-key';
  
  // State for messages, lead info, loading state, etc.
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    return options.initialMessages || loadConversationHistory();
  });
  
  const [leadInfo, setLeadInfo] = useState<LeadInfo>(() => {
    return options.initialLeadInfo || loadLeadInfo();
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  const [currentPersona, setCurrentPersona] = useState<'strategist' | 'technical' | 'consultant' | 'general'>(
    determinePersona(leadInfo, currentPage)
  );
  
  // When the location changes, update the current persona
  useEffect(() => {
    setCurrentPersona(determinePersona(leadInfo, currentPage));
  }, [currentPage, leadInfo]);
  
  // When lead info changes, update suggested responses
  useEffect(() => {
    const suggestion = generateSuggestedResponse(leadInfo);
    setSuggestedResponse(suggestion);
  }, [leadInfo]);
  
  // Save messages and lead info when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory(messages);
    }
    
    if (Object.keys(leadInfo).length > 0) {
      saveLeadInfo(leadInfo);
    }
  }, [messages, leadInfo]);
  
  // Process message logic - this is where we'd connect to CopilotKit
  const processMessage = useCallback(async (content: string): Promise<string> => {
    // This is where we would normally call CopilotKit API
    // For now, we're using a simple mock response to demonstrate the flow
    
    // Extract lead info first to determine persona and context
    const updatedLeadInfo = extractLeadInfo(content, leadInfo);
    const persona = determinePersona(updatedLeadInfo, currentPage);
    
    // Track this interaction
    trackEvent({
      action: 'chat_message_sent',
      category: 'chatbot',
      label: 'user_message',
      page: currentPage,
      persona: persona,
      lead_stage: updatedLeadInfo.stage
    });
    
    // For demo purposes, generate a simple response based on the detected interests
    let response = '';
    
    if (updatedLeadInfo.name && !leadInfo.name) {
      // We just learned their name
      response = `Nice to meet you, ${updatedLeadInfo.name}! `;
    }
    
    if (updatedLeadInfo.interests?.length && (!leadInfo.interests || updatedLeadInfo.interests.length > leadInfo.interests.length)) {
      // We just learned about a new interest
      const newInterests = updatedLeadInfo.interests.filter(i => !leadInfo.interests?.includes(i));
      if (newInterests.length > 0) {
        response += `I see you're interested in ${newInterests.join(', ')}. That's one of our specialties! `;
      }
    }
    
    if (updatedLeadInfo.challenges?.length && (!leadInfo.challenges || updatedLeadInfo.challenges.length > leadInfo.challenges.length)) {
      // We just learned about a new challenge
      const newChallenges = updatedLeadInfo.challenges.filter(c => !leadInfo.challenges?.includes(c));
      if (newChallenges.length > 0) {
        response += `Many businesses struggle with ${newChallenges.join(', ')}. AI automation can help address these challenges. `;
      }
    }
    
    // Add more dynamic content based on the page they're on
    if (currentPage === 'services') {
      response += "Our services are designed to transform your business operations through AI. ";
    } else if (currentPage === 'about') {
      response += "I specialize in bringing AI automation to businesses of all sizes. ";
    } else if (currentPage === 'blog') {
      response += "Our case studies show how AI has transformed businesses just like yours. ";
    }
    
    // Add a suggestion based on their lead stage if we don't have a response yet
    if (!response) {
      const suggestion = generateSuggestedResponse(updatedLeadInfo);
      if (suggestion) {
        response = suggestion;
      } else {
        // Fallback generic response
        response = "Thanks for your message. How can I help you automate your business processes with AI today?";
      }
    }
    
    // Simulate a delay for a more natural conversation flow
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return response;
  }, [currentPage, leadInfo]);
  
  // Function to send a message
  const sendMessage = useCallback(async (content: string) => {
    // Skip empty messages
    if (!content.trim()) return;
    
    // Add user message to the conversation
    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Extract lead info from the message
      const updatedLeadInfo = extractLeadInfo(content, leadInfo);
      setLeadInfo(updatedLeadInfo);
      
      // Get AI response
      const responseContent = await processMessage(content);
      
      // Add AI response to the conversation
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Track response received
      trackEvent({
        action: 'chat_response_received',
        category: 'chatbot',
        label: 'ai_response',
        page: currentPage,
        response_length: responseContent.length
      });
      
      // If the user is at the ready-to-book stage, suggest they visit the contact page
      if (updatedLeadInfo.stage === 'ready-to-book') {
        toast({
          title: "Ready to schedule a consultation?",
          description: "Visit our contact page to book a time that works for you.",
          action: <a href="/contact" className="text-teal underline">Book Now</a>
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request. Please try again in a moment.",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Track error
      trackEvent({
        action: 'chat_error',
        category: 'error',
        label: 'message_processing',
        error: String(error)
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, leadInfo, processMessage, toast]);
  
  // Function to clear the conversation
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLeadInfo({});
    setSuggestedResponse(null);
    saveConversationHistory([]);
    saveLeadInfo({});
    
    // Track clear action
    trackEvent({
      action: 'chat_cleared',
      category: 'chatbot',
      label: 'conversation_reset'
    });
    
    toast({
      title: "Conversation cleared",
      description: "Starting a new conversation."
    });
  }, [toast]);
  
  return {
    messages,
    leadInfo,
    sendMessage,
    clearMessages,
    isLoading,
    suggestedResponse,
    currentPersona
  };
};
