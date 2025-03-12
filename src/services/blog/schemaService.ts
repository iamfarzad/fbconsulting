
// Schema generators for structured data

/**
 * Generates structured data for the home page
 * @param isNorwegian Whether the content is in Norwegian
 * @returns Structured data object for the home page
 */
export const getHomePageStructuredData = (isNorwegian: boolean) => {
  const title = isNorwegian 
    ? "AI Automatisering for Norske Bedrifter" 
    : "AI Automation Consulting Services";
    
  const description = isNorwegian
    ? "Profesjonelle AI-automatiseringstjenester for norske bedrifter. Reduser kostnader, optimaliser arbeidsflyt og skaler med AI."
    : "Professional AI automation services for businesses. Reduce costs, optimize workflows, and scale with AI.";
    
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["header", "article"]
    },
    "mainEntity": {
      "@type": "Service",
      "name": isNorwegian ? "AI Automatiseringstjenester" : "AI Automation Services",
      "offers": {
        "@type": "Offer",
        "description": isNorwegian 
          ? "Profesjonell AI-konsultasjon og automatiseringstjenester" 
          : "Professional AI consulting and automation services",
        "price": "0",
        "priceCurrency": isNorwegian ? "NOK" : "USD",
        "availability": "https://schema.org/InStock",
        "url": window.location.origin + "/contact",
        "validFrom": "2023-01-01",
        "priceValidUntil": "2025-12-31"
      },
      "serviceType": [
        isNorwegian ? "AI-strategi" : "AI Strategy",
        isNorwegian ? "Arbeidsflytautomatisering" : "Workflow Automation",
        isNorwegian ? "Chatbots" : "Chatbots",
        isNorwegian ? "Virtuell Assistent" : "Virtual Assistant",
        isNorwegian ? "Tilpasset AI-utvikling" : "Custom AI Development"
      ],
      "termsOfService": window.location.origin + "/terms",
      "provider": {
        "@type": "ProfessionalService",
        "name": "F.B Consulting",
        "url": window.location.origin
      }
    },
    "potentialAction": {
      "@type": "ScheduleAction",
      "target": window.location.origin + "/contact",
      "actionStatus": "https://schema.org/PotentialActionStatus",
      "name": isNorwegian ? "Book en gratis konsultasjon" : "Book a Free Consultation",
      "startTime": "2023-01-01T00:00",
      "endTime": "2025-12-31T23:59"
    }
  };
};

/**
 * Generates structured data for services
 * @param isNorwegian Whether the content is in Norwegian
 * @returns Array of structured data objects for services
 */
export const getServicesStructuredData = (isNorwegian: boolean) => {
  const services = [
    {
      name: isNorwegian ? "AI-strategi og konsultasjon" : "AI Strategy & Consulting",
      description: isNorwegian 
        ? "Få en skreddersydd veikart for å integrere AI i dine forretningsprosesser, med klare implementeringstrinn og ROI-prognoser."
        : "Get a customized roadmap for integrating AI into your business operations, with clear implementation steps and ROI projections.",
      url: "/services#ai-strategy"
    },
    {
      name: isNorwegian ? "Chatbots og virtuelle assistenter" : "Chatbots & Virtual Assistants",
      description: isNorwegian
        ? "Implementer intelligente AI-assistenter som kan håndtere kundeforespørsler, støttehenvendelser og intern kunnskapshåndtering."
        : "Implement intelligent AI assistants that can handle customer inquiries, support requests, and internal knowledge management.",
      url: "/services#chatbots"
    },
    {
      name: isNorwegian ? "Arbeidsflytautomatisering" : "Workflow Automation",
      description: isNorwegian
        ? "Koble sammen dine applikasjoner og systemer for å eliminere manuell dataregistrering, redusere feil og effektivisere driften."
        : "Connect your applications and systems to eliminate manual data entry, reduce errors, and streamline operations.",
      url: "/services#workflow-automation"
    },
    {
      name: isNorwegian ? "AI-datainnsikt" : "AI Data Insights",
      description: isNorwegian
        ? "Transformer rådata til handlingsintelligens gjennom automatisert analyse og rapportering."
        : "Transform your raw business data into actionable intelligence through automated analysis and reporting.",
      url: "/services#data-insights"
    },
    {
      name: isNorwegian ? "Tilpasset AI-utvikling" : "Custom AI Development",
      description: isNorwegian
        ? "Skreddersydde løsninger for dine unike forretningsutfordringer ved hjelp av banebrytende AI-teknologier."
        : "Tailored solutions for your unique business challenges using cutting-edge AI technologies.",
      url: "/services#custom-development"
    }
  ];

  return services.map((service, index) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "position": index + 1,
    "name": service.name,
    "description": service.description,
    "url": window.location.origin + service.url,
    "provider": {
      "@type": "ProfessionalService",
      "name": "F.B Consulting",
      "url": window.location.origin
    }
  }));
};

/**
 * Generates structured data for FAQs
 * @param faqItems Array of FAQ items with questions and answers
 * @returns Structured data object for FAQs
 */
export const getFAQStructuredData = (faqItems: Array<{id: string, question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
};
