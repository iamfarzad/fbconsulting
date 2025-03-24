import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { message, apiKey } = await request.json();
    
    // First try to use the API key from the request
    // Then fall back to environment variables
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!key) {
      throw new Error('API key is required');
    }
    
    // Initialize the API with the key
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    // Return real response, not a mock
    return Response.json({ text });
    
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
