
import { blogPosts } from './blogData';

/**
 * Returns all available blog categories
 */
export const getBlogCategories = (): string[] => {
  const categories = blogPosts.map(post => post.category);
  return [...new Set(categories)]; // Remove duplicates
};

/**
 * Filters blog posts by category
 */
export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  if (category === 'all') return blogPosts;
  return blogPosts.filter(post => post.category === category);
};
