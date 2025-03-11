
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
    content: "AI automation reduced our response times by 65% and improved customer satisfaction.",
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'FinanceFlow',
    role: 'Operations Director',
    content: "What took days now happens in minutes—our operations run 10x faster.",
    rating: 5
  },
  {
    id: '3',
    name: 'Alicia Rodriguez',
    company: 'RetailPro',
    role: 'Marketing Manager',
    content: "AI-powered insights helped us improve marketing effectiveness by 40%.",
    rating: 4
  }
];

interface TestimonialsProps {
  id?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ id }) => {
  return (
    <section id={id} className="py-20 px-4 scroll-mt-24 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <AnimatedText
            text="What Clients Say"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4"
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
