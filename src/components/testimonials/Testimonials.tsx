
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import { Testimonial } from '@/types/blog';
import EnhancedTestimonialCard from './EnhancedTestimonialCard';
import { MessageSquareQuote } from 'lucide-react';

// Enhanced testimonial data with more details
const testimonialData: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechInnovate',
    role: 'CTO',
    content: "The AI automation solutions provided have revolutionized our customer service. Response times dropped by 65% and customer satisfaction scores are at an all-time high. The implementation was smooth and the ongoing support has been exceptional.",
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'FinanceFlow',
    role: 'Operations Director',
    content: "What previously took our team days to complete now happens in minutes. Our operations are running 10x faster with far fewer errors. The AI workflow automation has completely transformed how we process financial data and reports.",
    rating: 5
  },
  {
    id: '3',
    name: 'Alicia Rodriguez',
    company: 'RetailPro',
    role: 'Marketing Manager',
    content: "The AI-powered marketing insights have been a game changer. We've increased our conversion rates by 40% by targeting the right customers with the right offers at the right time. The data analytics capabilities are truly impressive.",
    rating: 4
  }
];

interface TestimonialsProps {
  id?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ id }) => {
  return (
    <section id={id} className="py-24 relative z-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-[#fe5a1d]/10 p-3 rounded-full">
              <MessageSquareQuote className="w-6 h-6 text-[#fe5a1d]" />
            </div>
          </div>
          
          <AnimatedText
            text="What Our Clients Say"
            tag="h2"
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#fe5a1d] to-[#fe5a1d]/70"
          />
          
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-[#fe5a1d]/80 to-[#fe5a1d]/30 mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
          />
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have experienced with our AI automation solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialData.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <EnhancedTestimonialCard testimonial={testimonial} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
