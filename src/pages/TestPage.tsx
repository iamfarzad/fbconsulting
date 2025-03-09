
import React from 'react';
import DotPattern from '@/components/ui/dot-pattern';

const TestPage = () => {
  console.log("Test page rendering");
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      <DotPattern width={18} height={18} cx={9} cy={9} cr={2} className="opacity-25" />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold">Test Page Working</h1>
        <p className="mt-4">If you can see this, routing is working correctly.</p>
      </div>
    </div>
  );
};

export default TestPage;
