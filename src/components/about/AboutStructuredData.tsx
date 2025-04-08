
import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutStructuredData: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About",
    "description": "Learn about our AI consulting services and expertise"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <title>About - AI Consulting Services</title>
      <meta name="description" content="Learn about our AI consulting services and expertise" />
    </Helmet>
  );
};

export default AboutStructuredData;
