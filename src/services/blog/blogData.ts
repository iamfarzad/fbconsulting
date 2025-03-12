import { BlogPost } from '@/types/blog';

// Blog posts data store
export const blogPosts: BlogPost[] = [
  {
    title: "Revolutionizing Business Processes with AI Automation",
    slug: "revolutionizing-business-processes",
    date: "2023-11-15",
    readTime: "8 min read",
    category: "Strategy",
    author: "Farzad Azadi",
    authorTitle: "AI Automation Specialist",
    authorAvatar: "/placeholder.svg",
    content: `<p>Artificial Intelligence is transforming how businesses operate. This article explores practical applications of AI automation across different industries.</p>
              <h2>Understanding AI Automation</h2>
              <p>AI automation refers to the use of artificial intelligence technologies to automate tasks and processes that would typically require human intelligence.</p>
              <h2>Key Benefits</h2>
              <ul>
                <li>Increased efficiency and productivity</li>
                <li>Reduced operational costs</li>
                <li>Enhanced accuracy and consistency</li>
                <li>Scalability for growing businesses</li>
              </ul>
              <h2>Implementation Strategies</h2>
              <p>When implementing AI automation, it's crucial to...</p>`,
    excerpt: "Explore how AI automation is transforming business operations and unlocking new efficiencies across industries.",
    featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    relatedPosts: [
      { id: "2", title: "AI for Customer Service Automation", slug: "ai-customer-service-automation" },
      { id: "3", title: "Machine Learning in Supply Chain Management", slug: "machine-learning-supply-chain" }
    ]
  },
  {
    title: "AI for Customer Service Automation",
    slug: "ai-customer-service-automation",
    date: "2023-10-28",
    readTime: "6 min read",
    category: "Implementation",
    author: "Maya Johnson",
    authorTitle: "Customer Experience Expert",
    authorAvatar: "/placeholder.svg",
    content: `<p>Customer service is one of the most promising areas for AI implementation...</p>`,
    excerpt: "Discover how AI-powered chatbots and automation tools are revolutionizing customer service operations.",
    featuredImage: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387",
    relatedPosts: [
      { id: "1", title: "Revolutionizing Business Processes with AI Automation", slug: "revolutionizing-business-processes" },
      { id: "4", title: "Ethical Considerations in AI Implementation", slug: "ethical-considerations-ai" }
    ]
  },
  {
    title: "Machine Learning in Supply Chain Management",
    slug: "machine-learning-supply-chain",
    date: "2023-09-15",
    readTime: "10 min read",
    category: "Case Study",
    author: "Raj Patel",
    authorTitle: "Supply Chain Analytics Lead",
    authorAvatar: "/placeholder.svg",
    content: `<p>Supply chain management is being transformed through machine learning applications...</p>`,
    excerpt: "Learn how machine learning algorithms are optimizing inventory, forecasting demand, and reducing costs in supply chains.",
    featuredImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
    relatedPosts: [
      { id: "1", title: "Revolutionizing Business Processes with AI Automation", slug: "revolutionizing-business-processes" },
      { id: "5", title: "Predictive Analytics for Business Intelligence", slug: "predictive-analytics-business" }
    ]
  },
  {
    title: "Ethical Considerations in AI Implementation",
    slug: "ethical-considerations-ai",
    date: "2023-08-30",
    readTime: "7 min read",
    category: "Strategy",
    author: "Elena Gomez",
    authorTitle: "AI Ethics Researcher",
    authorAvatar: "/placeholder.svg",
    content: `<p>As AI becomes more prevalent in business, ethical considerations become increasingly important...</p>`,
    excerpt: "Explore the ethical dimensions of implementing AI in your business processes and how to navigate potential challenges.",
    featuredImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    relatedPosts: [
      { id: "2", title: "AI for Customer Service Automation", slug: "ai-customer-service-automation" },
      { id: "6", title: "The Future of Work with AI Automation", slug: "future-work-ai-automation" }
    ]
  },
  {
    title: "Predictive Analytics for Business Intelligence",
    slug: "predictive-analytics-business",
    date: "2023-07-22",
    readTime: "9 min read",
    category: "Implementation",
    author: "Jordan Lee",
    authorTitle: "Data Science Director",
    authorAvatar: "/placeholder.svg",
    content: `<p>Predictive analytics is revolutionizing how businesses make decisions...</p>`,
    excerpt: "Discover how predictive analytics tools are enabling businesses to make data-driven decisions and gain competitive advantages.",
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    relatedPosts: [
      { id: "3", title: "Machine Learning in Supply Chain Management", slug: "machine-learning-supply-chain" },
      { id: "6", title: "The Future of Work with AI Automation", slug: "future-work-ai-automation" }
    ]
  },
  {
    title: "The Future of Work with AI Automation",
    slug: "future-work-ai-automation",
    date: "2023-06-15",
    readTime: "8 min read",
    category: "Trends",
    author: "Farzad Azadi",
    authorTitle: "AI Automation Specialist",
    authorAvatar: "/placeholder.svg",
    content: `<p>AI automation is changing the nature of work across all industries...</p>`,
    excerpt: "Explore how AI automation is reshaping the workplace, changing job roles, and creating new opportunities for human-AI collaboration.",
    featuredImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    relatedPosts: [
      { id: "1", title: "Revolutionizing Business Processes with AI Automation", slug: "revolutionizing-business-processes" },
      { id: "4", title: "Ethical Considerations in AI Implementation", slug: "ethical-considerations-ai" }
    ]
  },
  {
    title: "Small Business Guide to AI Implementation",
    slug: "small-business-ai-guide",
    date: "2023-05-18",
    readTime: "5 min read",
    category: "Guide",
    author: "Samantha Chen",
    authorTitle: "Small Business Consultant",
    authorAvatar: "/placeholder.svg",
    content: `<p>AI isn't just for large enterprises. Small businesses can also leverage AI technologies...</p>`,
    excerpt: "A practical guide for small business owners looking to implement AI solutions on a limited budget.",
    featuredImage: "https://images.unsplash.com/photo-1664575196044-195f135295df",
    relatedPosts: [
      { id: "1", title: "Revolutionizing Business Processes with AI Automation", slug: "revolutionizing-business-processes" },
      { id: "8", title: "ROI of AI Automation: Measuring Success", slug: "roi-ai-automation" }
    ]
  },
  {
    title: "ROI of AI Automation: Measuring Success",
    slug: "roi-ai-automation",
    date: "2023-04-12",
    readTime: "7 min read",
    category: "Strategy",
    author: "Michael Okonjo",
    authorTitle: "Business Analytics Expert",
    authorAvatar: "/placeholder.svg",
    content: `<p>Understanding the return on investment for AI automation projects is critical...</p>`,
    excerpt: "Learn how to measure the ROI of your AI automation initiatives and communicate value to stakeholders.",
    featuredImage: "https://images.unsplash.com/photo-1551135049-8a33b5883817",
    relatedPosts: [
      { id: "1", title: "Revolutionizing Business Processes with AI Automation", slug: "revolutionizing-business-processes" },
      { id: "7", title: "Small Business Guide to AI Implementation", slug: "small-business-ai-guide" }
    ]
  }
];
