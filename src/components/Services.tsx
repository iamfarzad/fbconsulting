
import React, { useEffect, useRef } from 'react';
import FeatureCard from './FeatureCard';
import AnimatedText from './AnimatedText';
import { 
  Brain, 
  MessageSquare, 
  Workflow, 
  BarChart3, 
  Code 
} from 'lucide-react';

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('.feature-card');
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('animate-fade-in-up');
                child.classList.remove('opacity-0');
              }, 100 * index);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="AI Services for Business"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AnimatedText
            text="Transform your operations with intelligent automation"
            tag="p"
            delay={200}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          />
        </div>

        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="feature-card opacity-0">
            <FeatureCard
              title="AI Strategy & Consulting"
              description="Get a roadmap for AI-driven automation in your business with personalized recommendations and implementation plans."
              icon={<Brain className="w-6 h-6" />}
            />
          </div>
          
          <div className="feature-card opacity-0">
            <FeatureCard
              title="Chatbots & Virtual Assistants"
              description="Automate customer support and internal operations with intelligent AI assistants that understand and respond to natural language."
              icon={<MessageSquare className="w-6 h-6" />}
            />
          </div>
          
          <div className="feature-card opacity-0">
            <FeatureCard
              title="Workflow Automation"
              description="Connect apps, automate tasks, and eliminate manual work with custom automation solutions tailored to your business needs."
              icon={<Workflow className="w-6 h-6" />}
            />
          </div>
          
          <div className="feature-card opacity-0">
            <FeatureCard
              title="AI Data Insights"
              description="Leverage AI to analyze your business data and make smarter decisions with automated reporting and predictive analytics."
              icon={<BarChart3 className="w-6 h-6" />}
            />
          </div>
          
          <div className="feature-card opacity-0">
            <FeatureCard
              title="Custom AI Development"
              description="Build tailored AI solutions for your specific business challenges with custom development and integration services."
              icon={<Code className="w-6 h-6" />}
            />
          </div>
          
          <div className="feature-card opacity-0">
            <FeatureCard
              className="flex flex-col justify-center items-center text-center border-dashed"
              title="Not sure what you need?"
              description="Book a free consultation to discuss your unique business challenges and find the right AI solution."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
