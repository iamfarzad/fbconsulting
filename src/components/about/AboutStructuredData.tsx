
import React from 'react';

export const getPersonStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "AI Automation Expert",
    "jobTitle": "AI Automation Consultant",
    "description": "Based in Oslo, Norway, with over 10 years of experience in business automation and AI integration, I help companies streamline operations, reduce costs, and scale efficiently.",
    "knowsAbout": [
      "Artificial Intelligence", 
      "Machine Learning", 
      "Business Process Automation", 
      "Natural Language Processing", 
      "Data Analytics",
      "Workflow Optimization",
      "Virtual Assistants",
      "Chatbot Development",
      "AI Strategy",
      "Cost Reduction Through AI"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "AI Automation Consultant",
      "occupationLocation": {
        "@type": "City",
        "name": "Oslo"
      },
      "description": "Providing expert AI automation consulting services to businesses looking to optimize workflows and reduce costs",
      "skills": "AI integration, workflow automation, chatbot development, business process optimization"
    },
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Oslo",
        "addressCountry": "Norway"
      }
    },
    "worksFor": {
      "@type": "Organization",
      "name": "F.B Consulting",
      "url": typeof window !== 'undefined' ? window.location.origin : ''
    }
  };
};

export default getPersonStructuredData;
