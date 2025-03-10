
import React from 'react';

export const getPersonStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "AI Automation Expert",
    "jobTitle": "AI Automation Consultant",
    "description": "Based in Oslo, Norway, with over 10 years of experience in business automation and AI integration, I help companies streamline operations, reduce costs, and scale efficiently.",
    "knowsAbout": ["Artificial Intelligence", "Machine Learning", "Business Process Automation", "Natural Language Processing", "Data Analytics"],
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Oslo",
        "addressCountry": "Norway"
      }
    }
  };
};

export default getPersonStructuredData;
