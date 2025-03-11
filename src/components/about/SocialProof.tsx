
import React from 'react';
import { motion } from 'framer-motion';
import CountUp from './CountUp';

interface SocialProofProps {
  accentColor: string;
}

const SocialProof: React.FC<SocialProofProps> = ({ accentColor }) => {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
      <motion.div 
        className="p-2 bg-background rounded-md"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p 
          className={`text-xl font-bold text-${accentColor}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <CountUp end={7} duration={2} />+
        </motion.p>
        <p className="text-xs">Years Experience</p>
      </motion.div>
      
      <motion.div 
        className="p-2 bg-background rounded-md"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p 
          className={`text-xl font-bold text-${accentColor}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <CountUp end={30} duration={2} />+
        </motion.p>
        <p className="text-xs">Projects</p>
      </motion.div>
      
      <motion.div 
        className="p-2 bg-background rounded-md"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.p 
          className={`text-xl font-bold text-${accentColor}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <CountUp end={95} duration={2} />%
        </motion.p>
        <p className="text-xs">Success Rate</p>
      </motion.div>
    </div>
  );
};

export default SocialProof;
