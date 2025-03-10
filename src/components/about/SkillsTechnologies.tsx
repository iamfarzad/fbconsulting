
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import { cn } from "@/lib/utils";
import { AnimatedCard } from '@/components/ui/animated-card';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  Cloud,
  Workflow,
  MessagesSquare,
  Network,
  Database,
  OpenAI,
  Copilot,
  GeminiIcon,
  Braces,
  LineChart
} from "lucide-react";

// Skills data organized in the new format
const SKILLS_DATA = [
  {
    title: "OpenAI Fine-Tuning",
    description: "Trained custom GPT models for specialized business applications.",
    icon: <Sparkles className="w-6 h-6" />,
    category: "AI & Machine Learning"
  },
  {
    title: "ChatGPT Custom Model Training",
    description: "Developed tailored AI assistants with domain-specific expertise for businesses.",
    icon: <BrainCircuit className="w-6 h-6" />,
    category: "AI & Machine Learning"
  },
  {
    title: "Synthetic Data Generation",
    description: "Created privacy-first datasets to improve AI model performance and generalization.",
    icon: <Database className="w-6 h-6" />,
    category: "AI & Machine Learning"
  },
  {
    title: "Machine Learning & Predictive Analytics",
    description: "Built AI-driven insights platforms for automation and decision-making.",
    icon: <BrainCircuit className="w-6 h-6" />,
    category: "AI & Machine Learning"
  },
  {
    title: "Natural Language Processing",
    description: "Integrated LLMs into chatbots, AI-driven customer support, and mental health solutions.",
    icon: <MessagesSquare className="w-6 h-6" />,
    category: "AI & Machine Learning"
  },
  {
    title: "Knowledge Graphs & AI Reasoning",
    description: "Designed graph-based AI models for better data relationships and AI decision-making.",
    icon: <Network className="w-6 h-6" />,
    category: "AI & Machine Learning"
  },
  {
    title: "Microsoft Azure AI Foundry",
    description: "Built and deployed scalable AI models using Microsoft's enterprise AI tools.",
    icon: <Cloud className="w-6 h-6" />,
    category: "AI-Powered Business Automation"
  },
  {
    title: "Azure OpenAI Services",
    description: "Integrated OpenAI's GPT models into business workflows via Azure's AI stack.",
    icon: <Cloud className="w-6 h-6" />,
    category: "AI-Powered Business Automation"
  },
  {
    title: "Copilot Integration",
    description: "Developed AI-powered automation assistants for enterprise productivity.",
    icon: <Bot className="w-6 h-6" />,
    category: "AI-Powered Business Automation"
  },
  {
    title: "Workflow Automation",
    description: "Eliminated manual workflows in mental health, content creation, and video production with AI.",
    icon: <Workflow className="w-6 h-6" />,
    category: "AI-Powered Business Automation"
  },
  {
    title: "AI-Driven Data Augmentation",
    description: "Used synthetic data and AI models to train more accurate predictive systems.",
    icon: <Database className="w-6 h-6" />,
    category: "AI-Powered Business Automation"
  },
  {
    title: "Conversational AI",
    description: "Developed AI chatbots for mental wellness, business automation, and customer service.",
    icon: <MessagesSquare className="w-6 h-6" />,
    category: "Chatbots & AI Assistants"
  },
  {
    title: "Virtual Assistants & AI Copilots",
    description: "Built AI-powered productivity tools using ChatGPT & Microsoft Copilot.",
    icon: <Bot className="w-6 h-6" />,
    category: "Chatbots & AI Assistants"
  },
  {
    title: "LLM Prompt Engineering",
    description: "Optimized GPT-based assistants for maximum accuracy and efficiency.",
    icon: <Sparkles className="w-6 h-6" />,
    category: "Chatbots & AI Assistants"
  },
  {
    title: "Microsoft Azure & Cloud AI Solutions",
    description: "Deployed scalable AI applications on Azure & AWS for enterprise clients.",
    icon: <Cloud className="w-6 h-6" />,
    category: "Data, Cloud & Systems Integration"
  },
  {
    title: "Systems Integration & API Development",
    description: "Connected AI models to databases, cloud services, and automation tools.",
    icon: <Network className="w-6 h-6" />,
    category: "Data, Cloud & Systems Integration"
  },
  {
    title: "Business Intelligence & Data Analytics",
    description: "Designed AI-driven dashboards and decision-making tools for businesses.",
    icon: <LineChart className="w-6 h-6" />,
    category: "Data, Cloud & Systems Integration"
  },
  {
    title: "Edge AI & Hybrid AI Models",
    description: "Worked with on-premise AI + cloud AI integrations for fast, secure processing.",
    icon: <Braces className="w-6 h-6" />,
    category: "Data, Cloud & Systems Integration"
  },
];

const FeatureSkill = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4 || index === 8) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800",
        (index >= 4 && index < 8) && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 8 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      )}
      {index >= 8 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-6 text-primary">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-6">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-muted group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-6">
        {description}
      </p>
    </div>
  );
};

// Group skills by category
const groupedSkills = SKILLS_DATA.reduce((acc, skill) => {
  if (!acc[skill.category]) {
    acc[skill.category] = [];
  }
  acc[skill.category].push(skill);
  return acc;
}, {} as Record<string, typeof SKILLS_DATA>);

const SkillsTechnologies = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <AnimatedText 
          text="Skills & Technologies" 
          tag="h2" 
          className="text-3xl font-bold mb-8 text-center"
        />
        
        <div className="mb-16">
          <AnimatedCard
            className="mb-10"
            title="AI Technologies I Work With"
            description="I leverage the latest AI models and platforms to deliver cutting-edge solutions for businesses"
            icons={[
              {
                icon: <OpenAI className="h-8 w-8 dark:text-white" />,
                size: "lg",
              },
              {
                icon: <Copilot className="h-6 w-6 dark:text-white" />,
                size: "md",
              },
              {
                icon: <GeminiIcon className="h-4 w-4" />,
                size: "sm",
              },
              {
                icon: <BrainCircuit className="h-6 w-6" />,
                size: "md",
              },
              {
                icon: <Sparkles className="h-4 w-4" />,
                size: "sm",
              },
            ]}
          />
        </div>
        
        {Object.entries(groupedSkills).map(([category, skills], categoryIndex) => (
          <div key={category} className="mb-16">
            <h3 className="text-xl font-semibold mb-6">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10">
              {skills.map((skill, index) => (
                <FeatureSkill 
                  key={skill.title} 
                  title={skill.title} 
                  description={skill.description} 
                  icon={skill.icon} 
                  index={index + (categoryIndex * 4)} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsTechnologies;
