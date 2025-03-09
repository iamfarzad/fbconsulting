
import React, { useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedText from './AnimatedText';

const PainPoints = () => {
  const painPointsRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    };

    const painPointsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.pain-point');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate-fade-in-up');
              item.classList.remove('opacity-0');
            }, 150 * index);
          });
        }
      });
    }, observerOptions);

    const solutionsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.solution');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate-fade-in-up');
              item.classList.remove('opacity-0');
            }, 150 * index);
          });
        }
      });
    }, observerOptions);

    if (painPointsRef.current) {
      painPointsObserver.observe(painPointsRef.current);
    }

    if (solutionsRef.current) {
      solutionsObserver.observe(solutionsRef.current);
    }

    return () => {
      if (painPointsRef.current) {
        painPointsObserver.unobserve(painPointsRef.current);
      }
      if (solutionsRef.current) {
        solutionsObserver.unobserve(solutionsRef.current);
      }
    };
  }, []);

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
          {/* Pain Points */}
          <div ref={painPointsRef} className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Business Challenges</h3>
            
            <div className="pain-point opacity-0 flex items-start gap-4 p-4 rounded-lg border border-border">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <X size={18} />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Wasting hours on repetitive tasks</h4>
                <p className="text-muted-foreground">Manual data entry, report generation, and routine communications that drain resources.</p>
              </div>
            </div>
            
            <div className="pain-point opacity-0 flex items-start gap-4 p-4 rounded-lg border border-border">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <X size={18} />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Struggling to scale operations efficiently</h4>
                <p className="text-muted-foreground">Growth that demands more staff instead of smarter systems, leading to increased costs.</p>
              </div>
            </div>
            
            <div className="pain-point opacity-0 flex items-start gap-4 p-4 rounded-lg border border-border">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <X size={18} />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Drowning in manual processes</h4>
                <p className="text-muted-foreground">Workflow bottlenecks causing delays, errors, and customer dissatisfaction.</p>
              </div>
            </div>
            
            <div className="pain-point opacity-0 flex items-start gap-4 p-4 rounded-lg border border-border">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <X size={18} />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Missing insights from your data</h4>
                <p className="text-muted-foreground">Valuable business intelligence that remains locked in unprocessed information.</p>
              </div>
            </div>
          </div>
          
          {/* Solutions */}
          <div ref={solutionsRef} className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">AI Automation Solutions</h3>
            
            <div className="solution opacity-0 flex items-start gap-4 p-4 rounded-lg border border-border bg-white/80 shadow-subtle">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check size={18} />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Automate routine workflows</h4>
                <p className="text-muted-foreground">Free up 20+ hours per week with intelligent automation for repetitive tasks and processes.</p>
              </div>
            </div>
            
            <div className="solution opacity-0 flex items-start gap-4 p-4 rounded-lg border border-border bg-white/80 shadow-subtle">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check size={18} />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Scale without proportional cost</h4>
                <p className="text-muted-foreground">Handle increased volume without adding staff by implementing AI-powered operations.</p>
              </div>
            </div>
            
            <div className="solution opacity-0 flex items-start gap-4 p-4 rounded-lg border border-border bg-white/80 shadow-subtle">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check size={18} />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Improve customer experiences</h4>
                <p className="text-muted-foreground">Reduce response times by up to 80% with AI chatbots and automated service systems.</p>
              </div>
            </div>
            
            <div className="solution opacity-0 flex items-start gap-4 p-4 rounded-lg border border-border bg-white/80 shadow-subtle">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check size={18} />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Unlock data-driven insights</h4>
                <p className="text-muted-foreground">Make better decisions with automated analysis and AI-powered business intelligence.</p>
              </div>
            </div>
            
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
