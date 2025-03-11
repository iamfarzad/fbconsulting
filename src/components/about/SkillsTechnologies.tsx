
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Brain, 
  Bot, 
  LineChart, 
  Database, 
  Workflow, 
  Code
} from "lucide-react";
import FeatureCard from '@/components/FeatureCard';

// Simpler, more focused skills data
const SKILLS_DATA = [
  {
    title: "AI & Machine Learning",
    description: "Building intelligent systems that learn and adapt",
    icon: <Brain className="h-6 w-6 text-primary" />,
    bulletPoints: [
      "Custom GPT model training & fine-tuning",
      "Machine learning & predictive analytics",
      "Synthetic data generation"
    ]
  },
  {
    title: "Workflow Automation",
    description: "Streamlining business processes with AI",
    icon: <Workflow className="h-6 w-6 text-primary" />,
    bulletPoints: [
      "Process analysis and optimization",
      "Custom automation solution development",
      "Performance monitoring systems"
    ]
  },
  {
    title: "Data Analytics",
    description: "Transforming data into actionable insights",
    icon: <LineChart className="h-6 w-6 text-primary" />,
    bulletPoints: [
      "Business intelligence dashboards",
      "Predictive modeling & forecasting",
      "Data visualization & reporting"
    ]
  },
  {
    title: "Conversational AI",
    description: "Creating natural language interfaces",
    icon: <Bot className="h-6 w-6 text-primary" />,
    bulletPoints: [
      "Custom chatbot development",
      "Virtual assistants & AI Copilots",
      "LLM prompt engineering & optimization"
    ]
  },
  {
    title: "Database & Systems",
    description: "Building robust data infrastructure",
    icon: <Database className="h-6 w-6 text-primary" />,
    bulletPoints: [
      "Database design & optimization",
      "API development & integration",
      "Cloud infrastructure setup"
    ]
  },
  {
    title: "Development",
    description: "Creating custom software solutions",
    icon: <Code className="h-6 w-6 text-primary" />,
    bulletPoints: [
      "Web application development",
      "Mobile app development",
      "AI-integrated software solutions"
    ]
  }
];

const SkillsTechnologies = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <AnimatedText 
          text="Skills & Technologies" 
          tag="h2" 
          className="text-3xl font-bold mb-4 text-center"
        />
        
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Specialized expertise in AI and automation technologies to help businesses transform their operations and achieve measurable results.
        </p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {SKILLS_DATA.map((skill, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
              }}
            >
              <FeatureCard
                title={skill.title}
                icon={skill.icon}
                description={
                  <div>
                    <p className="mb-3">{skill.description}</p>
                    <ul className="space-y-2">
                      {skill.bulletPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                }
                className="h-full"
                hoverEffect={true}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsTechnologies;
