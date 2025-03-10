
import React from 'react';

interface ServiceImageProps {
  imageSrc: string;
  altText: string;
}

const ServiceImage: React.FC<ServiceImageProps> = ({ imageSrc, altText }) => {
  return (
    <div className="flex-1 opacity-0 animate-fade-in-up" style={{ animationDelay: `200ms` }}>
      <div className="aspect-video rounded-2xl overflow-hidden shadow-lg tech-card">
        <img 
          src={imageSrc} 
          alt={altText} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        />
      </div>
    </div>
  );
};

export default ServiceImage;
