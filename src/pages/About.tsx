import AboutStructuredData from '@/components/about/AboutStructuredData';
import AboutHero from '@/components/about/AboutHero';
import GlobalImpact from '@/components/about/GlobalImpact';
import BackgroundExperience from '@/components/about/BackgroundExperience';
import SkillsTechnologies from '@/components/about/SkillsTechnologies';
import AIJourney from '@/components/about/AIJourney';
import BackgroundCTA from '@/components/about/BackgroundCTA';

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
        <div className="p-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">About Page</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This is the About page. We're currently updating our components to fix import issues.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
