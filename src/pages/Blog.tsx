import React from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, getBlogCategories } from '@/services/blogService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import NewsletterSignup from '@/components/NewsletterSignup';
import SEO from '@/components/SEO';
import DotPattern from '@/components/ui/dot-pattern';

const Blog = () => {
  const allPosts = getAllBlogPosts();
  const categories = getBlogCategories();
  const featuredPost = allPosts[0]; // Just use the first post as featured
  const regularPosts = allPosts.slice(1);

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
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="AI Automation Blog | Insights & Case Studies"
        description="Explore expert insights, case studies, and guides on AI automation for business - stay updated on the latest AI trends and implementation strategies."
        structuredData={blogStructuredData}
      />
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 tech-grid relative">
        <DotPattern width={14} height={14} cx={7} cy={7} cr={1.2} className="opacity-30" />
        <PageHeader
          title="Blog & Case Studies"
          subtitle="Expert insights on AI automation for business"
        />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gradient-teal">Featured Post</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link to={`/blog/${featuredPost.slug}`} className="block">
                <div className="tech-card h-full">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="rounded-t-lg w-full h-48 object-cover"
                  />
                  <div className="p-6 frosted-glass rounded-b-lg">
                    <h3 className="text-xl font-semibold text-gradient-teal mb-2">{featuredPost.title}</h3>
                    <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <span>{featuredPost.date}</span>
                      <span className="text-teal">{featuredPost.author}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gradient-teal">All Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.slug} className="block">
                  <div className="tech-card h-full flex flex-col">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="rounded-t-lg w-full h-36 object-cover"
                    />
                    <div className="p-6 frosted-glass rounded-b-lg flex-grow">
                      <h3 className="text-lg font-semibold text-gradient-teal mb-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="text-sm text-muted-foreground flex items-center justify-between mt-auto">
                        <span>{post.date}</span>
                        <span className="text-teal">{post.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gradient-teal">Categories</h2>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <Button variant="outline" key={category} className="border-teal text-teal hover:bg-teal/10">{category}</Button>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <NewsletterSignup />
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
