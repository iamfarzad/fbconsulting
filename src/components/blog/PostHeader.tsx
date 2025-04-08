
import { Clock, Calendar, Tag } from 'lucide-react';

interface PostHeaderProps {
  title: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
}

const PostHeader = ({
  title,
  date,
  readTime,
  author,
  category
}: PostHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-6">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{readTime} read</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Tag className="h-4 w-4" />
          <span>{category}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {author.charAt(0)}
        </div>
        <div>
          <div className="font-medium">{author}</div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
