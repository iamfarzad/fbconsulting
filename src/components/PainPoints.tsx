
import React from 'react';
import { Check } from 'lucide-react';
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

  const solutions: TiltedScrollItem[] = [
    { id: "1", text: "Automate routine workflows - Free up 20+ hours per week" },
    { id: "2", text: "Scale without proportional cost with AI-powered operations" },
    { id: "3", text: "Reduce response times by up to 80% with AI chatbots" },
    { id: "4", text: "Make better decisions with AI-powered business intelligence" },
    { id: "5", text: "Streamline communication with automated systems" },
    { id: "6", text: "Never miss a lead with AI-driven opportunity tracking" },
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
          {/* Pain Points Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Business Challenges</h3>
            <TiltedScroll items={painPoints} />
          </div>
          
          {/* Solutions Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">AI Automation Solutions</h3>
            <TiltedScroll items={solutions} />
            
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
