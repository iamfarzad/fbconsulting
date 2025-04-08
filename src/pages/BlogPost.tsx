
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShareIcon, BookmarkIcon, ArrowLeft } from 'lucide-react';
import PostHeader from '@/components/blog/PostHeader';
import { Link } from 'react-router-dom';

const BlogPost = () => {
  // Sample blog post data - would come from a database or CMS in real app
  const post = {
    id: '1',
    title: 'How AI is Transforming Business Operations',
    content: `
      <p>Artificial Intelligence (AI) is rapidly changing the landscape of business operations across industries. From customer service to data analysis, AI technologies are providing unprecedented opportunities for efficiency and innovation.</p>
      
      <h2>The Rise of AI in Business</h2>
      <p>Over the past decade, AI has evolved from experimental technology to a critical business tool. Companies that leverage AI effectively are seeing significant advantages in:</p>
      <ul>
        <li>Customer engagement and service</li>
        <li>Process automation and optimization</li>
        <li>Data-driven decision making</li>
        <li>Predictive analytics and forecasting</li>
      </ul>
      
      <h2>Real-World Applications</h2>
      <p>Many businesses are already implementing AI solutions that deliver tangible benefits:</p>
      <p>Chatbots and virtual assistants are handling customer inquiries, reducing wait times and freeing human agents to address more complex issues. Machine learning algorithms are analyzing vast amounts of data to identify patterns and trends that would be impossible for humans to detect manually.</p>
      
      <h2>Implementation Challenges</h2>
      <p>Despite the clear advantages, implementing AI solutions comes with its own set of challenges:</p>
      <ul>
        <li>Data quality and accessibility</li>
        <li>Integration with existing systems</li>
        <li>Skills gap and training requirements</li>
        <li>Ethical considerations and regulatory compliance</li>
      </ul>
      
      <h2>Looking Ahead</h2>
      <p>As AI technology continues to evolve, we can expect to see even more innovative applications in business. Companies that start building their AI capabilities now will be better positioned to compete in an increasingly automated future.</p>
    `,
    date: 'April 12, 2023',
    readTime: '5 min read',
    author: 'Jane Smith',
    authorTitle: 'AI Specialist',
    category: 'AI & Machine Learning',
    relatedPosts: [
      { 
        id: '2', 
        title: 'Machine Learning for Small Businesses', 
        excerpt: 'How even small organizations can benefit from machine learning technologies.'
      },
      { 
        id: '3', 
        title: 'The Ethics of AI Implementation', 
        excerpt: 'Navigating the complex ethical landscape of artificial intelligence in business.'
      }
    ]
  };

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Back to blog link */}
      <Link to="/blog" className="flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to blog
      </Link>
      
      {/* Post header */}
      <PostHeader 
        title={post.title}
        date={post.date}
        readTime={post.readTime}
        author={post.author}
        authorTitle={post.authorTitle}
        category={post.category}
      />
      
      {/* Share and save buttons */}
      <div className="flex gap-4 mb-8">
        <Button variant="outline" size="sm">
          <ShareIcon className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" size="sm">
          <BookmarkIcon className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
      
      {/* Featured image */}
      <div className="w-full h-[400px] bg-muted rounded-lg mb-8"></div>
      
      {/* Post content */}
      <div className="prose dark:prose-invert max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      
      <Separator className="my-12" />
      
      {/* Related posts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {post.relatedPosts.map((relatedPost) => (
            <Card key={relatedPost.id} className="p-6">
              <h3 className="text-xl font-medium mb-2">{relatedPost.title}</h3>
              <p className="text-muted-foreground mb-4">{relatedPost.excerpt}</p>
              <Button variant="outline" size="sm">Read Article</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
