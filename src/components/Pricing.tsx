
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import AnimatedText from './AnimatedText';

const pricingData = [
  {
    title: "Strategy Session",
    price: "499",
    description: "One-time consultation to identify AI automation opportunities",
    features: [
      "Business process assessment",
      "AI opportunity identification",
      "ROI calculation",
      "Implementation recommendations",
      "90-minute virtual session"
    ],
    popular: false,
    callToAction: "Book a Session"
  },
  {
    title: "Implementation Package",
    price: "2,499",
    description: "Custom AI solution implementation for a specific business process",
    features: [
      "Full solution development",
      "System integration",
      "Testing and validation",
      "Staff training",
      "30 days of support"
    ],
    popular: true,
    callToAction: "Get Started"
  },
  {
    title: "Enterprise Partnership",
    price: "Custom",
    description: "Ongoing AI automation support for enterprise clients",
    features: [
      "Multiple automation projects",
      "Dedicated support team",
      "Quarterly strategy sessions",
      "Custom development",
      "Priority maintenance"
    ],
    popular: false,
    callToAction: "Contact for Quote"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="Transparent Pricing"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AnimatedText
            text="Choose the right plan for your business automation needs"
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
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">
                    {plan.price.startsWith("Custom") ? "" : "$"}
                    {plan.price}
                  </span>
                  {!plan.price.startsWith("Custom") && (
                    <span className="ml-1 text-sm text-muted-foreground">
                      starting price
                    </span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 mt-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="min-w-5 h-5 text-primary mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.callToAction}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <AnimatedText
            text="Need something more specific?"
            tag="h3"
            className="text-xl font-semibold mb-3"
          />
          <AnimatedText
            text="Contact me for custom pricing tailored to your specific project requirements and business goals."
            tag="p"
            delay={200}
            className="text-muted-foreground mb-6"
          />
          <Button variant="outline" size="lg">
            Request Custom Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
