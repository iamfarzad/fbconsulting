
import React from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';

interface PostHeaderProps {
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorTitle: string;
  authorAvatar: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  category,
  date,
  readTime,
  author,
  authorTitle,
  authorAvatar,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mr-3">
          {category}
        </span>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4 mr-1" /> 
          <span>{date}</span>
          <span className="mx-2">•</span>
          <ClockIcon className="h-4 w-4 mr-1" /> 
          <span>{readTime}</span>
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        {title}
      </h1>
      
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img 
            src={authorAvatar} 
            alt={author} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-medium">{author}</div>
          <div className="text-sm text-muted-foreground">{authorTitle}</div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
