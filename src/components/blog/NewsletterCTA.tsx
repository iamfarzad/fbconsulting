
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import NewsletterSignup from '@/components/NewsletterSignup';

const NewsletterCTA: React.FC = () => {
  return (
    <Card className="my-8">
      <CardContent className="p-6">
        <NewsletterSignup 
          title="Enjoyed this article?"
          description="Subscribe to our newsletter for more AI automation insights and tips delivered straight to your inbox."
        />
      </CardContent>
    </Card>
  );
};

export default NewsletterCTA;
