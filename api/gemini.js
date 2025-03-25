// Adjust the import paths to match your project structure
import { getGeminiApiKey } from '../src/utils/apiHelpers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const { messages } = req.body;
    
    // Validate messages
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format. Expected array.' });
    }

    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'Error from Gemini API' 
      });
    }

    // Handle and extract the response text safely
    let responseText = '';
    try {
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (err) {
      console.error('Error extracting response text:', err);
      return res.status(500).json({ error: 'Failed to parse API response' });
    }

    return res.status(200).json({ response: responseText });
  } catch (error) {
    console.error('Gemini handler error:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
