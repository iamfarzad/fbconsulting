
import React from 'react';
import AnimatedText from '../AnimatedText';

interface TitleSectionProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="mb-6">
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-teal/10">
          <div className="text-teal">{icon}</div>
        </div>
      )}
      <AnimatedText
        text={title}
        tag="h2"
        className="text-2xl md:text-3xl font-bold mb-3 text-gradient-teal font-futuristic"
      />
      <AnimatedText
        text={description}
        tag="p"
        delay={200}
        className="text-lg text-muted-foreground"
      />
    </div>
  );
};

export default TitleSection;
