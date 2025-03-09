
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import AnimatedText from './AnimatedText';
import { cn } from '@/lib/utils';

interface ServiceDetailProps {
  title: string;
  description: string;
  benefits: string[];
  icon?: React.ReactNode;
  imagePosition: 'left' | 'right';
  imageSrc: string;
  altText: string;
  callToAction: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  title,
  description,
  benefits,
  icon,
  imagePosition,
  imageSrc,
  altText,
  callToAction,
}) => {
  const isImageRight = imagePosition === 'right';

  return (
    <div className="py-12 border-b border-border last:border-0">
      <div className={cn(
        "flex flex-col gap-8",
        isImageRight ? "md:flex-row" : "md:flex-row-reverse"
      )}>
        <div className="flex-1">
          <div className="mb-6">
            {icon && (
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-primary rounded-full bg-primary/10">
                {icon}
              </div>
            )}
            <AnimatedText
              text={title}
              tag="h2"
              className="text-2xl md:text-3xl font-bold mb-3"
            />
            <AnimatedText
              text={description}
              tag="p"
              delay={200}
              className="text-lg text-muted-foreground"
            />
          </div>
          
          <div className="space-y-3 mb-6">
            <AnimatedText
              text="Key Benefits"
              tag="h3"
              delay={300}
              className="text-xl font-semibold"
            />
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: `${400 + (index * 100)}ms` }}>
                  <Check className="min-w-5 h-5 text-primary mt-1" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            size="lg" 
            className="mt-4 opacity-0 animate-fade-in-up" 
            style={{ animationDelay: `${400 + (benefits.length * 100)}ms` }}
          >
            {callToAction}
          </Button>
        </div>
        
        <div className="flex-1 opacity-0 animate-fade-in-up" style={{ animationDelay: `200ms` }}>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={imageSrc} 
              alt={altText} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
