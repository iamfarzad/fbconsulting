import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define response type
interface TranscribeResponse {
  text: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TranscribeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: '', error: 'Method not allowed' });
  }

  try {
    const { text, apiKey } = req.body;

    if (!text || !apiKey) {
      return res.status(400).json({ text: '', error: 'Missing required parameters' });
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Send the request to Gemini
    const result = await model.generateContent(text);
    const response = await result.response;
    const generatedText = response.text();

    res.status(200).json({ text: generatedText });
  } catch (error) {
    console.error('Error in transcribe endpoint:', error);
    res.status(500).json({ 
      text: '',
      error: error instanceof Error ? error.message : 'Unknown error during transcription' 
    });
  }
}
