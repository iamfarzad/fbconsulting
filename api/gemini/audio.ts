import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { SpeechConfig } from './types';

export async function textToSpeech(text: string, config: SpeechConfig) {
  const client = new TextToSpeechClient();
  
  const request = {
    input: { text },
    voice: {
      name: config.voice_name,
      languageCode: 'en-US'
    },
    audioConfig: {
      audioEncoding: config.audio_format || 'MP3',
      speakingRate: config.speaking_rate || 1.0,
      pitch: config.pitch || 0
    }
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    return response.audioContent;
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw error;
  }
}
