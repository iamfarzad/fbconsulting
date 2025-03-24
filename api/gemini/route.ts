import { NextRequest } from "next/server";
import { GeminiRequest, GeminiConfig } from "../../src/services/gemini/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Utility functions
function formatGeminiResponse(text: string): string {
  return text
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/```/g, '')
    .replace(/\*\*/g, '');
}

function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .replace(/[^\w\s.,?!-]/g, '')
    .substring(0, 1000);
}

function initializeGemini(options: { model?: string; temperature?: number } = {}) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  return genAI.getGenerativeModel({
    model: options.model || "gemini-pro",
    generationConfig: {
      temperature: options.temperature
    }
  });
}

const defaultModel = initializeGemini();

export async function POST(req: NextRequest) {
  try {
    const { prompt: rawPrompt, model = "gemini-pro", temperature = 0.9 } = (await req.json()) as GeminiRequest;
    
    // Sanitize prompt
    const prompt = sanitizePrompt(rawPrompt);
    
    const geminiModel = initializeGemini({ model, temperature });
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = formatGeminiResponse(response.text());
    
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Gemini API Error]:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  try {
    const result = await defaultModel.generateContent("Test connection to Gemini API");
    const response = await result.response;
    const text = formatGeminiResponse(response.text());
    
    return new Response(JSON.stringify({ 
      status: "ok",
      message: "Gemini API connection successful",
      test_response: text
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Gemini API Test Error]:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to connect to Gemini API";
    return new Response(
      JSON.stringify({ 
        status: "error",
        error: errorMessage
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
