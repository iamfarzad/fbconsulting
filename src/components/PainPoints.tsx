
import React from 'react';
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
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="Is This You?"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          />
          <AnimatedText
            text="Common business challenges that AI automation can solve"
            tag="p"
            delay={200}
            className="text-xl text-foreground/80 max-w-2xl mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Pain Points Section */}
          <div className="space-y-6 bg-white/5 p-8 rounded-xl shadow-lg frosted-glass">
            <h3 className="text-2xl font-semibold mb-6 text-teal">Business Challenges</h3>
            <div className="tilted-scroll-container bg-black/10 p-5 rounded-xl">
              <TiltedScroll items={painPoints} />
            </div>
          </div>
          
          {/* Solutions Section */}
          <div className="space-y-6 bg-white/5 p-8 rounded-xl shadow-lg frosted-glass">
            <h3 className="text-2xl font-semibold mb-6 text-retro-pink">AI Automation Solutions</h3>
            <div className="tilted-scroll-container bg-black/10 p-5 rounded-xl">
              <TiltedScroll items={solutions} />
            </div>
          </div>
        </div>
        
        {/* Centered CTA button */}
        <div className="mt-12 flex justify-center">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <Button size="lg" className="rounded-full px-8 neo-button">
              Get a Free AI Audit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
