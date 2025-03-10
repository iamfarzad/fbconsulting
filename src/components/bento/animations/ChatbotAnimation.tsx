
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const ChatbotAnimation: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div 
        className="inline-block"
        animate={{ 
          rotate: [0, 10, -10, 10, 0],
        }}
        transition={{ 
          repeat: Infinity,
          repeatType: "mirror",
          duration: 2,
        }}
      >
        <MessageSquare className="w-10 h-10 text-black dark:text-white" />
      </motion.div>
      <motion.div 
        className="mt-1 h-1 w-16 mx-auto bg-black/30 dark:bg-white/30 rounded-full"
        animate={{
          width: [40, 60, 40]
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1.5,
        }}
      />
    </motion.div>
  );
};

export default ChatbotAnimation;
