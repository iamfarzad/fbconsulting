
import { BlogPost } from '@/types/blog';
import { BlogFilters } from './types';
import { getBlogPostsByCategory } from './categoriesService';
import { searchBlogPosts, sortBlogPosts } from './searchService';

/**
 * Applies multiple filters to blog posts
 */
export const filterBlogPosts = (posts: BlogPost[], filters: BlogFilters): BlogPost[] => {
  let filteredPosts = [...posts];
  
  // Apply category filter if specified
  if (filters.category && filters.category !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category === filters.category);
  }
  
  // Apply search filter if there's a search term
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(term) || 
      post.excerpt?.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term)
    );
  }
  
  // Apply sorting if specified
  if (filters.sortField) {
    filteredPosts = sortBlogPosts(filteredPosts, {
      field: filters.sortField,
      order: filters.sortOrder || 'desc'
    });
  }
  
  return filteredPosts;
};
