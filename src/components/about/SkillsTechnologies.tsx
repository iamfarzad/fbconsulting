
import React from 'react';
import AnimatedText from '@/components/AnimatedText';

const SKILLS = [
  "Machine Learning", 
  "Natural Language Processing", 
  "Workflow Automation", 
  "Process Optimization", 
  "Chatbot Development", 
  "Data Analysis", 
  "Systems Integration", 
  "Cloud Solutions", 
  "Virtual Assistants", 
  "RPA", 
  "API Development", 
  "Business Intelligence"
];

const SkillsTechnologies = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <AnimatedText text="Skills & Technologies" tag="h2" className="text-3xl font-bold mb-8 text-center" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {SKILLS.map((skill, index) => (
            <div 
              key={skill} 
              className="bg-primary/10 rounded-lg px-4 py-3 text-center opacity-0 animate-fade-in-up" 
              style={{
                animationDelay: `${200 + index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsTechnologies;
