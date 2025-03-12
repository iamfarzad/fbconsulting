
import { BlogPost, RelatedPost } from '@/types/blog';

export interface BlogFilters {
  category?: string;
  searchTerm?: string;
  sortField?: 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface BlogSortOptions {
  field: 'date' | 'popularity';
  order: 'asc' | 'desc';
}
