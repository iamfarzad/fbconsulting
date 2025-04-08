
import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

interface PostHeaderProps {
  title: string;
  date?: string;
  readTime?: string;
  author?: string;
  authorTitle?: string;
  authorAvatar?: string;
  category?: string;
}

export function PostHeader({
  title,
  date,
  readTime,
  author,
  authorTitle,
  authorAvatar,
  category
}: PostHeaderProps) {
  return (
    <header className="mb-8">
      {category && (
        <div className="inline-block bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full mb-4">
          {category}
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
        {title}
      </h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
        {author && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
              {authorAvatar ? (
                <img src={authorAvatar} alt={author} className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-2" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{author}</p>
              {authorTitle && <p className="text-sm">{authorTitle}</p>}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm">
          {date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {date}
            </span>
          )}
          
          {readTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readTime}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default PostHeader;
