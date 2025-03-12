
import { BlogPost } from '@/types/blog';
import { blogPosts } from './blogData';
import { BlogFilters, BlogSortOptions } from './types';

/**
 * Returns all blog posts
 */
export const getAllBlogPosts = (): BlogPost[] => {
  return blogPosts;
};

/**
 * Returns a blog post by slug
 */
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

/**
 * Get related posts for a post
 */
export const getRelatedPosts = (slug: string): BlogPost[] => {
  const post = getBlogPostBySlug(slug);
  if (!post) return [];
  
  const relatedSlugs = post.relatedPosts.map(rp => rp.slug);
  return blogPosts.filter(p => relatedSlugs.includes(p.slug || ''));
};
