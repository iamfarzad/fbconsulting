
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import { motion } from "framer-motion";
import { 
  Brain, 
  Bot, 
  LineChart, 
  Database, 
  Workflow, 
  Code,
  Sparkles
} from "lucide-react";

// Enhanced skills data with more visually appealing structure
const SKILLS_DATA = [
  {
    title: "AI & Machine Learning",
    description: "Building intelligent systems that learn and adapt",
    icon: Brain,
    color: "from-purple-500 to-purple-300",
    bulletPoints: [
      "Custom GPT model training & fine-tuning",
      "Machine learning & predictive analytics",
      "Synthetic data generation"
    ]
  },
  {
    title: "Workflow Automation",
    description: "Streamlining business processes with AI",
    icon: Workflow,
    color: "from-blue-500 to-blue-300",
    bulletPoints: [
      "Process analysis and optimization",
      "Custom automation solution development",
      "Performance monitoring systems"
    ]
  },
  {
    title: "Data Analytics",
    description: "Transforming data into actionable insights",
    icon: LineChart,
    color: "from-green-500 to-green-300",
    bulletPoints: [
      "Business intelligence dashboards",
      "Predictive modeling & forecasting",
      "Data visualization & reporting"
    ]
  },
  {
    title: "Conversational AI",
    description: "Creating natural language interfaces",
    icon: Bot,
    color: "from-yellow-500 to-yellow-300",
    bulletPoints: [
      "Custom chatbot development",
      "Virtual assistants & AI Copilots",
      "LLM prompt engineering & optimization"
    ]
  },
  {
    title: "Database & Systems",
    description: "Building robust data infrastructure",
    icon: Database,
    color: "from-red-500 to-red-300",
    bulletPoints: [
      "Database design & optimization",
      "API development & integration",
      "Cloud infrastructure setup"
    ]
  },
  {
    title: "Development",
    description: "Creating custom software solutions",
    icon: Code,
    color: "from-teal-500 to-teal-300",
    bulletPoints: [
      "Web application development",
      "Mobile app development",
      "AI-integrated software solutions"
    ]
  }
];

const SkillCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  bulletPoints,
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
      className="relative overflow-hidden rounded-xl border border-primary/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 transition-opacity duration-300 group-hover:opacity-10`} />
      
      {/* Icon with gradient background */}
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-gradient-to-br ${color} bg-opacity-10`}>
        <Icon className="h-6 w-6 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <ul className="space-y-2">
        {bulletPoints.map((point, i) => (
          <motion.li 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: (index * 0.1) + (i * 0.1) }}
            viewport={{ once: true }}
            className="flex items-start gap-2"
          >
            <span className="text-primary mt-1">•</span>
            <span className="text-sm">{point}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const SkillsTechnologies = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/10 to-background/0 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <AnimatedText 
            text="Skills & Technologies" 
            tag="h2" 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
          />
          
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-primary/80 to-primary/30 mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
          />
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized expertise in AI and automation technologies to help businesses transform their operations and achieve measurable results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS_DATA.map((skill, index) => (
            <SkillCard
              key={index}
              title={skill.title}
              description={skill.description}
              icon={skill.icon}
              color={skill.color}
              bulletPoints={skill.bulletPoints}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsTechnologies;
