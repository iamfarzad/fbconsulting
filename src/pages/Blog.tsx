import React from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts, getBlogCategories } from '@/services/blogService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SEO from '@/components/SEO';

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
      
      <div className="flex-grow pt-24 pb-16">
        <PageHeader
          title="Blog & Case Studies"
          subtitle="Expert insights on AI automation for business"
        />
        
        <div className="container mx-auto px-4 py-12">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Featured Post</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link to={`/blog/${featuredPost.slug}`} className="block">
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="rounded-lg shadow-md mb-4"
                />
                <h3 className="text-xl font-semibold">{featuredPost.title}</h3>
                <p className="text-muted-foreground">{featuredPost.excerpt}</p>
                <div className="mt-2 text-sm text-muted-foreground">
                  {featuredPost.date} - {featuredPost.author}
                </div>
              </Link>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">All Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.slug} className="block">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="rounded-lg shadow-md mb-4"
                  />
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {post.date} - {post.author}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <Button variant="outline" key={category}>{category}</Button>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Newsletter</h2>
            <p className="text-muted-foreground mb-4">
              Stay up to date with the latest AI trends and insights.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Input type="email" placeholder="Enter your email" />
              <Button>Subscribe</Button>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
