import { NextRequest } from "next/server";
import { GeminiRequest } from "../../src/services/gemini/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "gemini-pro", temperature = 0.9 } = (await req.json()) as GeminiRequest;
    
    const geminiModel = genAI.getGenerativeModel({ model });
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Test connection to Gemini API");
    const response = await result.response;
    
    return new Response(JSON.stringify({ 
      status: "ok",
      message: "Gemini API connection successful",
      test_response: response.text()
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
