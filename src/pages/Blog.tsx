
import { useState } from 'react';
import SearchButton from '@/components/ui/search/SearchButton';
import { SearchDialog } from '@/components/ui/search/SearchDialog';

const Blog = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog</h1>
          <SearchButton onClick={() => setSearchOpen(true)} />
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Blog posts will be displayed here */}
          <div className="border rounded-lg p-6">
            <p className="text-muted-foreground">Blog posts will be displayed here once content is available</p>
          </div>
        </div>
      </div>
      
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
};

export default Blog;
