import { GoogleGenAI } from "google-generativeai";

// Configuration type
export interface GoogleGenAIConfig {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

// Global instance
let genAI: GoogleGenAI | null = null;

// Initialize the Google GenAI instance
export function initializeGoogleGenAI(config: GoogleGenAIConfig): GoogleGenAIConfig {
  genAI = new GoogleGenAI({
    apiKey: config.apiKey
  });

  // Return the full config
  return {
    apiKey: config.apiKey,
    modelName: config.modelName || 'gemini-2.0-flash-exp',
    temperature: config.temperature || 0.7,
    maxOutputTokens: config.maxOutputTokens || 2048
  };
}

// Test the connection with the provided configuration
export async function testGoogleGenAIConnection(config: GoogleGenAIConfig): Promise<boolean> {
  try {
    // Initialize with the new config
    const ai = new GoogleGenAI({
      apiKey: config.apiKey
    });

    // Try to generate a simple test message
    const result = await ai.models.generateContent({
      model: config.modelName || 'gemini-2.0-flash-exp',
      contents: [{ text: "Hello" }]
    });
    
    if (!result.candidates || result.candidates.length === 0) {
      return false;
    }
    
    const text = result.candidates[0].content.parts[0].text;
    return text.length > 0;
  } catch (error) {
    console.error("Failed to test Google GenAI connection:", error);
    return false;
  }
}

// Troubleshoot issues using the AI
export async function troubleshootIssue(issueDescription: string) {
  try {
    if (!genAI) {
      throw new Error("Google GenAI not initialized");
    }

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{
        text: `
          Please help troubleshoot the following issue:
          ---
          ${issueDescription}
          ---
          Provide a clear and concise solution.
        `
      }]
    });
    
    if (!result.candidates || result.candidates.length === 0) {
      throw new Error("No response generated");
    }
    
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("❌ Troubleshooting failed:", error);
    return "Could not process troubleshooting request.";
  }
}
