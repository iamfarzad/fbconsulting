
import { BlogPost, Category, Tag, BlogSortOptions, BlogFilters } from '@/types/blog';

// Re-export types from the unified types file
export type { BlogPost, Category, Tag, BlogSortOptions, BlogFilters };

// Search result interface
export interface SearchResultItem {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  type: 'blog' | 'service' | 'faq' | 'page';
  category?: string;
  date?: string;
}

// Search response interface
export interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  page: number;
  limit: number;
  query: string;
}
