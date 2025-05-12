
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  once?: boolean;
  delay?: number;
  animation?: 'fade-in-up' | 'text-reveal' | 'blur-in';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  once = true,
  delay = 0,
  animation = 'fade-in-up',
  tag: Tag = 'span',
}) => {
  // Create a properly typed ref that matches the HTML element type for the selected tag
  const textRef = useRef<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-' + animation);
            }, delay);

            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove('animate-' + animation);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, [animation, delay, once]);

  return (
    <Tag
      ref={textRef as React.RefObject<any>}
      className={cn('opacity-0', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {text}
    </Tag>
  );
};

export default AnimatedText;
