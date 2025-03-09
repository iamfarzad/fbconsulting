
import React from 'react';

const TestPage = () => {
  console.log("Test page rendering");
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Test Page Working</h1>
      <p className="mt-4">If you can see this, routing is working correctly.</p>
    </div>
  );
};

export default TestPage;
