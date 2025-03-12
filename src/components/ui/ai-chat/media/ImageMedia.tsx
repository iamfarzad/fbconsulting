
import React from 'react';
import { cn } from '@/lib/utils';

interface ImageMediaProps {
  src: string;
  alt: string;
  description?: string;
  className?: string;
}

export const ImageMedia = ({ src, alt, description, className }: ImageMediaProps) => {
  return (
    <div className={cn("relative rounded-lg overflow-hidden my-2", className)}>
      <img
        src={src}
        alt={alt}
        className="w-[400px] h-[300px] object-cover"
      />
      {description && (
        <p className="text-sm text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </div>
  );
};
