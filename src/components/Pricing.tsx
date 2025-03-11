
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import AnimatedText from './AnimatedText';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';

const pricingData = [
  {
    title: "Strategy Session",
    price: "499",
    description: "One-time consultation",
    features: [
      "AI opportunity assessment",
      "ROI calculation & recommendations",
      "90-minute virtual consultation"
    ],
    popular: false,
    callToAction: "Book a Session"
  },
  {
    title: "Implementation Package",
    price: "2,499",
    description: "AI solution development",
    features: [
      "AI solution development",
      "Full system integration & testing",
      "Staff training + 30 days support"
    ],
    popular: true,
    callToAction: "Get Started"
  },
  {
    title: "Enterprise Partnership",
    price: "Custom",
    description: "Dedicated AI automation support",
    features: [
      "Multiple automation projects",
      "Dedicated AI automation support",
      "Priority development & maintenance"
    ],
    popular: false,
    callToAction: "Contact for Quote"
  }
];

const Pricing = () => {
  const navigate = useNavigate();
  
  const handlePricingCTA = (plan: string, cta: string) => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'pricing_cta',
      plan_name: plan,
      cta_text: cta
    });
    
    navigate('/contact');
  };
  
  return (
    <section id="pricing" className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="Pricing & Engagement Plans"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AnimatedText
            text="Transparent pricing to fit your AI automation needs"
            tag="p"
            delay={200}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingData.map((plan, index) => (
            <Card key={index} className={`flex flex-col h-full ${plan.popular ? 'border-primary shadow-lg relative' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-full">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {plan.title}
                </CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">
                    {plan.price.startsWith("Custom") ? "" : "$"}
                    {plan.price}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 mt-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePricingCTA(plan.title, plan.callToAction)}
                >
                  {plan.callToAction}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => handlePricingCTA("Custom", "Request Custom Quote")}
          >
            Request Custom Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
