
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceDetail from '@/components/ServiceDetail';
import ContactCTA from '@/components/ContactCTA';
import AnimatedText from '@/components/AnimatedText';
import { Brain, MessageSquare, Workflow, BarChart3, Code } from 'lucide-react';

const Services = () => {
  // Page transition effect
  useEffect(() => {
    document.body.classList.add('page-enter-active');
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);

  return (
    <div className="min-h-screen page-enter">
      <Navbar />
      
      {/* Page Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-background/20">
        <div className="container mx-auto max-w-4xl text-center">
          <AnimatedText
            text="AI Services for Modern Business"
            tag="h1"
            className="text-4xl md:text-5xl font-bold mb-4"
          />
          <AnimatedText
            text="Automation solutions to solve your most pressing business challenges"
            tag="p"
            delay={200}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          />
        </div>
      </section>
      
      {/* Services Details */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <ServiceDetail
            title="AI Strategy & Consulting"
            description="Get a comprehensive roadmap for implementing AI automation in your business. We analyze your current processes, identify automation opportunities, and create a detailed implementation plan."
            benefits={[
              "Process assessment to identify automation opportunities",
              "AI technology selection based on your specific needs",
              "ROI analysis of potential automation solutions",
              "Step-by-step implementation roadmap",
              "Staff training and change management guidance"
            ]}
            icon={<Brain className="w-12 h-12" />}
            imagePosition="right"
            imageSrc="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80"
            altText="AI Strategy Consultation"
            callToAction="Book a Strategy Session"
          />
          
          <ServiceDetail
            title="Chatbots & Virtual Assistants"
            description="Build intelligent AI assistants that can handle customer inquiries, automate support tasks, and streamline internal communications."
            benefits={[
              "24/7 customer support automation",
              "Reduced response times and increased satisfaction",
              "Internal knowledge base integration",
              "Multi-channel deployment (website, messaging apps, social media)",
              "Continuous learning and improvement based on interactions"
            ]}
            icon={<MessageSquare className="w-12 h-12" />}
            imagePosition="left"
            imageSrc="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
            altText="AI Chatbot Interface"
            callToAction="Discuss Your Assistant Needs"
          />
          
          <ServiceDetail
            title="Workflow Automation"
            description="Connect your applications and systems to eliminate manual data entry, reduce errors, and streamline operations."
            benefits={[
              "Automated data entry and transfer between systems",
              "Custom trigger-based workflows",
              "Integration with your existing software stack",
              "Error reduction and consistency improvement",
              "Time savings of 10-30 hours per week on average"
            ]}
            icon={<Workflow className="w-12 h-12" />}
            imagePosition="right"
            imageSrc="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
            altText="Workflow Automation Diagram"
            callToAction="Streamline Your Workflows"
          />
          
          <ServiceDetail
            title="AI Data Insights"
            description="Transform your raw business data into actionable intelligence through automated analysis and reporting."
            benefits={[
              "Automated data collection and processing",
              "Custom dashboards and visualization",
              "Predictive analytics for business forecasting",
              "Pattern recognition and trend identification",
              "Scheduled reports and real-time alerting"
            ]}
            icon={<BarChart3 className="w-12 h-12" />}
            imagePosition="left"
            imageSrc="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
            altText="Data Analytics Dashboard"
            callToAction="Unlock Your Data Potential"
          />
          
          <ServiceDetail
            title="Custom AI Development"
            description="Build tailored AI solutions for your unique business challenges using cutting-edge AI technologies."
            benefits={[
              "Bespoke AI applications for your specific needs",
              "Seamless integration with your existing systems",
              "Scalable architecture that grows with your business",
              "Ongoing support and maintenance",
              "Full ownership of your custom solution"
            ]}
            icon={<Code className="w-12 h-12" />}
            imagePosition="right"
            imageSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"
            altText="Custom AI Development"
            callToAction="Discuss Your Custom Project"
          />
        </div>
      </section>
      
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Services;
