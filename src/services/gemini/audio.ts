
import API_CONFIG from '@/config/apiConfig';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AudioOptions {
  apiKey: string;
  model?: string;
  speechConfig?: {
    voice_name?: string;
    language_code?: string;
  };
}

/**
 * Records audio for a specified duration or until stopped
 * @param maxDuration Maximum duration in milliseconds
 * @returns Promise resolving to audio blob or null if recording fails
 */
export async function recordAudio(maxDuration: number = 10000): Promise<Blob | null> {
  try {
    console.log('Recording started...');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    return new Promise((resolve, reject) => {
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      });
      
      mediaRecorder.addEventListener('error', (error) => {
        console.error('MediaRecorder error:', error);
        stream.getTracks().forEach(track => track.stop());
        reject(error);
      });
      
      // Start recording
      mediaRecorder.start();
      
      // Set timeout to stop recording after maxDuration
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, maxDuration);
    });
  } catch (error) {
    console.error('Error starting audio recording:', error);
    return null;
  }
}

/**
 * Process audio with Gemini API to get transcription
 * @param audioBlob Audio blob to transcribe
 * @param options Configuration options
 * @returns Promise resolving to transcription text
 */
export async function processAudioInput(
  audioBlob: Blob,
  options: AudioOptions
): Promise<string> {
  try {
    // Convert audio blob to base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(options.apiKey);
    const model = genAI.getGenerativeModel({
      model: options.model || 'gemini-pro'
    });
    
    console.log('Processing audio with Gemini API...');
    
    // Use the correct method for audio transcription
    // Instead of trying to use generateContent directly with audio
    // we'll send a request to our backend API that handles audio transcription
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/gemini/transcribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio: base64Audio,
        apiKey: options.apiKey,
        model: options.model || 'gemini-pro',
        speechConfig: options.speechConfig
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transcription API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error transcribing audio with Gemini:', error);
    throw error;
  }
}

/**
 * Generate audio from text using Gemini TTS
 * @param text Text to convert to speech
 * @param options Configuration options
 * @returns Promise resolving to audio blob
 */
export async function generateSpeechFromText(
  text: string,
  options: AudioOptions
): Promise<Blob> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/gemini/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        apiKey: options.apiKey,
        speechConfig: options.speechConfig
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Speech API error (${response.status}): ${errorText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error generating speech with Gemini:', error);
    throw error;
  }
}
