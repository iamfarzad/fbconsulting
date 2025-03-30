export interface VoiceUIProps {
  onCommand?: (command: string) => void;
  noFloatingButton?: boolean;
}

export interface VoiceControlsProps {
  isListening: boolean;
  toggleListening: () => void;
  disabled?: boolean;
  aiProcessing?: boolean;
}

export interface VoicePanelProps {
  isListening: boolean;
  transcript: string;
  onClose: () => void;
  onToggleListening: () => void;
  aiResponse: string;
}
