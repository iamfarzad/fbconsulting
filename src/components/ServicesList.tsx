
import React from 'react';
import BentoGrid from './BentoGrid';
import { motion } from 'framer-motion';

const ServicesList = () => {
  console.log("ServicesList rendering");
  
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-teal font-futuristic">
            My AI Services Portfolio
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore my comprehensive range of AI automation solutions designed to transform your business operations
          </p>
        </motion.div>
        
        <BentoGrid />
      </div>
    </section>
  );
};

export default ServicesList;
