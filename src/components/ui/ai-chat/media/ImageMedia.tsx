
import React from 'react';
import { cn } from '@/lib/utils';
import { ZoomIn } from 'lucide-react';

interface ImageMediaProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageMedia: React.FC<ImageMediaProps> = ({ src, alt, className }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn("relative group", className)}>
      <img 
        src={src} 
        alt={alt}
        className={cn(
          "rounded-md max-h-[300px] object-contain cursor-pointer border border-gray-200",
          isExpanded && "fixed inset-0 z-50 w-full h-full max-h-none object-contain bg-black/80 p-4"
        )}
        onClick={toggleExpand}
      />
      {!isExpanded && (
        <button 
          className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={toggleExpand}
        >
          <ZoomIn size={16} />
        </button>
      )}
    </div>
  );
};

export default ImageMedia;
