
export interface BlogPost {
  title: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  authorTitle: string;
  authorAvatar: string;
  content: string;
  featuredImage?: string;
  relatedPosts: RelatedPost[];
}

export interface RelatedPost {
  id: string;
  title: string;
  slug: string;
}
