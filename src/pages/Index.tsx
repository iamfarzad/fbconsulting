
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import PainPoints from '@/components/PainPoints';
import WhyWorkWithMe from '@/components/WhyWorkWithMe';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';

// For integration with CopilotKit
import { useCopilotAction } from '@copilotkit/react-core';
import { toast } from 'sonner';

const Index = () => {
  // Page transition effect
  useEffect(() => {
    document.body.classList.add('page-enter-active');
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);

  // Setup CopilotKit integration
  useCopilotAction({
    name: "book_consultation",
    description: "Book a free consultation call",
    parameters: [],
    handler: async () => {
      // In a real implementation, this would open a calendar booking interface
      toast.success("Opening calendar to book a consultation");
      return "I'll help you schedule a consultation. Please check your calendar app.";
    },
  });

  useCopilotAction({
    name: "get_service_details",
    description: "Get details about a specific AI automation service",
    parameters: [
      {
        name: "service",
        type: "string",
        description: "The service to get details for",
        required: true,
      },
    ],
    handler: async (params) => {
      const { service } = params;
      
      const serviceDetails = {
        "ai_strategy": "Our AI Strategy & Consulting service provides a comprehensive roadmap for implementing AI automation in your business. We analyze your current processes, identify automation opportunities, and create a detailed implementation plan.",
        "chatbots": "Our Chatbots & Virtual Assistants service builds intelligent AI assistants that can handle customer inquiries, automate support tasks, and streamline internal communications.",
        "workflow": "Our Workflow Automation service connects your applications and systems to eliminate manual data entry, reduce errors, and streamline operations.",
        "data_insights": "Our AI Data Insights service transforms your raw business data into actionable intelligence through automated analysis and reporting.",
        "custom_development": "Our Custom AI Development service builds tailored solutions for your unique business challenges using cutting-edge AI technologies."
      };
      
      return serviceDetails[service as keyof typeof serviceDetails] || "I don't have details about that specific service. Would you like to book a call to discuss your needs?";
    },
  });

  return (
    <div className="min-h-screen page-enter">
      <Navbar />
      <Hero />
      <Services />
      <PainPoints />
      <WhyWorkWithMe />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Index;
