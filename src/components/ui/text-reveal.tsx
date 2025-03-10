
"use client";

import { FC, ReactNode, useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const words = text.split(" ");
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 1", "end 0.3"] // Adjusted to start immediately and end later
  });
  
  return (
    <div 
      ref={targetRef} 
      className={cn(
        "relative z-0 h-[100vh] min-h-[500px]", // Reduced height and added min-height
        className
      )}
    >
      <div className="sticky top-[40%] mx-auto flex h-[60vh] items-center justify-center bg-transparent px-6">
        <p className="flex flex-wrap text-center max-w-4xl text-2xl text-black/20 dark:text-white/20 md:p-8 md:text-3xl lg:p-10 xl:text-5xl lg:text-7xl font-extrabold">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word 
                key={i} 
                progress={scrollYProgress} 
                range={[start, end]}
              >
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({
  children,
  progress,
  range
}) => {
  const opacity = useTransform(progress, range, [0, 1]);
  
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <span className="absolute opacity-30">{children}</span>
      <motion.span 
        style={{
          opacity: opacity
        }} 
        className="text-black dark:text-white"
      >
        {children}
      </motion.span>
    </span>
  );
};

export { TextRevealByWord };
