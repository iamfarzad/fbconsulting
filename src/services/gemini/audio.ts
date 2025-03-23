
import { initializeGemini } from './initialize';
import { GeminiConfig, DEFAULT_SPEECH_CONFIG } from './types';
import { Content } from 'google-generativeai';

/**
 * Transcribes audio using Gemini's audio processing capabilities
 */
export async function transcribeAudio(
  audioData: string,
  mimeType: string,
  config: GeminiConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('Gemini API key is not available');
  }

  try {
    // Initialize the Gemini vision model (which handles multimodal inputs)
    const model = initializeGemini({
      ...config,
      model: "gemini-2.0-flash" // Use vision model for multimodal inputs
    });
    
    // Create prompt for audio transcription
    const prompt = "Please transcribe this audio and respond with only the transcription text.";
    
    // Use generateContent with proper Part format for audio
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: audioData
              }
            }
          ]
        }
      ]
    });
    
    return result.response.text();
  } catch (error) {
    console.error('Error transcribing audio with Gemini:', error);
    throw error;
  }
}

/**
 * Process audio for speech-to-text using Gemini
 */
export async function processAudioInput(
  audioBlob: Blob,
  config: GeminiConfig
): Promise<string> {
  try {
    // Convert Blob to base64
    const base64 = await blobToBase64(audioBlob);
    const base64Data = base64.split(',')[1]; // Remove data URL prefix
    
    // Transcribe using Gemini
    return await transcribeAudio(
      base64Data,
      audioBlob.type,
      config
    );
  } catch (error) {
    console.error('Error processing audio input:', error);
    throw error;
  }
}

/**
 * Convert a Blob to base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert base64 string to Blob
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Record audio from the user's microphone
 */
export async function recordAudio(timeLimit = 15000): Promise<Blob | null> {
  // Check if MediaRecorder is supported
  if (!window.MediaRecorder) {
    console.error('MediaRecorder is not supported in this browser');
    return null;
  }

  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: BlobPart[] = [];
    
    // Set up event handlers
    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    });
    
    // Start recording
    mediaRecorder.start();
    console.log('Recording started...');
    
    // Return promise that resolves when recording is stopped
    return new Promise((resolve) => {
      // Set timeout to automatically stop recording
      const timeoutId = setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, timeLimit);
      
      // Handle recording stop
      mediaRecorder.addEventListener('stop', () => {
        clearTimeout(timeoutId);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Create audio blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      });
    });
  } catch (error) {
    console.error('Error recording audio:', error);
    return null;
  }
}
