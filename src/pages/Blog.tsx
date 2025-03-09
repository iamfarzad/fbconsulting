
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarIcon, ArrowRightIcon, BookIcon, ClockIcon, TagIcon } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How AI Automation Saved a Manufacturing Company $1.2M Annually',
    excerpt: 'A case study on implementing custom AI solutions for production line optimization and quality control automation.',
    date: 'May 15, 2023',
    readTime: '8 min read',
    category: 'Case Study',
    image: '/placeholder.svg',
    slug: 'manufacturing-ai-automation-case-study',
  },
  {
    id: '2',
    title: 'The Future of Customer Service: AI Chatbots That Actually Work',
    excerpt: 'Exploring how advanced NLP models are transforming customer service automation with practical implementation examples.',
    date: 'June 3, 2023',
    readTime: '6 min read',
    category: 'Insights',
    image: '/placeholder.svg',
    slug: 'future-of-customer-service-ai-chatbots',
  },
  {
    id: '3',
    title: 'Automating Financial Analysis: A Step-by-Step Guide',
    excerpt: 'Learn how to implement AI tools that can analyze financial data, predict trends, and generate reports automatically.',
    date: 'July 12, 2023',
    readTime: '10 min read',
    category: 'Tutorial',
    image: '/placeholder.svg',
    slug: 'automating-financial-analysis-guide',
  },
  {
    id: '4',
    title: 'How Small Businesses Can Leverage AI Without Breaking the Bank',
    excerpt: 'Affordable AI automation strategies for small businesses that deliver significant ROI with minimal upfront investment.',
    date: 'August 22, 2023',
    readTime: '7 min read',
    category: 'Strategy',
    image: '/placeholder.svg',
    slug: 'small-business-ai-automation-strategies',
  },
  {
    id: '5',
    title: 'AI Workflow Automation: Real-World Success Stories',
    excerpt: 'Case studies from diverse industries showing how AI-powered workflow automation has transformed operational efficiency.',
    date: 'September 8, 2023',
    readTime: '9 min read',
    category: 'Case Study',
    image: '/placeholder.svg',
    slug: 'ai-workflow-automation-success-stories',
  },
  {
    id: '6',
    title: 'The Ethical Considerations of Implementing AI in Your Business',
    excerpt: 'Navigating the ethical challenges and considerations when deploying AI systems in various business contexts.',
    date: 'October 17, 2023',
    readTime: '11 min read',
    category: 'Insights',
    image: '/placeholder.svg',
    slug: 'ethical-considerations-business-ai-implementation',
  },
];

const Blog = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="mb-12">
            <PageHeader 
              title="Blog & Case Studies" 
              subtitle="Insights, tutorials, and real-world examples of AI automation transforming businesses"
            />
          </div>

          {/* Featured post */}
          <div className="mb-16">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={blogPosts[0].image} 
                    alt={blogPosts[0].title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                      {blogPosts[0].category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center mb-4 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" /> 
                    <span>{blogPosts[0].date}</span>
                    <span className="mx-2">•</span>
                    <ClockIcon className="h-4 w-4 mr-1" /> 
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {blogPosts[0].excerpt}
                  </p>
                  <div>
                    <Button asChild>
                      <Link to={`/blog/${blogPosts[0].slug}`}>
                        Read Case Study <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-primary/90 text-white text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center mb-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" /> 
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <ClockIcon className="h-4 w-4 mr-1" /> 
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="ghost" asChild className="p-0 hover:bg-transparent">
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-primary font-medium inline-flex items-center"
                    >
                      Read More <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Browse by Category</h3>
            <div className="flex flex-wrap gap-2">
              {['All Posts', 'Case Study', 'Insights', 'Tutorial', 'Strategy'].map((category) => (
                <Button 
                  key={category} 
                  variant={category === 'All Posts' ? 'default' : 'outline'} 
                  size="sm"
                  className="rounded-full"
                >
                  {category === 'All Posts' ? (
                    <BookIcon className="mr-1 h-4 w-4" />
                  ) : (
                    <TagIcon className="mr-1 h-4 w-4" />
                  )}
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Newsletter signup */}
          <div className="bg-muted rounded-xl p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-3">Subscribe to My Newsletter</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest insights on AI automation and digital transformation delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
