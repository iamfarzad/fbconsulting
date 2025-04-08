
import { AboutHero } from '@/components/about/AboutHero';
import { GlobalImpact } from '@/components/about/GlobalImpact';
import { BackgroundExperience } from '@/components/about/BackgroundExperience';
import { SkillsTechnologies } from '@/components/about/SkillsTechnologies';
import { AIJourney } from '@/components/about/AIJourney';
import { BackgroundCTA } from '@/components/about/BackgroundCTA';
import { AboutStructuredData } from '@/components/about/AboutStructuredData';

const About = () => {
  return (
    <>
      <AboutStructuredData />
      <div className="min-h-screen bg-white dark:bg-black">
        <AboutHero />
        <GlobalImpact />
        <BackgroundExperience />
        <SkillsTechnologies />
        <AIJourney />
        <BackgroundCTA />
      </div>
    </>
  );
};

export default About;
