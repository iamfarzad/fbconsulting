import React from 'react';
import { Send, Mic, Image, Paperclip, Trash2, Loader2 } from 'lucide-react';

interface ChatInputActionsProps {
  suggestedResponse: string | null;
  onSuggestionClick: (suggestion: string) => void;
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  isVoiceSupported: boolean;
  onClearChat: () => void;
  showMediaUpload: boolean;
  setShowMediaUpload: (show: boolean) => void;
  onImageUpload: (files: File[]) => void;
  onFileUpload: (files: File[]) => void;
  hasMessages: boolean;
  aiProcessing: boolean;
}

export const ChatInputActions: React.FC<ChatInputActionsProps> = ({
  suggestedResponse,
  onSuggestionClick,
  onSend,
  hasContent,
  isLoading,
  isListening,
  toggleListening,
  isVoiceSupported,
  onClearChat,
  showMediaUpload,
  setShowMediaUpload,
  onImageUpload,
  onFileUpload,
  hasMessages,
  aiProcessing
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (type === 'image') {
      onImageUpload(files);
    } else {
      onFileUpload(files);
    }
    event.target.value = '';
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-t">
      {/* Voice input button */}
      {isVoiceSupported && (
        <button
          onClick={toggleListening}
          disabled={isLoading}
          aria-label={isListening ? 'Stop recording' : 'Start recording'}
          className={`p-2 rounded-lg transition-colors ${
            isListening ? 'bg-red-500 text-white' : 'hover:bg-muted'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
      )}

      {/* Media upload buttons */}
      <button
        onClick={() => setShowMediaUpload(!showMediaUpload)}
        disabled={isLoading || isListening}
        aria-label="Add media"
        className="p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <Image className="w-5 h-5" />
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading || isListening}
        aria-label="Add file"
        className="p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <Paperclip className="w-5 h-5" />
      </button>

      {/* Clear chat button */}
      {hasMessages && (
        <button
          onClick={onClearChat}
          disabled={isLoading || isListening}
          aria-label="Clear chat"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      {/* Send button */}
      <button
        onClick={onSend}
        disabled={!hasContent || isLoading || isListening}
        aria-label="Send message"
        className="ml-auto p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isLoading || aiProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>

      {/* Hidden file inputs */}
      <div className="sr-only">
        <label htmlFor="file-upload">Upload files</label>
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          multiple
          onChange={e => handleFileChange(e, 'file')}
          className="hidden"
          aria-label="File upload"
        />
        <label htmlFor="image-upload">Upload images</label>
        <input
          id="image-upload"
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={e => handleFileChange(e, 'image')}
          className="hidden"
          aria-label="Image upload"
        />
      </div>
    </div>
  );
};
