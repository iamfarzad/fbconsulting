
import React from 'react';
import { cn } from '@/lib/utils';

export interface LinkPreviewMediaProps {
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  linkUrl: string;
  className?: string;
}

export const LinkPreviewMedia: React.FC<LinkPreviewMediaProps> = ({
  title,
  description,
  thumbnailUrl,
  linkUrl,
  className,
}) => {
  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex flex-col sm:flex-row items-start border rounded-md overflow-hidden hover:bg-muted/20 transition-colors", 
        className
      )}
    >
      {thumbnailUrl && (
        <div className="sm:w-1/3 max-w-[200px]">
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="w-full h-auto max-h-[150px] object-cover"
          />
        </div>
      )}
      
      <div className={cn("p-3", thumbnailUrl ? "sm:w-2/3" : "w-full")}>
        <h3 className="font-medium text-sm mb-1 line-clamp-2">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-3">{description}</p>
        )}
        <p className="text-xs text-blue-500 mt-1 truncate">{linkUrl}</p>
      </div>
    </a>
  );
};
