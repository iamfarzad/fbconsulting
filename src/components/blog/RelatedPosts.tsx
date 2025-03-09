
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                <Link 
                  to={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardFooter>
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
    </div>
  );
};

export default RelatedPosts;
