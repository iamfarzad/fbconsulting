import React from 'react';
import { useGeminiConnection } from '@/components/copilot/GeminiCopilotProvider';

const ConnectionStatusIndicator: React.FC = () => {
  const { isListening, voiceError, isPlaying, progress } = useGeminiConnection();

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-white shadow-lg rounded-lg">
      <p>Status: {isListening ? 'Listening' : 'Idle'}</p>
      {voiceError && <p className="text-red-500">Error: {voiceError}</p>}
      {isPlaying && <p>Playing audio... {progress}%</p>}
    </div>
  );
};

export default ConnectionStatusIndicator;
