
import React, { useEffect } from 'react';
import DotPattern from '@/components/ui/dot-pattern';

const TestPage = () => {
  console.log("Test page rendering");
  
  useEffect(() => {
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-background">
      <DotPattern width={18} height={18} cx={9} cy={9} cr={2} className="opacity-25" />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold">Test Page Working</h1>
        <p className="mt-4">If you can see this, routing is working correctly.</p>
      </div>
    </div>
  );
};

export default TestPage;
