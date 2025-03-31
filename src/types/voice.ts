export interface VoiceUIProps {
  onCommand?: (command: string) => void;
  noFloatingButton?: boolean;
}

export interface VoicePanelProps {
  isListening: boolean;
  transcript: string;
  onClose: () => void;
  onToggleListening: () => void;
  aiResponse: string;
}

export interface AudioOptions {
  voice_name?: string;
  language_code?: string;
  rate?: number;
  pitch?: number;
}
