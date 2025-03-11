
import React from 'react';
import ServiceSection from './ServiceSection';
import PageHeader from '@/components/PageHeader';
import { Bot, MessageSquare, Workflow, BarChart3, Code } from 'lucide-react';
import DotPattern from '@/components/ui/dot-pattern';

const ServicesContent: React.FC = () => {
  return (
    <main className="flex-grow pt-12 pb-12 relative">
      <DotPattern width={16} height={16} cx={8} cy={8} cr={1.5} className="opacity-20" />
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <PageHeader
          title="My AI Services"
          subtitle="Comprehensive solutions tailored to your business needs"
        />
        
        <div className="mt-16">
          <ServiceSection
            id="ai-strategy"
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
          
          <ServiceSection
            id="chatbots"
            title="Chatbots & Virtual Assistants"
            description="I implement intelligent AI assistants that can handle customer inquiries, support requests, and internal knowledge management."
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
          
          <ServiceSection
            id="workflow"
            title="Workflow Automation"
            description="I connect your applications and systems to eliminate manual data entry, reduce errors, and streamline operations."
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
          
          <ServiceSection
            id="data-insights"
            title="AI Data Insights"
            description="I transform your raw business data into actionable intelligence through automated analysis and reporting."
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
          
          <ServiceSection
            id="custom-development"
            title="Custom AI Development"
            description="I create tailored solutions for your unique business challenges using cutting-edge AI technologies."
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
  );
};

export default ServicesContent;
