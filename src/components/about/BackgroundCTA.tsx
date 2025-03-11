
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const BackgroundCTA = () => {
  return (
    <motion.div 
      className="mt-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="p-6 border border-primary/20 bg-background/80 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-3">Ready to transform your business with AI?</h3>
        <p className="mb-4">Book a free 30-minute consultation to discuss how AI automation can help your specific business needs.</p>
        <motion.a 
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar className="mr-2 w-5 h-5" />
          Schedule Now
        </motion.a>
      </Card>
    </motion.div>
  );
};

export default BackgroundCTA;
