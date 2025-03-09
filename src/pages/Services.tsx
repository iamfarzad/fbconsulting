
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceDetail from '@/components/ServiceDetail';
import PageHeader from '@/components/PageHeader';
import ContactCTA from '@/components/ContactCTA';
import Testimonials from '@/components/testimonials/Testimonials';
import Pricing from '@/components/Pricing';
import SEO from '@/components/SEO';
import ServicesHero from '@/components/services/ServicesHero';
import DotPattern from '@/components/ui/dot-pattern';
import { Bot, MessageSquare, Workflow, BarChart3, Code } from 'lucide-react';

const Services = () => {
  console.log("Services page rendering");
  
  useEffect(() => {
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);
  
  // Structured data for SEO
  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Service",
        "position": 1,
        "name": "AI Strategy & Consulting",
        "description": "Get a customized roadmap for integrating AI into your business operations, with clear implementation steps and ROI projections.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "AI Automation Ally"
        }
      },
      {
        "@type": "Service",
        "position": 2,
        "name": "Chatbots & Virtual Assistants",
        "description": "Implement intelligent AI assistants that can handle customer inquiries, support requests, and internal knowledge management.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "AI Automation Ally"
        }
      },
      {
        "@type": "Service",
        "position": 3,
        "name": "Workflow Automation",
        "description": "Connect your applications and systems to eliminate manual data entry, reduce errors, and streamline operations.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "AI Automation Ally"
        }
      },
      {
        "@type": "Service",
        "position": 4,
        "name": "AI Data Insights",
        "description": "Transform your raw business data into actionable intelligence through automated analysis and reporting.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "AI Automation Ally"
        }
      },
      {
        "@type": "Service",
        "position": 5,
        "name": "Custom AI Development",
        "description": "Tailored solutions for your unique business challenges using cutting-edge AI technologies.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "AI Automation Ally"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="AI Automation Services | Business Process Optimization"
        description="Explore our specialized AI automation services: strategy consulting, chatbots, workflow automation, data insights, and custom AI development for businesses."
        structuredData={servicesStructuredData}
      />
      
      <Navbar />
      
      <ServicesHero />
      
      <main className="flex-grow pt-12 pb-12 relative">
        <DotPattern width={16} height={16} cx={8} cy={8} cr={1.5} className="opacity-20" />
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <PageHeader
            title="Our AI Services"
            subtitle="Comprehensive solutions tailored to your business needs"
          />
          
          <div className="mt-16">
            <ServiceDetail
              title="AI Strategy & Consulting"
              description="Get a customized roadmap for integrating AI into your business operations, with clear implementation steps and ROI projections."
              benefits={[
                "Complete automation opportunity assessment",
                "Customized AI integration roadmap",
                "ROI analysis and implementation timeline",
                "Technology stack recommendations",
                "Change management guidance"
              ]}
              icon={<Bot />}
              imagePosition="right"
              imageSrc="https://images.unsplash.com/photo-1589254065909-b7086229d08c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              altText="AI Strategy Planning Session"
              callToAction="Book a Strategy Session"
            />
            
            <ServiceDetail
              title="Chatbots & Virtual Assistants"
              description="Implement intelligent AI assistants that can handle customer inquiries, support requests, and internal knowledge management."
              benefits={[
                "24/7 customer support automation",
                "Personalized user experiences",
                "Seamless handoff to human agents when needed",
                "Integration with existing systems",
                "Continuous improvement through learning"
              ]}
              icon={<MessageSquare />}
              imagePosition="left"
              imageSrc="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              altText="AI Chatbot Interface"
              callToAction="Explore Chatbot Solutions"
            />
            
            <ServiceDetail
              title="Workflow Automation"
              description="Connect your applications and systems to eliminate manual data entry, reduce errors, and streamline operations."
              benefits={[
                "End-to-end process automation",
                "Reduced operational costs",
                "Elimination of manual data entry",
                "Error reduction and quality improvement",
                "Employee time freed for high-value work"
              ]}
              icon={<Workflow />}
              imagePosition="right"
              imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              altText="Automated Workflow"
              callToAction="Streamline Your Workflow"
            />
            
            <ServiceDetail
              title="AI Data Insights"
              description="Transform your raw business data into actionable intelligence through automated analysis and reporting."
              benefits={[
                "Automated data collection and processing",
                "Real-time analytics dashboards",
                "Predictive trend analysis",
                "Customer behavior insights",
                "Data-driven decision support"
              ]}
              icon={<BarChart3 />}
              imagePosition="left"
              imageSrc="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              altText="Data Analytics Dashboard"
              callToAction="Unlock Your Data Potential"
            />
            
            <ServiceDetail
              title="Custom AI Development"
              description="Tailored solutions for your unique business challenges using cutting-edge AI technologies."
              benefits={[
                "Custom-built AI solutions",
                "Integration with existing systems",
                "Proprietary algorithms development",
                "Ongoing support and optimization",
                "Scalable architecture for growth"
              ]}
              icon={<Code />}
              imagePosition="right"
              imageSrc="https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              altText="Custom AI Development"
              callToAction="Discuss Your Custom Needs"
            />
          </div>
        </div>
      </main>
      
      <Pricing />
      <Testimonials />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Services;
