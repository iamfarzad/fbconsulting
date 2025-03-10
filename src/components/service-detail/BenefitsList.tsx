
import React from 'react';
import { Check } from 'lucide-react';
import AnimatedText from '../AnimatedText';

interface BenefitsListProps {
  benefits: string[];
}

const BenefitsList: React.FC<BenefitsListProps> = ({ benefits }) => {
  return (
    <div className="space-y-3 mb-6">
      <AnimatedText
        text="Key Benefits"
        tag="h3"
        delay={300}
        className="text-xl font-semibold text-teal"
      />
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: `${400 + (index * 100)}ms` }}>
            <Check className="min-w-5 h-5 text-teal mt-1" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BenefitsList;
