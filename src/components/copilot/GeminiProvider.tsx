
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePersonaManagement } from '../../mcp/hooks/usePersonaManagement';
import { useGeminiAPI } from '../../App';
import { toast } from 'sonner';
import { 
  GoogleGenerativeAI as GenerativeAI,
  GenerativeModel 
} from '@google/generative-ai';
import { initializeGemini } from '@/services/gemini';

// Interface for Gemini context
interface GeminiContextType {
  isInitialized: boolean;
  isLoading: boolean;
  personaData: any;
  error: string | null;
  model: GenerativeModel | null;
  visionModel: GenerativeModel | null;
}

// Create a context for Gemini-specific functionality
const GeminiContext = createContext<GeminiContextType>({
  isInitialized: false,
  isLoading: true,
  personaData: null,
  error: null,
  model: null,
  visionModel: null
});

// Custom hook to access the Gemini context
export const useGemini = () => useContext(GeminiContext);

interface GeminiProviderProps {
  children: React.ReactNode;
}

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
  const { personaData } = usePersonaManagement();
  const { apiKey: contextApiKey } = useGeminiAPI();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<GenerativeModel | null>(null);
  const [visionModel, setVisionModel] = useState<GenerativeModel | null>(null);
  
  // Default persona configuration
  const defaultPersona = {
    currentPersona: 'default',
    personaDefinitions: {
      default: {
        name: 'Farzad AI Assistant',
        welcomeMessage: 'Hello! I\'m Farzad AI Assistant. How can I help you with AI services and automation today?',
        systemInstructions: `You are Farzad AI Assistant, an AI consultant built into the landing page of F.B Consulting. Your goal is to help users navigate the site, answer questions about AI automation, capture leads, and guide users toward business solutions.

Key Capabilities:
1. Answer questions about AI services, automation, and consulting  
2. Help users fill out forms (Newsletter signup, Consultation request)  
3. Guide users to book a meeting through the chat  
4. Provide feature updates, site changes, and roadmap progress  
5. Store user preferences & conversation history for a seamless experience  
6. Offer a conversation summary via email when the session ends  

Rules:
- Always refer users to the correct page or function when asked  
- If a user asks where to find something, guide them using chat links  
- At the end of a session, ask if they want an email summary  
- If the user is a potential lead, ask key questions about their needs`
      }
    }
  };
  
  useEffect(() => {
    const initializeGeminiModels = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get API key from environment variable or context
        const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
        let activeApiKey = contextApiKey || envApiKey;
        
        // Check localStorage for user-provided key (takes precedence)
        const savedConfig = localStorage.getItem('GEMINI_CONFIG');
        let modelName = "gemini-2.0-flash"; // Default model
        
        if (savedConfig) {
          try {
            const config = JSON.parse(savedConfig);
            if (config.apiKey) {
              activeApiKey = config.apiKey;
            }
            if (config.modelName) {
              modelName = config.modelName;
            }
          } catch (error) {
            console.error('Error parsing saved configuration:', error);
          }
        }
        
        if (!activeApiKey) {
          setError('No Gemini API key found');
          console.warn("No Gemini API key found in environment, localStorage, or context");
          setIsLoading(false);
          return;
        }
        
        // Initialize the Gemini API with the SDK
        const genAI = new GenerativeAI(activeApiKey);
        
        // Initialize text model
        const geminiModel = genAI.getGenerativeModel({ model: modelName });
        setModel(geminiModel);
        
        // Initialize vision model
        const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-vision" });
        setVisionModel(visionModel);
        
        // Test API key with a simple generation
        try {
          const result = await geminiModel.generateContent("Hello, this is a test message.");
          const response = result.response.text();
          
          if (response) {
            console.log(`✅ Gemini initialized successfully with model: ${modelName}`);
            console.log(`✅ Vision model initialized: gemini-2.0-vision`);
            
            if (personaData) {
              console.log("Using persona data:", personaData.currentPersona);
            } else {
              console.log("Using default persona");
            }
            
            setIsInitialized(true);
            toast.success('AI Assistant Ready', {
              description: `Gemini ${modelName} has been successfully initialized.`
            });
          } else {
            throw new Error("Empty response from Gemini API test");
          }
        } catch (error) {
          console.error("API test failed:", error);
          throw error;
        }
      } catch (error) {
        console.error("Error initializing Gemini:", error);
        setError(error instanceof Error ? error.message : 'Unknown error initializing Gemini');
        toast.error('AI Assistant Error', {
          description: 'Failed to initialize Gemini AI. Please check your API key.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeGeminiModels();
  }, [contextApiKey, personaData]);
  
  return (
    <GeminiContext.Provider value={{ 
      isInitialized, 
      isLoading,
      error,
      personaData: personaData || defaultPersona,
      model,
      visionModel
    }}>
      {children}
    </GeminiContext.Provider>
  );
};
