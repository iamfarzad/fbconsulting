
import React from 'react';
import { Shield, Zap, Target } from 'lucide-react';
import FeatureCard from './FeatureCard';
import AnimatedText from './AnimatedText';

const WhyWorkWithMe = () => {
  return (
    <section id="why-me" className="py-20 px-4 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="Why Work With Me"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <FeatureCard
              title="Proven AI Expertise"
              description="Years of experience in AI automation and business transformation with a track record of successful implementations."
              icon={<Shield className="w-6 h-6" />}
              className="h-full"
              glassmorphism={false}
            />
          </div>
          
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            <FeatureCard
              title="Custom Solutions"
              description="No generic advice—every automation strategy is tailored to your specific business needs, processes, and goals."
              icon={<Zap className="w-6 h-6" />}
              className="h-full"
              glassmorphism={false}
            />
          </div>
          
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
            <FeatureCard
              title="ROI-Driven Approach"
              description="I focus on automation that delivers measurable returns, whether through time savings, cost reduction, or revenue growth."
              icon={<Target className="w-6 h-6" />}
              className="h-full"
              glassmorphism={false}
            />
          </div>
        </div>
        
        <div className="mt-16 px-4 py-8 rounded-xl bg-gradient-to-br from-deep-purple/5 to-teal/5 text-center max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
          <p className="text-xl font-medium mb-2">
            "AI is no longer a luxury—it's a competitive advantage."
          </p>
          <p className="text-muted-foreground">
            Let me put it to work for your business.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithMe;
