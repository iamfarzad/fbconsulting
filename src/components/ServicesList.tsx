
import React from 'react';
import { motion } from 'framer-motion';
import { services } from '@/data/servicesData';
import BentoItem from './bento/BentoItem';

const ServicesList = () => {
  console.log("ServicesList rendering");
  
  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-b from-background to-deep-purple/5">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gradient-teal font-futuristic">
            AI Services for Business
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            I provide customized AI solutions tailored to your specific business needs.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <BentoItem 
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              className={service.className}
              hoverAnimation={service.hoverAnimation}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesList;
