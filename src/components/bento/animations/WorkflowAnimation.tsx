
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const WorkflowAnimation: React.FC = () => {
  return (
    <motion.div className="flex items-center space-x-3">
      <motion.div 
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-teal flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-teal" />
        </div>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ duration: 1 }}
        className="h-0.5 bg-teal"
      />
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <CheckCircle className="w-8 h-8 text-teal" />
      </motion.div>
    </motion.div>
  );
};

export default WorkflowAnimation;
