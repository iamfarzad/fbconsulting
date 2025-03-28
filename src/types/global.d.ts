
interface Window {
  gtag?: (command: string, action: string, params: any) => void;
  analytics?: {
    track: (event: string, properties?: any) => void;
  };
  webkitSpeechRecognition?: typeof SpeechRecognition;
}
