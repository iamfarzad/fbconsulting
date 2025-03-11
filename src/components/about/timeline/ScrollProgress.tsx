
import React from 'react';
import { motion, useScroll } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed left-0 top-0 right-0 h-1 bg-primary/20 z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

export default ScrollProgress;
