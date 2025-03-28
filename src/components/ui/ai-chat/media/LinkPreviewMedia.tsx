
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkPreviewMediaProps {
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  className?: string;
}

export const LinkPreviewMedia: React.FC<LinkPreviewMediaProps> = ({
  url,
  title,
  description,
  thumbnail,
  className
}) => {
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "block border rounded-md overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-800",
        className
      )}
    >
      <div className="flex">
        {thumbnail && (
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={thumbnail} 
              alt={title || displayUrl} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-3 flex-1">
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <span className="truncate mr-1">{displayUrl}</span>
            <ExternalLink size={12} />
          </div>
          <h3 className="font-medium line-clamp-2 text-sm">
            {title || url}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};

export default LinkPreviewMedia;
