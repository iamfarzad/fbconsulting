export interface MediaFile {
  type: 'image' | 'video' | 'audio' | 'document';
  file: File;
  mimeType: string;
  url?: string;
  preview?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size: number;
    name: string;
  };
}

export type MessageMedia = MediaFile[];
