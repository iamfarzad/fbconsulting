
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostHeader from '@/components/blog/PostHeader';
import PostContent from '@/components/blog/PostContent';
import ShareSection from '@/components/blog/ShareSection';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { getBlogPost } from '@/services/blogService';
import SEO from '@/components/SEO';
import DotPattern from '@/components/ui/dot-pattern';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // In a real app, this would check if the post exists and handle loading states
  const post = getBlogPost(slug || '');

  // Create article structured data
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.featuredImage || "",
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Automation Ally",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/og-image.png`
      }
    },
    "description": post.excerpt || post.title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title={`${post.title} | AI Automation Ally Blog`}
        description={post.excerpt || `Read about ${post.title} in our AI automation blog`}
        ogType="article"
        ogImage={post.featuredImage || ""}
        structuredData={articleStructuredData}
      />
      <Navbar />
      <main className="flex-grow pt-24 pb-16 relative">
        <DotPattern width={14} height={14} cx={7} cy={7} cr={1.2} className="opacity-20" />
        <div className="container px-4 mx-auto relative z-10">
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link to="/blog" className="inline-flex items-center">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to all posts
              </Link>
            </Button>
          </div>

          <article className="max-w-3xl mx-auto">
            <PostHeader 
              title={post.title}
              category={post.category}
              date={post.date}
              readTime={post.readTime}
              author={post.author}
              authorTitle={post.authorTitle}
              authorAvatar={post.authorAvatar}
            />
            
            <PostContent 
              content={post.content}
              title={post.title}
            />
            
            <ShareSection />
            
            <RelatedPosts posts={post.relatedPosts} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
