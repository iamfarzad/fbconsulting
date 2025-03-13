
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { CounterComponent } from '@/mcp/examples/CounterComponent';
import { BusinessIntelligenceComponent } from '@/mcp/examples/businessIntelligence/BusinessIntelligenceComponent';
import PageHeader from '@/components/PageHeader';

const TestMCP = () => {
  return (
    <>
      <SEO
        title="MCP Test Page"
        description="Testing the Model Context Protocol (MCP) implementation"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          <PageHeader
            title="Model Context Protocol (MCP)"
            subtitle="A pattern for managing application state with a clean separation of concerns"
          />
          
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">What is MCP?</h2>
                <p className="mb-4">
                  The Model Context Protocol (MCP) pattern is an architectural approach that separates concerns
                  into three main components:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Model:</strong> Represents the current state of the application</li>
                  <li><strong>Context:</strong> Provides access to external dependencies and environment</li>
                  <li><strong>Protocol:</strong> Defines how messages are processed to update the model</li>
                </ul>
                <p className="mb-8">
                  These examples demonstrate how MCP can be used to manage application state and interact with external services.
                </p>
                
                <h3 className="text-2xl font-bold mb-4">Basic Counter Example</h3>
                <CounterComponent initialCount={0} minValue={-10} maxValue={10} />
                
                <h3 className="text-2xl font-bold mt-10 mb-4">Business Intelligence Example</h3>
                <p className="mb-4">
                  This example demonstrates how to use MCP to connect to external APIs (like Smithery.ai MCP servers)
                  to gather business intelligence data.
                </p>
                <BusinessIntelligenceComponent />
                
                <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl font-semibold mb-4">Benefits of MCP</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Clear separation of concerns</li>
                    <li>Predictable state updates</li>
                    <li>Easy to test and debug</li>
                    <li>Facilitates complex state management</li>
                    <li>Works well with React's component model</li>
                    <li>Enables seamless integration with external services</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TestMCP;
