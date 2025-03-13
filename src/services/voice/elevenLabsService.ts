
/**
 * ElevenLabs Voice Service
 * Handles text-to-speech functionality using ElevenLabs API
 */

// Types for ElevenLabs configuration
export interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  model?: string;
}

// Default configuration
const defaultConfig: Partial<ElevenLabsConfig> = {
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah voice
  model: 'eleven_turbo_v2'
};

/**
 * Initialize ElevenLabs configuration
 */
export const initializeElevenLabs = (config: Partial<ElevenLabsConfig>): ElevenLabsConfig => {
  // Merge with defaults
  const fullConfig = {
    ...defaultConfig,
    ...config
  } as ElevenLabsConfig;
  
  // Validate required fields
  if (!fullConfig.apiKey) {
    console.error('ElevenLabs API Key is required');
    throw new Error('ElevenLabs API Key is required');
  }
  
  return fullConfig as ElevenLabsConfig;
};

/**
 * Test connection to ElevenLabs API
 */
export const testElevenLabsConnection = async (config: ElevenLabsConfig): Promise<boolean> => {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': config.apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('ElevenLabs connection test successful');
      return true;
    } else {
      console.error('ElevenLabs connection test failed:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error testing ElevenLabs connection:', error);
    return false;
  }
};

/**
 * Convert text to speech using ElevenLabs API
 */
export const textToSpeech = async (
  text: string, 
  config: ElevenLabsConfig
): Promise<ArrayBuffer | null> => {
  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': config.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: config.model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });
    
    if (response.ok) {
      return await response.arrayBuffer();
    } else {
      console.error('ElevenLabs text-to-speech failed:', await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error converting text to speech:', error);
    return null;
  }
};

/**
 * Play audio from ArrayBuffer
 */
export const playAudio = (audioBuffer: ArrayBuffer): HTMLAudioElement => {
  const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  
  audio.onended = () => {
    URL.revokeObjectURL(url);
  };
  
  audio.play();
  return audio;
};
