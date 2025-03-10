
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChangelogViewer from '@/components/changelog/ChangelogViewer';
import SEO from '@/components/SEO';
import { usePageViewTracking } from '@/hooks/useAnalytics';

const Changelog: React.FC = () => {
  usePageViewTracking("AI Automation Ally - Changelog");

  return (
    <>
      <SEO
        title="Changelog - AI Automation Ally"
        description="View the complete changelog history for AI Automation Ally, including recent updates, improvements, and planned features."
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          <ChangelogViewer />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Changelog;
