
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import { Briefcase } from 'lucide-react';
import { expertiseData } from './expertiseData';
import ExpertiseCard from './ExpertiseCard';
import BackgroundCTA from './BackgroundCTA';

const BackgroundExperience = () => {
  return (
    <section className="py-20 px-4 bg-background relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-[#fe5a1d]/10 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-[#fe5a1d]" />
            </div>
          </div>
          
          <AnimatedText 
            text="What I Do" 
            tag="h2" 
            className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#fe5a1d] to-[#fe5a1d]/70" 
          />
          
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-[#fe5a1d]/80 to-[#fe5a1d]/30 mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
          />
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I specialize in AI automation and workflow optimization, helping businesses eliminate repetitive tasks, enhance decision-making, and reduce operational costs.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {expertiseData.map((expertise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ExpertiseCard
                icon={expertise.icon}
                title={expertise.title}
                description={expertise.description}
                bulletPoints={expertise.bulletPoints}
              />
            </motion.div>
          ))}
        </div>
        
        <BackgroundCTA />
      </div>
    </section>
  );
};

export default BackgroundExperience;
