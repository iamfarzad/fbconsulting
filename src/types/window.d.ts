
/**
 * Global window type extensions
 */

interface Window {
  // Google Analytics
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  
  // Speech Recognition APIs
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
