import React from 'react';
import { UnifiedVoiceUI } from '@/components/voice/UnifiedVoiceUI';
import { useGeminiCopilot } from './GeminiCopilotProvider';
import { cn } from '@/lib/utils';
import { ProposalPreview } from './ProposalPreview';
import { sendProposal } from '@/services/proposal/sendProposal';
import ChooseAction from '@/components/cta/ChooseAction';

interface GeminiCopilotProps {
  className?: string;
}

export const GeminiCopilot: React.FC<GeminiCopilotProps> = ({ className }) => {
  const {
    isListening,
    toggleListening,
    transcript,
    voiceError,
    messages,
    sendMessage,
    isPlaying,
    progress,
    stopAudio,
    generateAndPlayAudio,
    step,
    setStep,
    userInfo,
    setUserInfo,
    isLoading,
    chatError,
    clearMessages,
    clearStorage,
    proposal
  } = useGeminiCopilot();

  const handleSendProposal = async () => {
    if (!userInfo || !proposal) return;

    const response = await sendProposal({
      messages,
      userInfo,
      step,
      proposal
    });

    if (response.success) {
      alert('Proposal sent successfully!');
      // Option to start over
      if (confirm('Would you like to start a new conversation?')) {
        clearMessages();
        clearStorage();
        setStep('intro');
      }
    } else {
      alert(`Failed to send proposal: ${response.error}`);
    }
  };

  const handleStartOver = () => {
    clearMessages();
    clearStorage();
    setStep('intro');
  };

  return (
    <div className={cn("flex flex-col gap-4 p-4 relative", className)}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Chat Error */}
      {chatError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {chatError}
        </div>
      )}

      {/* Step-based UI */}
      {step === 'intro' && (
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to Farzad-AI</h2>
          <p className="mb-4">Let's get started by getting to know you better.</p>
          <button
            onClick={() => setStep('chooseAction')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            Get Started
          </button>
        </div>
      )}

      {step === 'chooseAction' && <ChooseAction />}

      {step === 'form' && (
        <div className="space-y-4 p-4">
          <h3 className="text-xl font-semibold">Your Information</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded"
              onChange={(e) => setUserInfo({ ...userInfo || { email: '' }, name: e.target.value })}
              value={userInfo?.name || ''}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              onChange={(e) => setUserInfo({ ...userInfo || { name: '' }, email: e.target.value })}
              value={userInfo?.email || ''}
            />
            <button
              onClick={() => {
                if (userInfo?.name && userInfo?.email) {
                  setStep('chat');
                }
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded"
              disabled={!userInfo?.name || !userInfo?.email}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 'chat' && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {Array.isArray(messages) ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg max-w-[80%]",
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                  <p className="font-medium">Error: Invalid chat history format</p>
                </div>
              </div>
            )}
          </div>

          {/* Voice Controls */}
          <div className="flex items-center gap-4">
            {transcript && (
              <div className="flex-1 p-2 bg-muted rounded">
                {transcript}
              </div>
            )}
            <UnifiedVoiceUI
              isListening={isListening}
              toggleListening={toggleListening}
              isPlaying={isPlaying}
              progress={progress}
              stopAudio={stopAudio}
              onVoiceInput={sendMessage}
              onGenerateAudio={async (text) => {
                await generateAndPlayAudio(text);
                // Return a dummy Blob since we handle audio playback internally
                return new Blob([''], { type: 'audio/mpeg' });
              }}
            />
          </div>

          {/* Error Display */}
          {voiceError && (
            <div className="text-sm text-red-500">
              {voiceError}
            </div>
          )}
        </>
      )}

      {step === 'proposal' && proposal && (
        <ProposalPreview
          userInfo={userInfo!}
          messages={messages}
          onSend={handleSendProposal}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
};

export default GeminiCopilot;
