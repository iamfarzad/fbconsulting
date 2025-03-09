
import React from 'react';
import TestimonialCard from './TestimonialCard';
import AnimatedText from '@/components/AnimatedText';
import { Testimonial } from '@/types/blog';

// Example testimonial data - in a real app this would come from an API
const testimonialData: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechInnovate',
    role: 'CTO',
    content: 'The AI automation solutions transformed our customer service operations. We've reduced response times by 65% while improving customer satisfaction scores.',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'FinanceFlow',
    role: 'Operations Director',
    content: 'Implementing AI for our document processing workflows was a game-changer. What took days now happens in minutes with greater accuracy.',
    rating: 5
  },
  {
    id: '3',
    name: 'Alicia Rodriguez',
    company: 'RetailPro',
    role: 'Marketing Manager',
    content: 'The customer insights we've gained through AI analysis have completely changed how we approach our marketing strategies. We're seeing a 40% increase in campaign effectiveness.',
    rating: 4
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <AnimatedText
            text="What Clients Say"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AnimatedText
            text="Real results from businesses like yours"
            tag="p"
            delay={200}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialData.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${100 + index * 200}ms`, animationFillMode: 'forwards' }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
