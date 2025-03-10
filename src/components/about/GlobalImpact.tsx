
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import { WorldMap } from '@/components/ui/world-map';

const GlobalImpact = () => {
  return (
    <section className="py-16 px-4 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <AnimatedText text="Global Impact" tag="h2" className="text-3xl font-bold mb-8 text-center" />
        
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            From Silicon Valley startups to European enterprises, I've helped businesses worldwide harness the power of AI automation.
          </p>
        </div>
        
        <div className="glassmorphism p-6 rounded-xl">
          <WorldMap
            dots={[
              {
                start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
                end: { lat: 51.5074, lng: -0.1278 }, // London
              },
              {
                start: { lat: 51.5074, lng: -0.1278 }, // London
                end: { lat: 48.8566, lng: 2.3522 }, // Paris
              },
              {
                start: { lat: 48.8566, lng: 2.3522 }, // Paris
                end: { lat: 52.5200, lng: 13.4050 }, // Berlin
              },
              {
                start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
                end: { lat: -33.8688, lng: 151.2093 }, // Sydney
              },
              {
                start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
                end: { lat: 1.3521, lng: 103.8198 }, // Singapore
              },
            ]}
            lineColor="#00BFA6"
          />
        </div>
      </div>
    </section>
  );
};

export default GlobalImpact;
