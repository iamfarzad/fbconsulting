import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

export async function POST(request) {
  try {
    const { message, images, persona, apiKey } = await request.json();
    
    // First try to use the API key from the request
    // Then fall back to environment variables
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!key) {
      throw new Error('API key is required');
    }
    
    // Initialize the API with the key
    const genAI = new GoogleGenerativeAI(key);
    
    // Choose model based on whether we have images
    const modelName = images && images.length > 0 ? 'gemini-pro-vision' : 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });
    
    // Prepare content parts
    const parts = [];
    
    // Add persona context if provided
    if (persona) {
      parts.push(`You are acting as: ${persona}\n\n`);
    }
    
    // Add the main message
    parts.push(message);
    
    // Add images if provided
    if (images && images.length > 0) {
      for (const image of images) {
        parts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data
          }
        });
      }
    }
    
    const result = await model.generateContent(parts);
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
