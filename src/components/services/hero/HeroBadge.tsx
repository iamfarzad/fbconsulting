
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const HeroBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal/20 to-teal/10 backdrop-blur-sm border border-teal/20 mb-6"
    >
      <div className="w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-teal" />
      </div>
      <span className="text-sm font-medium text-white">AI-Powered Solutions</span>
    </motion.div>
  );
};

export default HeroBadge;
