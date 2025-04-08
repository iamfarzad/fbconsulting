
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  variant = 'default', 
  size = 'md' 
}) => {
  const textColor = {
    default: 'text-black dark:text-white',
    white: 'text-white',
    dark: 'text-black',
  }[variant];

  const fontSize = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <Link to="/" className={cn('font-bold', textColor, fontSize, className)}>
      Farzad-AI
    </Link>
  );
};

export default Logo;
