import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { VoiceControls } from "./VoiceControls";
import { SendButton } from "./SendButton";
import { SuggestionButton } from "./SuggestionButton";
import { ChatInputActions } from "./ChatInputActions";
import { TranscriptionDisplay } from "./TranscriptionDisplay";
import { ImagePreviewArea } from "./ImagePreviewArea";
import { UploadedFile } from "@/hooks/useFileUpload";
interface ChatInputProps {
  value: string;
  setValue: (value: string) => void;
  onSend: (files?: {
    mimeType: string;
    data: string;
    name: string;
    type: string;
  }[]) => void;
  onClear: () => void;
  isLoading: boolean;
  showMessages: boolean;
  hasMessages: boolean;
  suggestedResponse: string | null;
  placeholder: string;
  files?: UploadedFile[];
  onUploadFile?: (file: File) => Promise<void>;
  onRemoveFile?: (index: number) => void;
  isUploading?: boolean;
}
export function ChatInput({
  value,
  setValue,
  onSend,
  onClear,
  isLoading,
  showMessages,
  hasMessages,
  suggestedResponse,
  placeholder = "Ask me anything about AI automation for your business...",
  files = [],
  onUploadFile,
  onRemoveFile,
  isUploading = false
}: ChatInputProps) {
  const {
    textareaRef,
    adjustHeight
  } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200
  });
  const {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    aiProcessing,
    isTranscribing
  } = useVoiceInput(setValue, () => handleSend());
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || files.length > 0) && !isLoading && !isUploading) {
        handleSend();
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };
  const handleSuggestionClick = () => {
    if (suggestedResponse) {
      setValue(suggestedResponse);
      adjustHeight();
    }
  };
  const handleSend = () => {
    // Don't send if loading or uploading an file
    if (isLoading || isUploading) return;

    // Require either text or at least one file
    if (!value.trim() && files.length === 0) return;

    // If we have files, pass them to onSend
    if (files.length > 0) {
      const fileData = files.map(file => ({
        mimeType: file.mimeType,
        data: file.data,
        name: file.name,
        type: file.type
      }));
      onSend(fileData);
    } else {
      onSend();
    }
  };
  return <div className="flex flex-col w-full">
      {/* Transcription Display */}
      <TranscriptionDisplay isTranscribing={isTranscribing} isListening={isListening} transcript={transcript} />

      {/* Chat Input Box */}
      <div className={cn("relative bg-white/95 backdrop-blur-lg border border-black/20 rounded-2xl transition-all duration-300", showMessages || hasMessages ? "shadow-lg" : "")}>
        <div className="overflow-y-auto">
          <Textarea ref={textareaRef} value={value} onChange={handleChange} onKeyDown={handleKeyDown} placeholder={isListening ? "Listening..." : placeholder} className={cn("w-full px-4 py-3", "resize-none", "bg-transparent", "border-none", "text-black/90 text-sm", "focus:outline-none", "focus-visible:ring-0 focus-visible:ring-offset-0", "placeholder:text-black/50 placeholder:text-sm", "min-h-[60px] rounded-2xl")} style={{
          overflow: "hidden"
        }} disabled={isLoading || isListening} />
        </div>
        
        {/* File Preview Area */}
        {files.length > 0 && onRemoveFile && <ImagePreviewArea images={files.filter(f => f.type === 'image')} onRemoveImage={index => {
        // Find the actual index in the combined files array
        const imageFiles = files.filter(f => f.type === 'image');
        const imageToRemove = imageFiles[index];
        const actualIndex = files.findIndex(f => f === imageToRemove);
        onRemoveFile(actualIndex);
      }} />}

        {/* Input Actions */}
        <div className="flex items-center justify-between p-3 border-t border-black/10 bg-slate-500">
          {/* Left side actions */}
          <ChatInputActions hasMessages={hasMessages} onClear={onClear} files={files} onUploadFile={onUploadFile} onRemoveFile={onRemoveFile} isLoading={isLoading} isListening={isListening} isUploading={isUploading} />
          
          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {suggestedResponse && <SuggestionButton suggestion={suggestedResponse} onClick={handleSuggestionClick} disabled={isLoading || isListening} />}
            
            <VoiceControls isListening={isListening} toggleListening={toggleListening} disabled={isLoading} aiProcessing={aiProcessing} />
            
            <SendButton hasContent={!!value.trim() || files.length > 0} isLoading={isLoading || isUploading} aiProcessing={aiProcessing} disabled={isListening} onClick={handleSend} />
          </div>
        </div>
      </div>
    </div>;
}