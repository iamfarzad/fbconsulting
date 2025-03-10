
import React from 'react';
import AnimatedText from '@/components/AnimatedText';

// Organize skills into categories
const SKILL_CATEGORIES = [
  {
    title: "AI & Machine Learning",
    skills: [
      "OpenAI Fine-Tuning",
      "ChatGPT Custom Model Training",
      "Synthetic Data Generation (Gretel.ai)",
      "Machine Learning & Predictive Analytics",
      "Natural Language Processing (NLP)",
      "Knowledge Graphs & AI Reasoning"
    ]
  },
  {
    title: "AI-Powered Business Automation",
    skills: [
      "Microsoft Azure AI Foundry",
      "Azure OpenAI Services",
      "Copilot (Microsoft 365 AI Integration)",
      "Workflow Automation",
      "AI-Driven Data Augmentation"
    ]
  },
  {
    title: "Chatbots & AI Assistants",
    skills: [
      "Conversational AI",
      "Virtual Assistants & AI Copilots",
      "LLM Prompt Engineering"
    ]
  },
  {
    title: "Data, Cloud & Systems Integration",
    skills: [
      "Microsoft Azure & Cloud AI Solutions",
      "Systems Integration & API Development",
      "Business Intelligence & Data Analytics",
      "Edge AI & Hybrid AI Models"
    ]
  }
];

const SkillsTechnologies = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <AnimatedText text="Skills & Technologies" tag="h2" className="text-3xl font-bold mb-8 text-center" />
        
        <div className="space-y-10">
          {SKILL_CATEGORIES.map((category, categoryIndex) => (
            <div key={category.title} className="space-y-4">
              <h3 
                className="text-xl font-semibold text-foreground opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: `${200 + categoryIndex * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                {category.title}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.skills.map((skill, index) => (
                  <div 
                    key={skill} 
                    className="bg-primary/10 rounded-lg px-4 py-3 text-sm opacity-0 animate-fade-in-up" 
                    style={{
                      animationDelay: `${300 + categoryIndex * 100 + index * 50}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsTechnologies;
