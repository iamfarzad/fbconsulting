
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  date?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  authorTitle?: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export type BlogSortOptions = 'newest' | 'oldest' | 'popular' | 'alphabetical';

export interface BlogFilters {
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  sortBy?: BlogSortOptions;
  page?: number;
  limit?: number;
}
