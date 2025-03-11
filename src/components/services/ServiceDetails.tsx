
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';

const ServiceDetails = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      id: "strategy",
      number: "1",
      title: "AI Strategy & Consulting",
      description: "Develop a clear AI roadmap with actionable steps and ROI projections.",
      benefits: [
        "AI automation opportunity assessment",
        "Custom AI integration roadmap",
        "ROI-driven implementation plan",
        "Technology recommendations"
      ],
      cta: "Book a Strategy Session"
    },
    {
      id: "chatbots",
      number: "2",
      title: "Chatbots & Virtual Assistants",
      description: "Automate customer service, sales, and internal operations with AI-driven assistants.",
      benefits: [
        "24/7 customer support automation",
        "Personalized AI-driven interactions",
        "Seamless human-agent handoff",
        "CRM and system integration"
      ],
      cta: "Explore Chatbot Solutions"
    },
    {
      id: "workflow",
      number: "3",
      title: "Workflow Automation",
      description: "Eliminate manual work and streamline operations with AI-driven workflows.",
      benefits: [
        "End-to-end process automation",
        "Eliminate manual data entry",
        "Reduce errors & improve quality",
        "Free up employee time for high-value tasks"
      ],
      cta: "Streamline Your Workflow"
    },
    {
      id: "data",
      number: "4",
      title: "AI-Powered Data Insights",
      description: "Leverage AI to turn raw data into business intelligence.",
      benefits: [
        "Automated data collection & reporting",
        "Real-time analytics dashboards",
        "Predictive trend analysis",
        "Customer behavior insights"
      ],
      cta: "Unlock Your Data Potential"
    },
    {
      id: "custom",
      number: "5",
      title: "Custom AI Development",
      description: "Bespoke AI solutions tailored to your business challenges.",
      benefits: [
        "Proprietary AI algorithms",
        "AI model fine-tuning for domain-specific applications",
        "Integration with existing systems",
        "Scalable AI architecture"
      ],
      cta: "Discuss Your Custom Needs"
    }
  ];

  const handleCTA = (serviceTitle: string, ctaText: string) => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'service_detail_cta',
      service_name: serviceTitle,
      cta_text: ctaText
    });
    
    navigate('/contact');
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            id={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 pb-16 border-b border-gray-200 dark:border-gray-800 last:border-none last:mb-0 last:pb-0"
          >
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-futuristic flex items-center">
                <span className="text-teal">{service.number}. </span>
                <span className="ml-2 text-gradient-teal">{service.title}</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                <span className="text-teal">📌</span> {service.description}
              </p>
            </div>
            
            <div className="mb-8">
              <ul className="space-y-3">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-teal mt-1">🔹</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={() => handleCTA(service.title, service.cta)}
              className="px-6 py-2 rounded-full flex items-center gap-2"
            >
              <Calendar size={18} />
              {service.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServiceDetails;
