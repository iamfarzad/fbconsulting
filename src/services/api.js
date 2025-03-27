const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

// Make sure we're not using any fallback demo response
export const fetchGeminiResponse = async (message) => {
  try {
    console.log('Fetching from API:', `${apiBaseUrl}/api/gemini/main`);
    console.log('With message:', message);
    
    const response = await fetch(`${apiBaseUrl}/api/gemini/main`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    // Safely handle the response
    const rawData = await response.json();
    console.log('Raw API response:', rawData);
    
    // Construct a safe response object
    const safeData = {
      text: rawData?.text || '',
      status: rawData?.status || 'success',
      // Ensure data is ALWAYS an array
      data: Array.isArray(rawData?.data) ? rawData.data : 
            rawData?.data ? [rawData.data] : 
            rawData?.text ? [{role: 'assistant', content: rawData.text}] : 
            []
    };
    
    console.log('Processed safe data:', safeData);
    return safeData;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Return a properly structured error response
    return { 
      text: error.message,
      error: error.message, 
      status: 'error',
      data: [] // Always return an array
    };
  }
};

// Note: Use environment variables for sensitive information
