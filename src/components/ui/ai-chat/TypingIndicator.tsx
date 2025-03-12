
import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 p-3 text-white/70"
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">AI is typing...</span>
    </motion.div>
  );
};
