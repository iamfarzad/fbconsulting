
import React from 'react';
import ServiceDetail from '@/components/ServiceDetail';

interface ServiceSectionProps {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  imagePosition: 'left' | 'right';
  imageSrc: string;
  altText: string;
  callToAction: string;
}

const ServiceSection: React.FC<ServiceSectionProps> = ({
  id,
  title,
  description,
  benefits,
  icon,
  imagePosition,
  imageSrc,
  altText,
  callToAction
}) => {
  return (
    <div id={id} className="scroll-mt-32">
      <ServiceDetail
        title={title}
        description={description}
        benefits={benefits}
        icon={icon}
        imagePosition={imagePosition}
        imageSrc={imageSrc}
        altText={altText}
        callToAction={callToAction}
      />
    </div>
  );
};

export default ServiceSection;
