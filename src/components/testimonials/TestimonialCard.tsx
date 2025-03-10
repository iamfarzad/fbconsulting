
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { Testimonial } from '@/types/blog';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="h-full flex flex-col bg-white dark:bg-zinc-900 border-border/20 shadow-lg">
      <CardContent className="pt-6 pb-2 flex-grow">
        <div className="flex mb-3">
          {renderStars(testimonial.rating)}
        </div>
        <blockquote className="text-lg italic text-muted-foreground">
          "{testimonial.content}"
        </blockquote>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-3">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <div className="font-medium">{testimonial.name}</div>
            <div className="text-sm text-muted-foreground">
              {testimonial.role} at {testimonial.company}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
