import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

export async function GET(request) {
  return Response.json({ 
    status: 'error',
    error: 'GET method not supported. Please use POST with a message and optional API key.',
    data: []
  }, { status: 405 });
}

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
    
    // Ensure we return a properly formatted response
    return Response.json({ 
      text,
      status: 'success',
      data: [] // Ensure we always return an array for data if needed
    });
    
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return Response.json(
      { 
        error: error.message, 
        status: 'error',
        data: [] // Always return an array for any data property
      },
      { status: 500 }
    );
  }
}

export default limiter(POST);
