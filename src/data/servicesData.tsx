
import React from 'react';
import { 
  Brain, 
  MessageSquare, 
  Workflow, 
  BarChart3, 
  Code,
  Sparkles
} from 'lucide-react';
import StrategyAnimation from '@/components/bento/animations/StrategyAnimation';
import ChatbotAnimation from '@/components/bento/animations/ChatbotAnimation';
import WorkflowAnimation from '@/components/bento/animations/WorkflowAnimation';
import DataInsightsAnimation from '@/components/bento/animations/DataInsightsAnimation';
import CustomDevAnimation from '@/components/bento/animations/CustomDevAnimation';
import ConsultationAnimation from '@/components/bento/animations/ConsultationAnimation';

export const services = [
  {
    title: "AI Strategy & Consulting",
    description: "Get a roadmap for AI-driven automation in your business with personalized recommendations.",
    icon: <Brain className="w-6 h-6" />,
    hoverAnimation: <StrategyAnimation />
  },
  {
    title: "Chatbots & Virtual Assistants",
    description: "Automate customer support and internal operations with intelligent AI assistants.",
    icon: <MessageSquare className="w-6 h-6" />,
    hoverAnimation: <ChatbotAnimation />
  },
  {
    title: "Workflow Automation",
    description: "I connect apps, automate tasks, and eliminate manual work with custom automation solutions.",
    icon: <Workflow className="w-6 h-6" />,
    hoverAnimation: <WorkflowAnimation />
  },
  {
    title: "AI Data Insights",
    description: "I leverage AI to analyze your business data and make smarter decisions with automated reporting.",
    icon: <BarChart3 className="w-6 h-6" />,
    hoverAnimation: <DataInsightsAnimation />
  },
  {
    title: "Custom AI Development",
    description: "I build tailored AI solutions for your specific business challenges with custom development.",
    icon: <Code className="w-6 h-6" />,
    hoverAnimation: <CustomDevAnimation />
  },
  {
    title: "Not sure what you need?",
    description: "Book a free consultation to discuss your unique business challenges and find the right AI solution.",
    icon: <Sparkles className="w-6 h-6" />,
    className: "border-dashed",
    hoverAnimation: <ConsultationAnimation />
  }
];
