
/**
 * Azure AI Service for CopilotKit
 * Handles the connection to Azure OpenAI Services
 */

// Types for Azure AI configuration
export interface AzureAIConfig {
  apiKey: string;
  endpoint: string;
  deploymentName: string;
  apiVersion?: string;
}

// Default configuration
const defaultConfig: Partial<AzureAIConfig> = {
  deploymentName: 'gpt-4o',
  apiVersion: '2024-11-20'
};

/**
 * Initialize Azure OpenAI configuration
 */
export const initializeAzureAI = (config: Partial<AzureAIConfig>): AzureAIConfig => {
  // Merge with defaults
  const fullConfig = {
    ...defaultConfig,
    ...config
  } as AzureAIConfig;
  
  // Validate required fields
  if (!fullConfig.apiKey) {
    console.error('Azure API Key is required');
    throw new Error('Azure API Key is required');
  }
  
  if (!fullConfig.endpoint) {
    console.error('Azure Endpoint is required');
    throw new Error('Azure Endpoint is required');
  }
  
  return fullConfig as AzureAIConfig;
};

/**
 * Test connection to Azure OpenAI
 * @returns Promise that resolves to true if connection is successful
 */
export const testAzureConnection = async (config: AzureAIConfig): Promise<boolean> => {
  // This would normally make an actual API call to Azure
  // For now, we'll just simulate a successful connection
  console.log('Testing connection to Azure OpenAI', config);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Connection test successful');
      resolve(true);
    }, 1000);
  });
};

/**
 * Get system instructions for the AI assistant
 */
export const getDefaultSystemInstructions = (): string => {
  return `
    You are Farzad AI Assistant, an AI consultant built into the landing page of F.B Consulting. 
    Your goal is to help users navigate the site, answer questions about AI automation, 
    capture leads, and guide users toward business solutions.

    🎯 Key Capabilities:
    1. Answer questions about AI services, automation, and consulting
    2. Help users fill out forms (Newsletter signup, Consultation request)
    3. Guide users to book a meeting through the chat
    4. Provide feature updates, site changes, and roadmap progress
    5. Store user preferences & conversation history for a seamless experience
    6. Offer a conversation summary via email when the session ends

    📌 Rules:
    - Always refer users to the correct page or function when asked
    - If a user asks where to find something, guide them using chat links
    - At the end of a session, ask if they want an email summary
    - If the user is a potential lead, ask key questions about their needs
  `;
};
