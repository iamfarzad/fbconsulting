
import React from 'react';
import { motion } from 'framer-motion';
import BentoItem from './bento/BentoItem';
import { services } from '@/data/servicesData';

const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 px-4 overflow-hidden bg-gradient-to-b from-background to-deep-purple/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-futuristic font-bold mb-4 text-gradient-teal">
              AI Services for Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your operations with intelligent automation
            </p>
          </motion.div>
        </div>
        
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

export default BentoGrid;
