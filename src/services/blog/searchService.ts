
import { BlogPost } from '@/types/blog';
import { blogPosts } from './blogData';
import { BlogSortOptions } from './types';

/**
 * Search blog posts by term
 */
export const searchBlogPosts = (term: string): BlogPost[] => {
  const searchTerm = term.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) || 
    post.excerpt?.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  );
};

/**
 * Sort blog posts by date or popularity
 */
export const sortBlogPosts = (
  posts: BlogPost[], 
  { field, order }: BlogSortOptions
): BlogPost[] => {
  return [...posts].sort((a, b) => {
    let comparison = 0;
    
    if (field === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      comparison = dateA - dateB;
    } else if (field === 'popularity') {
      // Using read time as a proxy for popularity
      const timeA = parseInt(a.readTime.split(' ')[0]);
      const timeB = parseInt(b.readTime.split(' ')[0]);
      comparison = timeA - timeB;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};
