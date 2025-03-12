
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import { Cpu, Brain, Workflow, Database, MessageSquare } from 'lucide-react';
import { skillsData } from '@/data/skillsData';

const SkillsTechnologies = () => {
  // Function to render the correct icon based on the string name
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'Brain':
        return <Brain className="w-5 h-5 text-[#fe5a1d]" />;
      case 'Workflow':
        return <Workflow className="w-5 h-5 text-[#fe5a1d]" />;
      case 'Database':
        return <Database className="w-5 h-5 text-[#fe5a1d]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-[#fe5a1d]" />;
      default:
        return <Brain className="w-5 h-5 text-[#fe5a1d]" />;
    }
  };

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
              <Cpu className="w-6 h-6 text-[#fe5a1d]" />
            </div>
          </div>
          
          <AnimatedText 
            text="Skills & Technologies" 
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
            My technical expertise spans AI engineering, workflow automation, and business transformation—a blend of technical depth and strategic vision needed to implement effective AI solutions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skillsData).map(([category, skill], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background/50 backdrop-blur-sm border border-muted hover:border-[#fe5a1d]/20 
                         rounded-xl p-6 shadow-sm hover:shadow-md hover:shadow-[#fe5a1d]/5 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#fe5a1d]/10 p-2 rounded-md mr-3">
                  {renderIcon(skill.icon)}
                </div>
                <h3 className="font-semibold text-lg">{skill.title}</h3>
              </div>
              
              <ul className="space-y-2">
                {skill.items.map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe5a1d] mr-2"></span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsTechnologies;
