
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, getBlogCategories, filterBlogPosts } from '@/services/blog';
import { BlogFilters as BlogFiltersType } from '@/services/blog/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import NewsletterSignup from '@/components/NewsletterSignup';
import SEO from '@/components/SEO';
import DotPattern from '@/components/ui/dot-pattern';
import { TextRevealByWord } from '@/components/ui/text-reveal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogFilters } from '@/components/blog/BlogFilters';
import { SearchButton } from '@/components/ui/search/SearchButton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const Blog = () => {
  const allPosts = getAllBlogPosts();
  const categories = getBlogCategories();
  const featuredPost = allPosts[0]; // Just use the first post as featured
  
  const [filters, setFilters] = useState<BlogFiltersType>({
    category: 'all',
    searchTerm: '',
    sortField: 'date',
    sortOrder: 'desc'
  });
  
  const [filteredPosts, setFilteredPosts] = useState(allPosts.slice(1));
  
  useEffect(() => {
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    // Filter everything except the featured post
    const postsToFilter = allPosts.slice(1);
    const result = filterBlogPosts(postsToFilter, filters);
    setFilteredPosts(result);
  }, [filters, allPosts]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: BlogFiltersType) => {
    setFilters(newFilters);
  };

  // Blog structured data
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "AI Automation Ally Blog",
    "description": "Expert insights, case studies, and guides on AI automation for business",
    "url": window.location.href,
    "blogPost": allPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "url": `${window.location.origin}/blog/${post.slug}`
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="AI Automation Blog | Insights & Case Studies"
        description="Explore expert insights, case studies, and guides on AI automation for business - stay updated on the latest AI trends and implementation strategies."
        structuredData={blogStructuredData}
      />
      <Navbar />
      
      <main className="flex-grow pt-16 relative overflow-hidden">
        <DotPattern width={14} height={14} cx={7} cy={7} cr={1.2} className="opacity-30" />
        
        {/* Hero section with text reveal */}
        <div className="relative overflow-hidden">
          <TextRevealByWord 
            text="Discover AI automation insights, case studies, and expert guides to transform your business processes." 
            className="pt-8 pb-12 md:pt-12 md:pb-16"
          />
        </div>
        
        {/* Content section starts after the text reveal */}
        <div className="container mx-auto px-4 py-8 relative z-10 mt-[-120px] sm:mt-[-100px] md:mt-[-60px]">
          {/* Search and filter bar */}
          <div className="max-w-3xl mx-auto mb-12 pt-24 md:pt-16">
            <div className="relative flex mb-6">
              <input
                type="text"
                placeholder="Search articles..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-3 border border-input bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchButton iconOnly variant="ghost" className="p-0 hover:bg-transparent" />
              </div>
            </div>
            
            {/* New blog filters component */}
            <BlogFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              totalCount={allPosts.length - 1} // Exclude featured post
              filteredCount={filteredPosts.length}
            />
          </div>

          {/* Featured Article section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-gradient-teal text-center">Featured Article</h2>
            <Link to={`/blog/${featuredPost.slug}`} className="block max-w-4xl mx-auto">
              <div className="tech-card hover-glow transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover aspect-video"
                    />
                  </div>
                  <div className="p-6 frosted-glass rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mr-3">
                          {featuredPost.category}
                        </span>
                        <span className="text-sm text-muted-foreground">{featuredPost.date}</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-gradient-teal mb-4">{featuredPost.title}</h3>
                      <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={featuredPost.authorAvatar || "/placeholder.svg"}
                          alt={featuredPost.author}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm">{featuredPost.author}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* Browse Articles section */}
          <section className="mb-16">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-3xl font-bold mb-6 text-gradient-teal text-center">Browse Articles</h2>
              
              {/* Display posts */}
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                  {filteredPosts.map((post) => (
                    <Link to={`/blog/${post.slug}`} key={post.slug} className="group">
                      <Card className="h-full hover:shadow-md transition-shadow duration-300 frosted-glass">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {post.category}
                            </span>
                            <span className="text-xs text-muted-foreground">{post.date}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gradient-teal">{post.title}</h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between pt-4">
                          <div className="flex items-center">
                            <img 
                              src={post.authorAvatar || "/placeholder.svg"}
                              alt={post.author}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-xs">{post.author}</span>
                          </div>
                          <span className="text-sm text-teal group-hover:underline">Read more</span>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                  <Button onClick={() => handleFilterChange({
                    category: 'all',
                    searchTerm: '',
                    sortField: 'date',
                    sortOrder: 'desc'
                  })}>Clear Filters</Button>
                </div>
              )}
            </div>
          </section>
          
          {/* Newsletter signup */}
          <section className="mt-16">
            <NewsletterSignup />
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
