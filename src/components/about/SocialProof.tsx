
import React from 'react';
import { motion } from 'framer-motion';
import CountUp from './CountUp';

interface SocialProofProps {
  accentColor: string;
}

const SocialProof: React.FC<SocialProofProps> = ({ accentColor }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
  };

  const statItems = [
    { value: 7, label: "Years Experience" },
    { value: 30, label: "Projects" },
    { value: 95, label: "Success Rate", suffix: "%" }
  ];

  return (
    <motion.div 
      className="mt-3 grid grid-cols-3 gap-2 text-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          className="p-2 bg-background rounded-md hover:shadow-lg transition-shadow"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          <motion.p 
            className={`text-xl font-bold text-${accentColor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.2 }}
          >
            <CountUp end={item.value} duration={2} />
            {item.suffix || "+"}
          </motion.p>
          <p className="text-xs">{item.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SocialProof;
