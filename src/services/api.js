// Access environment variables with correct Vite syntax
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Make sure we're not using any fallback demo response
export const fetchGeminiResponse = async (message, retryCount = 0) => {
  try {
    console.log('Fetching from API:', `${apiBaseUrl}/api/gemini/main`);
    console.log('With message:', message);
    console.log('Using API key:', apiKey ? 'API key exists' : 'No API key');
    
    const response = await fetch(`${apiBaseUrl}/api/gemini/main`, {
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
      const errorText = await response.text();
      console.error('API error response:', errorText);
      
      // Retry on 5xx errors or network failures
      if (retryCount < MAX_RETRIES && (response.status >= 500 || !response.ok)) {
        console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})...`);
        await wait(RETRY_DELAY * (2 ** retryCount)); // Using ** operator for exponentiation
        return fetchGeminiResponse(message, retryCount + 1);
      }
      
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
    
    // Retry on network errors
    if (retryCount < MAX_RETRIES && error.name === 'TypeError') {
      console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})...`);
      await wait(RETRY_DELAY * (2 ** retryCount)); // Using ** operator for exponentiation
      return fetchGeminiResponse(message, retryCount + 1);
    }
    
    // Return a properly structured error response
    return { 
      text: error.message,
      error: error.message, 
      status: 'error',
      data: [] // Always return an array
    };
  }
};
