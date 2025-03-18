
import { useState } from 'react';
import { toast } from 'sonner';

interface UseImageUploadReturn {
  images: { mimeType: string; data: string; preview: string }[];
  uploadImage: (file: File) => Promise<void>;
  removeImage: (index: number) => void;
  clearImages: () => void;
  isUploading: boolean;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [images, setImages] = useState<{ mimeType: string; data: string; preview: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Extract just the base64 data without the prefix
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const uploadImage = async (file: File): Promise<void> => {
    try {
      setIsUploading(true);
      
      // Validate image type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: 'Please upload an image file (jpg, png, etc.)'
        });
        return;
      }
      
      // Validate file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Image must be less than 4MB'
        });
        return;
      }
      
      // Convert to base64
      const base64Data = await fileToBase64(file);
      
      // Create a preview URL for UI display
      const previewUrl = URL.createObjectURL(file);
      
      // Add the image to state
      setImages(prev => [...prev, {
        mimeType: file.type,
        data: base64Data,
        preview: previewUrl
      }]);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image', {
        description: 'Please try again with another image'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number): void => {
    setImages(prev => {
      const newImages = [...prev];
      
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      
      // Remove the image from the array
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const clearImages = (): void => {
    // Revoke all object URLs
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  return {
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  };
};
