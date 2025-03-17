
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { Timeline } from '../ui/timeline';

// Timeline data
const timelineData = [
  {
    title: '2016',
    content: (
      <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-muted 
                    hover:border-[#fe5a1d]/30 transition-all duration-300 
                    shadow-sm hover:shadow-md hover:shadow-[#fe5a1d]/5">
        <div className="text-[#fe5a1d] font-bold mb-2">First AI Project</div>
        <p className="text-muted-foreground text-sm">Built my first machine learning system for predictive analytics</p>
      </div>
    )
  },
  {
    title: '2018',
    content: (
      <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-muted 
                    hover:border-[#fe5a1d]/30 transition-all duration-300 
                    shadow-sm hover:shadow-md hover:shadow-[#fe5a1d]/5">
        <div className="text-[#fe5a1d] font-bold mb-2">AI Leadership Role</div>
        <p className="text-muted-foreground text-sm">Led AI strategy and implementation across business functions</p>
      </div>
    )
  },
  {
    title: '2020',
    content: (
      <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-muted 
                    hover:border-[#fe5a1d]/30 transition-all duration-300 
                    shadow-sm hover:shadow-md hover:shadow-[#fe5a1d]/5">
        <div className="text-[#fe5a1d] font-bold mb-2">ChatGPT Early Adopter</div>
        <p className="text-muted-foreground text-sm">Integrated conversational AI to automate customer support workflows</p>
      </div>
    )
  },
  {
    title: '2021',
    content: (
      <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-muted 
                    hover:border-[#fe5a1d]/30 transition-all duration-300 
                    shadow-sm hover:shadow-md hover:shadow-[#fe5a1d]/5">
        <div className="text-[#fe5a1d] font-bold mb-2">Enterprise AI Transformation</div>
        <p className="text-muted-foreground text-sm">Successfully drove enterprise-wide AI implementation saving $1.2M annually</p>
      </div>
    )
  },
  {
    title: '2023',
    content: (
      <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-muted 
                    hover:border-[#fe5a1d]/30 transition-all duration-300 
                    shadow-sm hover:shadow-md hover:shadow-[#fe5a1d]/5">
        <div className="text-[#fe5a1d] font-bold mb-2">Launched AI Consulting</div>
        <p className="text-muted-foreground text-sm">Helping businesses automate workflows and cut costs with AI</p>
      </div>
    )
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
        
        <Timeline data={timelineData} />
      </div>
    </section>
  );
};

export default AIJourney;
