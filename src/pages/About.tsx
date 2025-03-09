
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedText from '@/components/AnimatedText';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import DotPattern from '@/components/ui/dot-pattern';

const About = () => {
  useEffect(() => {
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);

  // Structured data for the person
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "AI Automation Expert",
    "jobTitle": "AI Automation Consultant",
    "description": "With over 10 years of experience in business automation and AI integration, I help companies streamline operations, reduce costs, and scale efficiently.",
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Business Process Automation",
      "Natural Language Processing",
      "Data Analytics"
    ]
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="About - AI Automation Ally | Expert Consultant"
        description="Learn about my 10+ years of experience helping businesses leverage AI and automation technology to reduce costs, streamline operations, and drive growth."
        ogType="website"
        structuredData={personStructuredData}
      />
      
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 relative">
          <DotPattern width={16} height={16} cx={8} cy={8} cr={1.5} className="opacity-25" />
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <AnimatedText
                  text="About Me"
                  tag="h1"
                  className="text-3xl md:text-5xl font-bold mb-6"
                />
                <AnimatedText
                  text="AI Automation Expert & Business Consultant"
                  tag="h2"
                  delay={200}
                  className="text-xl text-muted-foreground mb-8"
                />
                <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                  <p className="mb-4">
                    With over 10 years of experience in business automation and AI integration, I help companies streamline operations, reduce costs, and scale efficiently.
                  </p>
                  <p className="mb-6">
                    My approach combines deep technical expertise with business acumen, ensuring that AI solutions deliver measurable ROI and solve real business problems.
                  </p>
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <Calendar size={20} />
                    Book a Free Consultation
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                    alt="AI Automation Consultant" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Background & Experience */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <AnimatedText
              text="My Background"
              tag="h2"
              className="text-3xl font-bold mb-8 text-center"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glassmorphism p-6 rounded-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <h3 className="text-xl font-semibold mb-3">Professional Journey</h3>
                <p className="mb-3">
                  Before founding AI Automation Ally, I spent a decade working with Fortune 500 companies, helping them implement cutting-edge automation solutions and AI technologies.
                </p>
                <p>
                  My experience spans industries from finance and healthcare to retail and manufacturing, giving me a broad perspective on how AI can transform various business models.
                </p>
              </div>
              
              <div className="glassmorphism p-6 rounded-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                <h3 className="text-xl font-semibold mb-3">Education & Expertise</h3>
                <p className="mb-3">
                  With a background in Computer Science and an MBA, I bridge the gap between technical implementation and business strategy.
                </p>
                <p>
                  I stay at the forefront of AI advancements through continuous learning and active participation in technology communities, ensuring my clients receive the most innovative solutions.
                </p>
              </div>
              
              <div className="glassmorphism p-6 rounded-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                <h3 className="text-xl font-semibold mb-3">Business Philosophy</h3>
                <p className="mb-3">
                  I believe that AI should be accessible to businesses of all sizes. My consulting approach focuses on pragmatic solutions that deliver immediate value while building toward long-term transformation.
                </p>
                <p>
                  Every recommendation I make is backed by data and tailored to each client's unique challenges and goals.
                </p>
              </div>
              
              <div className="glassmorphism p-6 rounded-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
                <h3 className="text-xl font-semibold mb-3">Personal Touch</h3>
                <p className="mb-3">
                  I'm not just a consultant—I'm a partner in your business growth. I take the time to understand your operations deeply before suggesting any automation solutions.
                </p>
                <p>
                  My clients appreciate my jargon-free communication style and hands-on approach to implementation and training.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Skills & Technologies */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <AnimatedText
              text="Skills & Technologies"
              tag="h2"
              className="text-3xl font-bold mb-8 text-center"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                "Machine Learning", "Natural Language Processing", 
                "Workflow Automation", "Process Optimization",
                "Chatbot Development", "Data Analysis", 
                "Systems Integration", "Cloud Solutions",
                "Virtual Assistants", "RPA", 
                "API Development", "Business Intelligence"
              ].map((skill, index) => (
                <div 
                  key={skill}
                  className="bg-primary/10 rounded-lg px-4 py-3 text-center opacity-0 animate-fade-in-up" 
                  style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
