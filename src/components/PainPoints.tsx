
import React from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedText from './AnimatedText';
import { TiltedScroll, TiltedScrollItem } from './ui/tilted-scroll';

const PainPoints = () => {
  const painPoints: TiltedScrollItem[] = [
    { id: "1", text: "Wasting hours on repetitive tasks" },
    { id: "2", text: "Struggling to scale operations efficiently" },
    { id: "3", text: "Drowning in manual processes" },
    { id: "4", text: "Missing insights from your data" },
    { id: "5", text: "Dealing with communication silos" },
    { id: "6", text: "Losing track of leads and opportunities" },
  ];

  const solutions = [
    {
      title: "Automate routine workflows",
      description: "Free up 20+ hours per week with intelligent automation for repetitive tasks and processes."
    },
    {
      title: "Scale without proportional cost",
      description: "Handle increased volume without adding staff by implementing AI-powered operations."
    },
    {
      title: "Improve customer experiences",
      description: "Reduce response times by up to 80% with AI chatbots and automated service systems."
    },
    {
      title: "Unlock data-driven insights",
      description: "Make better decisions with automated analysis and AI-powered business intelligence."
    }
  ];

  return (
    <section className="py-20 px-4 bg-secondary/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="Is This You?"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AnimatedText
            text="Common business challenges that AI automation can solve"
            tag="p"
            delay={200}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Pain Points - TiltedScroll */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Business Challenges</h3>
            <TiltedScroll items={painPoints} />
          </div>
          
          {/* Solutions */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">AI Automation Solutions</h3>
            
            {solutions.map((solution, index) => (
              <div 
                key={index}
                className="solution opacity-0 animate-fade-in-up flex items-start gap-4 p-4 rounded-lg border border-border bg-white/80 shadow-subtle"
                style={{ animationDelay: `${150 * index}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Check size={18} />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">{solution.title}</h4>
                  <p className="text-muted-foreground">{solution.description}</p>
                </div>
              </div>
            ))}
            
            <div className="mt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
              <Button size="lg" className="rounded-full px-8 w-full sm:w-auto">
                Get a Free AI Audit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
