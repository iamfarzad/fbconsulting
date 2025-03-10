
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TitleSection from './service-detail/TitleSection';
import BenefitsList from './service-detail/BenefitsList';
import ServiceImage from './service-detail/ServiceImage';

interface ServiceDetailProps {
  title: string;
  description: string;
  benefits: string[];
  icon?: React.ReactNode;
  imagePosition: 'left' | 'right';
  imageSrc: string;
  altText: string;
  callToAction: string;
  onCallToAction?: () => void;
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
  onCallToAction,
}) => {
  const isImageRight = imagePosition === 'right';

  return (
    <div className="py-12 border-b border-white/10 last:border-0">
      <div className={cn(
        "flex flex-col gap-8",
        isImageRight ? "md:flex-row" : "md:flex-row-reverse"
      )}>
        <div className="flex-1">
          <TitleSection 
            title={title} 
            description={description} 
            icon={icon} 
          />
          
          <BenefitsList benefits={benefits} />
          
          <Button 
            size="lg" 
            className="mt-4 opacity-0 animate-fade-in-up neo-button rounded-full" 
            style={{ animationDelay: `${400 + (benefits.length * 100)}ms` }}
            onClick={onCallToAction}
          >
            {callToAction}
          </Button>
        </div>
        
        <ServiceImage imageSrc={imageSrc} altText={altText} />
      </div>
    </div>
  );
};

export default ServiceDetail;
