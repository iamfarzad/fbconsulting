
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  Workflow, 
  BarChart3, 
  Code,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface BentoItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  hoverAnimation?: React.ReactNode;
  className?: string;
}

const BentoItem: React.FC<BentoItemProps> = ({ 
  title, 
  description, 
  icon, 
  hoverAnimation,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className={`bento-card p-6 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal mr-3">
            {icon}
          </div>
          <h3 className="text-xl font-futuristic font-bold">{title}</h3>
        </div>
        
        <p className="text-muted-foreground">{description}</p>
        
        <div className="mt-6 h-16 flex items-center justify-center">
          {isHovered && hoverAnimation}
        </div>
      </div>
    </motion.div>
  );
};

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
          <BentoItem 
            title="AI Strategy & Consulting" 
            description="Get a roadmap for AI-driven automation in your business with personalized recommendations."
            icon={<Brain className="w-6 h-6" />}
            hoverAnimation={
              <motion.div 
                className="flex flex-col items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-teal"></div>
                  <div className="w-3 h-3 rounded-full bg-retro-pink"></div>
                  <div className="w-3 h-3 rounded-full bg-teal"></div>
                </div>
                <motion.div 
                  className="h-[2px] w-24 bg-gradient-to-r from-teal to-retro-pink"
                  initial={{ width: 0 }}
                  animate={{ width: 96 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            }
          />
          
          <BentoItem 
            title="Chatbots & Virtual Assistants" 
            description="Automate customer support and internal operations with intelligent AI assistants."
            icon={<MessageSquare className="w-6 h-6" />}
            hoverAnimation={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div 
                  className="inline-block"
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 2,
                  }}
                >
                  <MessageSquare className="w-10 h-10 text-teal" />
                </motion.div>
                <motion.div 
                  className="mt-1 h-1 w-16 mx-auto bg-teal/30 rounded-full"
                  animate={{
                    width: [40, 60, 40]
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 1.5,
                  }}
                />
              </motion.div>
            }
          />
          
          <BentoItem 
            title="Workflow Automation" 
            description="Connect apps, automate tasks, and eliminate manual work with custom automation solutions."
            icon={<Workflow className="w-6 h-6" />}
            hoverAnimation={
              <motion.div className="flex items-center space-x-3">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-teal flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-teal" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 1 }}
                  className="h-0.5 bg-teal"
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                >
                  <CheckCircle className="w-8 h-8 text-teal" />
                </motion.div>
              </motion.div>
            }
          />
          
          <BentoItem 
            title="AI Data Insights" 
            description="Leverage AI to analyze your business data and make smarter decisions with automated reporting."
            icon={<BarChart3 className="w-6 h-6" />}
            hoverAnimation={
              <div className="flex items-end h-14 space-x-2">
                {[40, 80, 50, 70, 90, 60].map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-3 bg-gradient-to-t from-teal to-retro-pink rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ 
                      delay: i * 0.1,
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            }
          />
          
          <BentoItem 
            title="Custom AI Development" 
            description="Build tailored AI solutions for your specific business challenges with custom development."
            icon={<Code className="w-6 h-6" />}
            hoverAnimation={
              <motion.div className="text-sm font-mono">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-teal"
                >
                  {`function optimize() {`}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="ml-3 text-retro-pink"
                >
                  {`return AI.solve(problem);`}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="text-teal"
                >
                  {`}`}
                </motion.div>
              </motion.div>
            }
          />
          
          <BentoItem 
            title="Not sure what you need?" 
            description="Book a free consultation to discuss your unique business challenges and find the right AI solution."
            icon={<Sparkles className="w-6 h-6" />}
            className="border-dashed"
            hoverAnimation={
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="text-teal"
              >
                <Sparkles className="w-10 h-10" />
              </motion.div>
            }
          />
        </motion.div>
      </div>
    </section>
  );
};

export default BentoGrid;
