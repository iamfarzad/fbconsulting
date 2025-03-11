
import React from 'react';
import { motion } from 'framer-motion';

interface TimelinePoint {
  year: number;
  label: string;
}

interface TimelineProgressProps {
  timelinePoints: TimelinePoint[];
}

const TimelineProgress: React.FC<TimelineProgressProps> = ({ timelinePoints }) => {
  return (
    <div className="hidden lg:block mb-12 relative">
      <div className="absolute left-0 right-0 h-1 bg-muted top-5"></div>
      <div className="flex justify-between relative">
        {timelinePoints.map((point, index) => (
          <motion.div 
            key={index}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm z-10"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: index * 0.1 + 0.2 }}
            >
              {point.year}
            </motion.div>
            <motion.p 
              className="mt-2 text-xs font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {point.label}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineProgress;
