
import React from 'react';
import TestimonialCard from './TestimonialCard';
import AnimatedText from '@/components/AnimatedText';
import { Testimonial } from '@/types/blog';
import { motion } from 'framer-motion';

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
    <section id={id} className="py-20 px-4 scroll-mt-24 relative z-10 bg-gradient-to-b from-background to-background/70">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <AnimatedText
            text="What Clients Say"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient-teal"
          />
          <div className="w-20 h-1 bg-teal/30 mx-auto rounded-full my-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialData.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
