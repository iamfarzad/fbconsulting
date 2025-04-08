
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, BookOpen, Filter } from 'lucide-react';

const Blog = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search articles..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      {/* Post categories */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="ai">AI & Machine Learning</TabsTrigger>
          <TabsTrigger value="business">Business Strategy</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample blog post cards - these would be populated from data */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="overflow-hidden h-full flex flex-col">
                <CardHeader className="pb-0">
                  <div className="h-48 bg-muted rounded-md mb-4"></div>
                  <CardTitle className="text-xl">How AI is Transforming Business Operations</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-2">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Apr 12, 2023
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      5 min read
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="py-4">
                  <p className="text-muted-foreground line-clamp-3">
                    Discover how artificial intelligence is revolutionizing the way businesses operate and make decisions.
                    From automated customer service to predictive analytics, AI is changing everything.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-0">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read Article
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ai" className="mt-6">
          <p>AI and Machine Learning articles will appear here.</p>
        </TabsContent>
        
        <TabsContent value="business" className="mt-6">
          <p>Business Strategy articles will appear here.</p>
        </TabsContent>
        
        <TabsContent value="automation" className="mt-6">
          <p>Automation articles will appear here.</p>
        </TabsContent>
      </Tabs>
      
      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <div className="flex space-x-2">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">1</Button>
          <Button variant="default">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
