
import React from 'react';

interface TranscriptDisplayProps {
  isListening: boolean;
  transcript: string | null;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  isListening,
  transcript
}) => {
  if (!isListening || !transcript) return null;
  
  return (
    <div className="mb-2 p-2 bg-primary-foreground rounded text-sm">
      {transcript}
    </div>
  );
};
