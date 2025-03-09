
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ConsultationAnimation: React.FC = () => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 2,
      }}
      className="text-teal"
    >
      <Sparkles className="w-10 h-10" />
    </motion.div>
  );
};

export default ConsultationAnimation;
