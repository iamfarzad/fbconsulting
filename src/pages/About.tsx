
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // About page content has been moved to the homepage, so redirect there
    navigate('/', { replace: true });
  }, [navigate]);

  // This renders temporarily during redirect
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="About - AI Automation Ally | Expert Consultant" 
        description="Learn about my 10+ years of experience helping businesses leverage AI and automation technology to reduce costs, streamline operations, and drive growth."
      />
      
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-3xl font-bold mb-6">Redirecting to Home Page...</h1>
          <p>The about page content has been integrated into our homepage.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
