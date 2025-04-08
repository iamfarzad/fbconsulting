
import AboutStructuredData from '@/components/about/AboutStructuredData';

const About = () => {
  return (
    <>
      <AboutStructuredData />
      <div className="min-h-screen bg-white dark:bg-black">
        {/* Import these components with proper syntax after fixing their exports */}
        {/* <AboutHero />
        <GlobalImpact />
        <BackgroundExperience />
        <SkillsTechnologies />
        <AIJourney />
        <BackgroundCTA /> */}
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
