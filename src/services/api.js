// If you're using Create React App

// Access environment variables with correct Vite syntax
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

// Make sure we're not using any fallback demo response
export const fetchGeminiResponse = async (message) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/gemini/main`, { // Updated path
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
    
    // Safely handle the response
    const data = await response.json();
    
    // Ensure data.data is always an array to prevent t.map is not a function errors
    if (data && !Array.isArray(data.data)) {
      data.data = data.data ? [data.data] : [];
    }
    
    return data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Return a properly structured error response
    return { 
      error: error.message, 
      status: 'error',
      data: [] // Always return an array
    };
  }
};

// ...existing code...
