
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AboutHero from '@/components/about/AboutHero';
import GlobalImpact from '@/components/about/GlobalImpact';
import BackgroundExperience from '@/components/about/BackgroundExperience';
import SkillsTechnologies from '@/components/about/SkillsTechnologies';
import { getPersonStructuredData } from '@/components/about/AboutStructuredData';

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

  const personStructuredData = getPersonStructuredData();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="About - AI Automation Ally | Expert Consultant" 
        description="Learn about my 10+ years of experience helping businesses leverage AI and automation technology to reduce costs, streamline operations, and drive growth." 
        ogType="website" 
        structuredData={personStructuredData}
        keywords="AI automation expert, business process optimization, startup AI consultant, workflow automation specialist, AI consultant, machine learning expert, AI workflow automation, AI-powered business optimization, AI strategy consultant, business automation expert, AI transformation, AI-driven business optimization, AI business consultant, AI automation coach, AI strategy for small businesses, AI workflow advisor"
      />
      
      <Navbar />
      
      <main className="flex-grow pt-20">
        <AboutHero />
        <GlobalImpact />
        <BackgroundExperience />
        <SkillsTechnologies />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
