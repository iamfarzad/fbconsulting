
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import DottedMap from 'dotted-map';
import { useLanguage } from '@/contexts/LanguageContext';

const GlobalImpact = () => {
  const { t, language } = useLanguage();
  const isNorwegian = language === 'no';
  
  // Create a dotted map with points representing global impact
  const map = new DottedMap({ height: 50, grid: 'vertical' });
  
  // Add points for global reach
  map.addPin({
    lat: 59.9139,
    lng: 10.7522,
    svgOptions: { color: '#fe5a1d', radius: 0.5 }  // Oslo
  });
  
  // Add more impact points
  [
    { lat: 40.7128, lng: -74.0060 }, // New York
    { lat: 51.5074, lng: -0.1278 },  // London
    { lat: 48.8566, lng: 2.3522 },   // Paris
    { lat: 52.5200, lng: 13.4050 },  // Berlin
    { lat: 25.2048, lng: 55.2708 },  // Dubai
    { lat: 35.6762, lng: 139.6503 }, // Tokyo
    { lat: -33.8688, lng: 151.2093 }, // Sydney
    { lat: 1.3521, lng: 103.8198 },  // Singapore
    { lat: 19.4326, lng: -99.1332 }, // Mexico City
    { lat: -23.5505, lng: -46.6333 }, // São Paulo
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
  ].forEach(({ lat, lng }) => {
    map.addPin({ lat, lng, svgOptions: { color: '#fe5a1d', radius: 0.4 } });
  });
  
  const svgMap = map.getSVG({
    radius: 0.35,
    color: '#ffffff',
    shape: 'circle',
    backgroundColor: 'transparent'
  });
  
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div 
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#fe5a1d]/10 text-[#fe5a1d] text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {isNorwegian ? 'GLOBAL REKKEVIDDE' : 'GLOBAL REACH'}
          </motion.div>
          
          <AnimatedText
            text={isNorwegian ? 'Global Innvirkning' : 'Global Impact'}
            className="text-4xl md:text-5xl font-bold mb-6"
            tag="h2"
          />
          
          <motion.div 
            className="max-w-2xl mx-auto text-lg text-white/70 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>
              {isNorwegian
                ? 'Jeg har bistått bedrifter i mer enn 10 land med å implementere AI-automatiseringsløsninger som reduserer kostnader og forbedrer effektiviteten.'
                : 'I\'ve helped businesses in more than 10 countries implement AI automation solutions that reduce costs and improve efficiency.'}
            </p>
          </motion.div>
        </div>
        
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div 
            className="w-full"
            dangerouslySetInnerHTML={{ __html: svgMap }}
          />
          
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-[#fe5a1d]/5 blur-3xl rounded-full -z-10"></div>
          
          {/* Stats overlay */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8">
            <motion.div 
              className="stat-item p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#fe5a1d] text-3xl md:text-4xl font-bold mb-1">10+</h3>
              <p className="text-white/70 text-sm">{isNorwegian ? 'Land Bistått' : 'Countries Served'}</p>
            </motion.div>
            
            <motion.div 
              className="stat-item p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#fe5a1d] text-3xl md:text-4xl font-bold mb-1">30+</h3>
              <p className="text-white/70 text-sm">{isNorwegian ? 'Prosjekter Levert' : 'Projects Delivered'}</p>
            </motion.div>
            
            <motion.div 
              className="stat-item p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#fe5a1d] text-3xl md:text-4xl font-bold mb-1">40%</h3>
              <p className="text-white/70 text-sm">{isNorwegian ? 'Gjennomsnittlig Kostnadsreduksjon' : 'Avg. Cost Reduction'}</p>
            </motion.div>
            
            <motion.div 
              className="stat-item p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#fe5a1d] text-3xl md:text-4xl font-bold mb-1">65%</h3>
              <p className="text-white/70 text-sm">{isNorwegian ? 'Gjennomsnittlig Effektivitetsøkning' : 'Avg. Efficiency Gain'}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalImpact;
