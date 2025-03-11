
import React from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '@/types/blog';
import { Star, Quote } from 'lucide-react';

interface EnhancedTestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const EnhancedTestimonialCard: React.FC<EnhancedTestimonialCardProps> = ({ testimonial, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      className={`relative p-6 rounded-xl overflow-hidden ${isEven ? 'bg-primary/5' : 'bg-secondary/5'} backdrop-blur-sm border border-primary/10`}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 opacity-10 ${isEven ? 'bg-gradient-to-br from-primary/20 to-transparent' : 'bg-gradient-to-tr from-secondary/20 to-transparent'}`} />
      
      {/* Quote icon */}
      <div className="absolute -top-2 -left-2 text-primary/20 opacity-50">
        <Quote size={60} />
      </div>
      
      <div className="relative z-10">
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        
        <blockquote className="text-lg font-medium mb-6">
          "{testimonial.content}"
        </blockquote>
        
        <div className="flex items-center gap-3">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {testimonial.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="font-semibold">{testimonial.name}</div>
            <div className="text-sm text-muted-foreground">
              {testimonial.role} at {testimonial.company}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedTestimonialCard;
