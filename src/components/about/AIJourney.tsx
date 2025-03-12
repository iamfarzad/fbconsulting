
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';

// Timeline data
const timelineItems = [
  {
    year: '2016',
    title: 'First AI Project',
    description: 'Built my first machine learning system for predictive analytics'
  },
  {
    year: '2018',
    title: 'AI Leadership Role',
    description: 'Led AI strategy and implementation across business functions'
  },
  {
    year: '2020',
    title: 'ChatGPT Early Adopter',
    description: 'Integrated conversational AI to automate customer support workflows'
  },
  {
    year: '2021',
    title: 'Enterprise AI Transformation',
    description: 'Successfully drove enterprise-wide AI implementation saving $1.2M annually'
  },
  {
    year: '2023',
    title: 'Launched AI Consulting',
    description: 'Helping businesses automate workflows and cut costs with AI'
  }
];

const AIJourney = () => {
  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
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
              <History className="w-6 h-6 text-[#fe5a1d]" />
            </div>
          </div>
          
          <AnimatedText 
            text="AI-Driven Startups & Projects Timeline" 
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
            My journey in AI spans multiple industries and technologies—from building cognitive platforms to implementing LLM solutions. Each project has sharpened my ability to transform business operations with AI.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#fe5a1d]/80 via-[#fe5a1d]/30 to-[#fe5a1d]/5 transform -translate-x-1/2"></div>
          
          {/* Timeline items */}
          <div className="relative z-10">
            {timelineItems.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={cn(
                  "flex mb-12 last:mb-0 relative items-center",
                  index % 2 === 0 ? "justify-end" : "justify-start",
                  "md:justify-center" // Center on mobile
                )}
              >
                <div 
                  className={cn(
                    "md:absolute md:top-1/2 md:transform md:-translate-y-1/2",
                    index % 2 === 0 ? "md:right-1/2 md:pr-12 text-right" : "md:left-1/2 md:pl-12 text-left",
                    "md:w-[calc(50%-24px)]"
                  )}
                >
                  <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-muted 
                                hover:border-[#fe5a1d]/30 transition-all duration-300 
                                shadow-sm hover:shadow-md hover:shadow-[#fe5a1d]/5">
                    <div className="text-[#fe5a1d] font-bold mb-2">{item.year}</div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
                
                {/* Center node */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                              w-4 h-4 rounded-full bg-[#fe5a1d] z-10
                              shadow-[0_0_12px_rgba(254,90,29,0.5)]">
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIJourney;
