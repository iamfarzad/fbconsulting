
import React from 'react';

interface PostContentProps {
  content: string;
  featuredImage?: string;
  title: string;
}

const PostContent: React.FC<PostContentProps> = ({ content, featuredImage = "/placeholder.svg", title }) => {
  return (
    <>
      {/* Featured image */}
      <div className="mb-8">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <img 
            src={featuredImage} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Post content */}
      <div 
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
};

export default PostContent;
