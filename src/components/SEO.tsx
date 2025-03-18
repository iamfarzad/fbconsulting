
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  structuredData?: Record<string, any> | Record<string, any>[];
  keywords?: string;
  author?: string;
  language?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = '/og-image.png',
  ogType = 'website',
  structuredData,
  keywords,
  author = 'AI Automation Consultant',
  language,
}) => {
  // Use a try-catch block to handle potential errors with window access
  let siteUrl = '';
  let pageUrl = '';
  try {
    siteUrl = typeof window !== 'undefined' && window.location ? window.location.origin : '';
    pageUrl = canonicalUrl || (typeof window !== 'undefined' && window.location ? window.location.href : '');
  } catch (error) {
    console.error('Error accessing window.location:', error);
    // Fallback values
    siteUrl = 'https://fbconsulting.com';
    pageUrl = canonicalUrl || 'https://fbconsulting.com';
  }
  
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  // Default organization structured data to be merged with page-specific data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organization`,
    "name": "F.B Consulting",
    "url": siteUrl,
    "logo": `${siteUrl}/og-image.png`,
    "description": "AI automation consulting services for businesses looking to reduce costs and increase efficiency",
    "sameAs": [
      "https://linkedin.com/in/yourprofile", 
      "https://twitter.com/yourprofile"
    ]
  };

  // Combine with page-specific structured data if provided
  let fullStructuredData = structuredData;
  if (Array.isArray(structuredData)) {
    fullStructuredData = [organizationSchema, ...structuredData];
  } else if (structuredData) {
    fullStructuredData = [organizationSchema, structuredData];
  } else {
    fullStructuredData = [organizationSchema];
  }
  
  // Wrap the Helmet in a try-catch to prevent crashes
  try {
    return (
      <Helmet>
        {/* Basic meta tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        {keywords && <meta name="keywords" content={keywords} />}
        {author && <meta name="author" content={author} />}
        {language && <html lang={language} />}
      
      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="F.B Consulting" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Structured data */}
      {fullStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(fullStructuredData)}
        </script>
      )}
      </Helmet>
    );
  } catch (error) {
    console.error('Error rendering Helmet:', error);
    // Return null or a minimal component that won't crash
    return <title>{title}</title>;
  }
};

export default SEO;
