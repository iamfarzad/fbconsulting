import React, { useEffect } from 'react';
import { GeminiChat } from './GeminiChat';
import { useGemini } from '../providers/GeminiProvider';
import ConnectionStatusIndicator from '@/components/ui/ConnectionStatusIndicator';
import ErrorBoundaryWrapper from '../../ErrorBoundaryWrapper';

export const CopilotChat: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    error,
    resetError
  } = useGemini();

  useEffect(() => {
    // Reset any errors when component unmounts
    return () => resetError();
  }, [resetError]);

  return (
    <ErrorBoundaryWrapper>
      <div className="fixed bottom-24 right-4 w-96 h-[600px] bg-background rounded-lg shadow-lg border overflow-hidden">
        <ErrorBoundaryWrapper>
          <GeminiChat />
        </ErrorBoundaryWrapper>
        <ConnectionStatusIndicator />
      </div>
    </ErrorBoundaryWrapper>
  );
};
