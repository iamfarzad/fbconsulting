
import React from 'react';
import { formatDate } from '@/lib/utils';

interface PostHeaderProps {
  title: string;
  date?: string | Date;
  author?: string;
  category?: string;
  readTime?: string;
  imageSrc?: string;
}

const PostHeader = ({ 
  title, 
  date, 
  author = "Author", 
  category = "Uncategorized", 
  readTime = "5 min read",
  imageSrc 
}: PostHeaderProps) => {
  return (
    <header className="mb-8">
      {imageSrc && (
        <div className="w-full h-64 md:h-96 mb-6 overflow-hidden rounded-lg">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        {category && <span>{category}</span>}
        {date && (
          <>
            <span>•</span>
            <time dateTime={typeof date === 'string' ? date : date.toISOString()}>
              {formatDate(date)}
            </time>
          </>
        )}
        {readTime && (
          <>
            <span>•</span>
            <span>{readTime}</span>
          </>
        )}
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h1>
      
      {author && (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <span className="font-medium">{author}</span>
        </div>
      )}
    </header>
  );
};

export default PostHeader;
