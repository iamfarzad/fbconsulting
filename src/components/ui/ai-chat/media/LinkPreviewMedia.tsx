
import React from 'react';
import { cn } from '@/lib/utils';

interface LinkPreviewMediaProps {
  title?: string;
  description?: string;
  thumbnail?: string;
  className?: string;
}

export const LinkPreviewMedia = ({ title, description, thumbnail, className }: LinkPreviewMediaProps) => {
  return (
    <div className={cn("border rounded-lg p-4 my-2", className)}>
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title || 'Link preview'}
          className="w-[200px] h-[100px] object-cover rounded-lg mb-2"
        />
      )}
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
