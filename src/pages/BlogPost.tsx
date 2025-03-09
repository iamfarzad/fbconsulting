
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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // In a real app, this would check if the post exists and handle loading states
  const post = getBlogPost(slug || '');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 mx-auto">
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
