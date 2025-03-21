import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface UploadedImage {
  mimeType: string;
  data: string;
}

export interface UseImageUploadResult {
  images: UploadedImage[];
  uploadImage: (file: File) => Promise<void>;
  removeImage: (index: number) => void;
  clearImages: () => void;
  isUploading: boolean;
}

export function useImageUpload(): UseImageUploadResult {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/gemini_image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      if (!data.success || !data.images || !data.images[0]) {
        throw new Error('Invalid image upload response');
      }

      // Add the new image to the list
      setImages(prev => [...prev, data.images[0]]);

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImages([]);
  };

  return {
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading,
  };
}

export default useImageUpload;
