import React from 'react';
import { UnifiedVoiceUI } from '@/components/voice/UnifiedVoiceUI';
import { useGeminiService } from '@/hooks/gemini';

function App() {
  const {
    messages,
    isLoading,
    error,
    isConnected,
    isPlaying,
    progress,
    stopAudio,
    sendMessage,
  } = useGeminiService();

  const [isListening, setIsListening] = React.useState(false);

  const handleVoiceInput = React.useCallback((text: string) => {
    if (text.trim()) {
      sendMessage(text);
    }
  }, [sendMessage]);

  const toggleListening = React.useCallback(() => {
    setIsListening(prev => !prev);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Gemini Chat</h1>
      </header>

      <main>
        <UnifiedVoiceUI 
          isListening={isListening}
          toggleListening={toggleListening}
          isPlaying={isPlaying}
          progress={progress}
          stopAudio={stopAudio}
          onVoiceInput={handleVoiceInput}
          disabled={!isConnected || isLoading}
        />
      </main>
    </div>
  );
}

export default App;
