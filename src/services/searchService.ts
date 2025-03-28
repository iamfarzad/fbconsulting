import { SearchResultItem } from '@/components/ui/search/SearchResults';

// Mock data for demonstration purposes
const mockSearchData: SearchResultItem[] = [
  {
    id: 'blog-1',
    title: 'The Future of AI Automation',
    description: 'Exploring how AI is revolutionizing business automation and what to expect in the coming years.',
    url: '/blog/future-of-ai-automation',
    type: 'blog',
    date: '2023-09-15',
    tags: ['AI', 'Automation', 'Future Tech']
  },
  {
    id: 'service-1',
    title: 'AI Strategy Consulting',
    description: 'Get expert guidance on implementing AI solutions tailored to your business needs.',
    url: '/services#ai-strategy',
    type: 'service',
    image: '/placeholder.svg',
    tags: ['Consulting', 'Strategy', 'AI Implementation']
  },
  {
    id: 'page-1',
    title: 'About Me',
    description: 'Learn about my background, experience, and expertise in AI automation.',
    url: '/about',
    type: 'page'
  },
  {
    id: 'faq-1',
    title: 'Is AI implementation expensive?',
    description: 'AI implementation costs vary based on your specific needs. We offer flexible pricing plans suitable for businesses of all sizes.',
    url: '/#faq',
    type: 'faq'
  },
  {
    id: 'blog-2',
    title: 'How AI Can Reduce Business Costs',
    description: 'Discover practical ways AI implementation can help your business cut operational costs.',
    url: '/blog/ai-cost-reduction',
    type: 'blog',
    date: '2023-10-22',
    tags: ['Cost Reduction', 'Business', 'ROI']
  },
  {
    id: 'service-2',
    title: 'Workflow Automation',
    description: 'Streamline your business processes with intelligent workflow automation solutions.',
    url: '/services#workflow-automation',
    type: 'service',
    image: '/placeholder.svg',
    tags: ['Workflow', 'Automation', 'Efficiency']
  }
];

export const searchContent = async (query: string): Promise<SearchResultItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
  
  return mockSearchData.filter(item => {
    const titleMatch = searchTerms.some(term => 
      item.title.toLowerCase().includes(term)
    );
    
    const descriptionMatch = searchTerms.some(term => 
      item.description.toLowerCase().includes(term)
    );
    
    const tagMatch = item.tags?.some(tag => 
      searchTerms.some(term => tag.toLowerCase().includes(term))
    );
    
    return titleMatch || descriptionMatch || tagMatch;
  });
};

// Function to track search events
export const trackSearch = (query: string, resultsCount: number) => {
  // This would integrate with your analytics service
  console.log('Search tracked:', { query, resultsCount });
};

// Note: Use environment variables for sensitive information
