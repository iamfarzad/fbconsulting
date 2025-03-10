
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, getBlogCategories } from '@/services/blogService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import NewsletterSignup from '@/components/NewsletterSignup';
import SEO from '@/components/SEO';
import DotPattern from '@/components/ui/dot-pattern';
import { TextRevealByWord } from '@/components/ui/text-reveal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const Blog = () => {
  const allPosts = getAllBlogPosts();
  const categories = getBlogCategories();
  const featuredPost = allPosts[0]; // Just use the first post as featured
  const regularPosts = allPosts.slice(1);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);

  const filteredPosts = activeCategory === "all" 
    ? regularPosts 
    : regularPosts.filter(post => post.category === activeCategory);

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
      
      <main className="flex-grow pt-24 pb-16 relative">
        <DotPattern width={14} height={14} cx={7} cy={7} cr={1.2} className="opacity-30" />
        
        {/* Hero section with text reveal */}
        <div className="relative overflow-hidden mb-20">
          <TextRevealByWord 
            text="Discover AI automation insights, case studies, and expert guides to transform your business processes." 
            className="h-[70vh]"
          />
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Search bar - currently just visual */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="block w-full pl-10 pr-3 py-3 border border-input bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-teal/50"
              />
            </div>
          </div>

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

          <section className="mb-16">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-3xl font-bold mb-6 text-gradient-teal text-center">Browse Articles</h2>
              
              <Tabs defaultValue="all" className="w-full max-w-3xl">
                <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
                  <TabsTrigger 
                    value="all" 
                    onClick={() => setActiveCategory("all")}
                    className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal"
                  >
                    All
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      onClick={() => setActiveCategory(category)}
                      className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={activeCategory} className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                      <Link to={`/blog/${post.slug}`} key={post.slug} className="group">
                        <Card className="h-full hover:shadow-md transition-shadow duration-300 frosted-glass">
                          <CardHeader>
                            <h3 className="text-xl font-semibold text-gradient-teal">{post.title}</h3>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                          </CardContent>
                          <CardFooter className="flex items-center justify-between pt-4">
                            <span className="text-sm">{post.date}</span>
                            <span className="text-sm text-teal group-hover:underline">Read more</span>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
          
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
