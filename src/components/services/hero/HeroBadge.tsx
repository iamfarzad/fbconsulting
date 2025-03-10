
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const HeroBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6"
    >
      <Sparkles className="w-4 h-4 text-white" />
      <span className="text-sm font-medium text-white">AI-Powered Solutions</span>
    </motion.div>
  );
};

export default HeroBadge;
