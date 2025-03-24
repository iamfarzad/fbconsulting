// If you're using Create React App

// Access environment variables with correct Vite syntax
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

// Make sure we're not using any fallback demo response
export const fetchGeminiResponse = async (message) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/gemini/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        apiKey // Pass the API key explicitly
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error; // Don't return a mock response here
  }
};

// ...existing code...
