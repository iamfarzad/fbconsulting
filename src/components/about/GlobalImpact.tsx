
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import { WorldMap } from '@/components/ui/world-map';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const GlobalImpact = () => {
  return (
    <section className="py-16 px-4 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-[#fe5a1d]/10 p-3 rounded-full">
              <Globe className="w-6 h-6 text-[#fe5a1d]" />
            </div>
          </div>
          
          <AnimatedText 
            text="Global Impact" 
            tag="h2" 
            className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#fe5a1d] to-[#fe5a1d]/70" 
          />
          
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-[#fe5a1d]/80 to-[#fe5a1d]/30 mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
          />
        </motion.div>
        
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            Based in Oslo, Norway, I've lived and worked across Europe, the Middle East, and Asia. Having experienced diverse business cultures firsthand, I help organizations adapt AI to their specific regional needs—because AI should work for any business, anywhere in the world.
          </p>
        </div>
        
        <motion.div 
          className="glassmorphism p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ y: -5, boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)" }}
        >
          <WorldMap
            dots={[
              {
                start: { lat: 59.9139, lng: 10.7522 }, // Oslo
                end: { lat: 37.7749, lng: -122.4194 }, // San Francisco
              },
              {
                start: { lat: 59.9139, lng: 10.7522 }, // Oslo
                end: { lat: 51.5074, lng: -0.1278 }, // London
              },
              {
                start: { lat: 59.9139, lng: 10.7522 }, // Oslo
                end: { lat: 48.8566, lng: 2.3522 }, // Paris
              },
              {
                start: { lat: 59.9139, lng: 10.7522 }, // Oslo
                end: { lat: 52.5200, lng: 13.4050 }, // Berlin
              },
              {
                start: { lat: 59.9139, lng: 10.7522 }, // Oslo
                end: { lat: 41.0082, lng: 28.9784 }, // Istanbul
              },
              {
                start: { lat: 59.9139, lng: 10.7522 }, // Oslo
                end: { lat: 25.2048, lng: 55.2708 }, // Dubai
              },
              {
                start: { lat: 59.9139, lng: 10.7522 }, // Oslo
                end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
              },
              {
                start: { lat: 59.9139, lng: 10.7522 }, // Oslo
                end: { lat: 22.3193, lng: 114.1694 }, // Hong Kong
              },
              {
                start: { lat: 59.9139, lng: 10.7522 }, // Oslo
                end: { lat: 1.3521, lng: 103.8198 }, // Singapore
              },
            ]}
            lineColor="#fe5a1d"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalImpact;
